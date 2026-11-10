import React, { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Info,
  CheckCircle2,
  AlertCircle,
  Trash2,
  X,
  HelpCircle,
} from 'lucide-react';
import { cn } from '../components/ui/shadcn';

export type PopupVariant = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: PopupVariant;
  icon?: 'trash' | 'warning' | 'help' | 'info';
}

export interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  variant?: PopupVariant;
}

interface CustomPopupContextType {
  showConfirm: (options: ConfirmOptions | string) => Promise<boolean>;
  showAlert: (options: AlertOptions | string) => Promise<void>;
}

const CustomPopupContext = createContext<CustomPopupContextType | undefined>(undefined);

export const useCustomPopup = (): CustomPopupContextType => {
  const context = useContext(CustomPopupContext);
  if (!context) {
    throw new Error('useCustomPopup must be used within a CustomPopupProvider');
  }
  return context;
};

interface PopupState {
  isOpen: boolean;
  type: 'confirm' | 'alert';
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  buttonText: string;
  variant: PopupVariant;
  icon: 'trash' | 'warning' | 'help' | 'info';
}

export const CustomPopupProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [popup, setPopup] = useState<PopupState>({
    isOpen: false,
    type: 'confirm',
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    buttonText: 'OK',
    variant: 'info',
    icon: 'info',
  });

  const resolverRef = useRef<((value: any) => void) | null>(null);

  const showConfirm = useCallback((options: ConfirmOptions | string): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      if (typeof options === 'string') {
        setPopup({
          isOpen: true,
          type: 'confirm',
          title: 'Please Confirm',
          message: options,
          confirmText: 'Confirm',
          cancelText: 'Cancel',
          buttonText: 'OK',
          variant: 'warning',
          icon: 'warning',
        });
      } else {
        const isDeleteAction =
          options.variant === 'danger' ||
          options.confirmText?.toLowerCase().includes('delete') ||
          options.confirmText?.toLowerCase().includes('remove');

        setPopup({
          isOpen: true,
          type: 'confirm',
          title: options.title || (isDeleteAction ? 'Confirm Deletion' : 'Please Confirm'),
          message: options.message,
          confirmText: options.confirmText || 'Confirm',
          cancelText: options.cancelText || 'Cancel',
          buttonText: 'OK',
          variant: options.variant || (isDeleteAction ? 'danger' : 'info'),
          icon: options.icon || (isDeleteAction ? 'trash' : options.variant === 'warning' ? 'warning' : 'help'),
        });
      }
    });
  }, []);

  const showAlert = useCallback((options: AlertOptions | string): Promise<void> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      if (typeof options === 'string') {
        setPopup({
          isOpen: true,
          type: 'alert',
          title: 'Notice',
          message: options,
          confirmText: 'OK',
          cancelText: '',
          buttonText: 'Understood',
          variant: 'info',
          icon: 'info',
        });
      } else {
        setPopup({
          isOpen: true,
          type: 'alert',
          title: options.title || 'Notice',
          message: options.message,
          confirmText: 'OK',
          cancelText: '',
          buttonText: options.buttonText || 'Understood',
          variant: options.variant || 'info',
          icon: options.variant === 'warning' ? 'warning' : options.variant === 'danger' ? 'trash' : 'info',
        });
      }
    });
  }, []);

  const handleConfirm = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const handleCancel = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  const handleDismissAlert = () => {
    setPopup((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(undefined);
      resolverRef.current = null;
    }
  };

  // Keyboard shortcut listener for Enter and Escape
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (popup.type === 'confirm') handleCancel();
      else handleDismissAlert();
    } else if (e.key === 'Enter') {
      if (popup.type === 'confirm') handleConfirm();
      else handleDismissAlert();
    }
  };

  return (
    <CustomPopupContext.Provider value={{ showConfirm, showAlert }}>
      {children}

      <AnimatePresence>
        {popup.isOpen && (
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 select-none"
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs cursor-pointer"
              onClick={popup.type === 'confirm' ? handleCancel : handleDismissAlert}
            />

            {/* Custom Modal Dialog Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 8 }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="relative z-[101] w-full max-w-md rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 sm:p-7 text-left shadow-2xl focus:outline-none"
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={popup.type === 'confirm' ? handleCancel : handleDismissAlert}
                className="absolute right-4.5 top-4.5 h-8 w-8 rounded-full border border-slate-200/90 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 flex items-center justify-center cursor-pointer transition-all shadow-xs group"
                aria-label="Close"
              >
                <X className="h-4 w-4 transition-transform group-hover:scale-110" />
              </button>

              <div className="flex items-start gap-4">
                {/* Variant Icon Badge */}
                <div
                  className={cn(
                    'w-11 h-11 rounded-2xl shrink-0 flex items-center justify-center border shadow-xs',
                    popup.variant === 'danger' &&
                      'bg-red-50 dark:bg-red-950/60 border-red-200/80 dark:border-red-900/60 text-red-600 dark:text-red-400',
                    popup.variant === 'warning' &&
                      'bg-amber-50 dark:bg-amber-950/60 border-amber-200/80 dark:border-amber-900/60 text-amber-600 dark:text-amber-400',
                    popup.variant === 'info' &&
                      'bg-blue-50 dark:bg-blue-950/60 border-blue-200/80 dark:border-blue-900/60 text-blue-600 dark:text-blue-400',
                    popup.variant === 'success' &&
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200/80 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400'
                  )}
                >
                  {popup.icon === 'trash' && <Trash2 className="h-5 w-5" />}
                  {popup.icon === 'warning' && <AlertTriangle className="h-5 w-5" />}
                  {popup.icon === 'help' && <HelpCircle className="h-5 w-5" />}
                  {popup.icon === 'info' && <Info className="h-5 w-5" />}
                </div>

                <div className="space-y-1.5 flex-1 pr-6">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {popup.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {popup.message}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                {popup.type === 'confirm' ? (
                  <>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="h-10 px-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                    >
                      {popup.cancelText}
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      autoFocus
                      className={cn(
                        'h-10 px-5 rounded-xl text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors shadow-sm',
                        popup.variant === 'danger'
                          ? 'bg-red-600 hover:bg-red-700 active:bg-red-800'
                          : popup.variant === 'warning'
                          ? 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800'
                          : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
                      )}
                    >
                      {popup.confirmText}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleDismissAlert}
                    autoFocus
                    className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs sm:text-sm font-semibold cursor-pointer transition-colors shadow-sm"
                  >
                    {popup.buttonText}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </CustomPopupContext.Provider>
  );
};
