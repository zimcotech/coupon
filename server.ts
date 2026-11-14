import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  // Trust Heroku's reverse proxy router for accurate protocol/IP headers
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(express.json());

  // Health check endpoint for Heroku and uptime monitors
  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({
      status: 'ok',
      environment: isProduction ? 'production' : 'development',
      uptime: Math.floor(process.uptime()),
    });
  });

  if (!isProduction) {
    // Development mode: mount Vite dev middleware inside Express
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode (Heroku): serve built static assets from dist/
    const distPath = path.resolve(__dirname, 'dist');
    const indexHtmlPath = path.join(distPath, 'index.html');

    if (!fs.existsSync(indexHtmlPath)) {
      console.error(
        'Missing dist/index.html. Run "npm run build" before starting the production server.'
      );
      process.exit(1);
    }

    // Serve static files with smart cache headers
    app.use(
      express.static(distPath, {
        index: false,
        setHeaders: (res, filePath) => {
          if (filePath.includes(`${path.sep}assets${path.sep}`)) {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          } else if (filePath.endsWith('.html')) {
            res.setHeader('Cache-Control', 'no-cache');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=3600');
          }
        },
      })
    );

    // Ensure unknown API endpoints return JSON 404 rather than HTML
    app.all('/api/*', (_req: Request, res: Response) => {
      res.status(404).json({ error: 'API route not found' });
    });

    // SPA fallback: serve index.html for all client-side routes
    app.get('*', (_req: Request, res: Response) => {
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile(indexHtmlPath);
    });
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(
      `Couponify server listening on http://0.0.0.0:${port} (${
        isProduction ? 'production' : 'development'
      })`
    );
  });

  // Graceful shutdown for Heroku dyno cycling (SIGTERM) and local interrupts
  const shutdown = (signal: string) => {
    console.log(`Received ${signal}, shutting down server gracefully...`);
    server.close(() => {
      process.exit(0);
    });
    setTimeout(() => {
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
