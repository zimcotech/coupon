import React, { useState, useEffect, useRef, useCallback } from 'react';

export interface UseIntersectionObserverOptions {
  /**
   * Margin around the root element. Defaults to '150px 0px' so content starts
   * rendering slightly before scrolling into viewport, preventing visual pop-in.
   */
  rootMargin?: string;
  /**
   * Either a single number or an array of numbers between 0.0 and 1.0. Defaults to 0.
   */
  threshold?: number | number[];
  /**
   * Element that is used as the viewport for checking visibility of the target.
   * Defaults to the browser viewport if not specified or if null.
   */
  root?: Element | Document | null;
  /**
   * Freeze the state once the element enters the viewport.
   * When true, observer disconnects immediately upon first intersection,
   * guaranteeing the component only renders once in the viewport.
   * Defaults to true.
   */
  freezeOnceVisible?: boolean;
  /**
   * Whether the observer is currently active. Defaults to true.
   */
  enabled?: boolean;
  /**
   * Initial intersection state before observation starts. Defaults to false.
   */
  initialIsIntersecting?: boolean;
  /**
   * Optional callback triggered on visibility change.
   */
  onChange?: (isIntersecting: boolean, entry: IntersectionObserverEntry) => void;
}

export type IntersectionObserverRefCallback<T extends HTMLElement = HTMLElement> = (
  node: T | null
) => void;

export interface UseIntersectionObserverReturn<T extends HTMLElement = HTMLElement> {
  0: IntersectionObserverRefCallback<T>;
  1: boolean;
  2: IntersectionObserverEntry | undefined;
  ref: IntersectionObserverRefCallback<T>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | undefined;
  hasIntersected: boolean;
  [Symbol.iterator](): Iterator<
    IntersectionObserverRefCallback<T> | boolean | IntersectionObserverEntry | undefined
  >;
}

/**
 * useIntersectionObserver
 *
 * Highly performant, scroll-based viewport loading trigger.
 * Uses native IntersectionObserver to detect when an element enters the viewport.
 * With `freezeOnceVisible: true` (default), the observer immediately unobserves the target
 * once visible, preventing unnecessary recalculations and ensuring content only renders once.
 *
 * Supports both tuple destructuring:
 *   const [ref, isIntersecting] = useIntersectionObserver();
 * and object destructuring:
 *   const { ref, isIntersecting } = useIntersectionObserver();
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLElement>(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn<T> {
  const {
    threshold = 0,
    root = null,
    rootMargin = '150px 0px',
    freezeOnceVisible = true,
    enabled = true,
    initialIsIntersecting = false,
    onChange,
  } = options;

  const [state, setState] = useState<{
    isIntersecting: boolean;
    entry?: IntersectionObserverEntry;
  }>({
    isIntersecting: initialIsIntersecting,
    entry: undefined,
  });

  const nodeRef = useRef<T | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const frozenRef = useRef<boolean>(false);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  // Cleanup helper
  const disconnectObserver = useCallback(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }
  }, []);

  // Ref callback to capture the DOM element
  const refCallback = useCallback<IntersectionObserverRefCallback<T>>(
    (node) => {
      // If already frozen and visible, do not re-observe
      if (frozenRef.current && freezeOnceVisible) {
        return;
      }

      nodeRef.current = node;

      // Clean up existing observer
      disconnectObserver();

      if (!enabled || !node) {
        return;
      }

      // Fallback for SSR or environments without IntersectionObserver
      if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
        setState({ isIntersecting: true, entry: undefined });
        frozenRef.current = true;
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;

          const isElementIntersecting = entry.isIntersecting;

          if (isElementIntersecting && freezeOnceVisible) {
            frozenRef.current = true;
            disconnectObserver();
            setState({ isIntersecting: true, entry });
            onChangeRef.current?.(true, entry);
          } else if (!frozenRef.current) {
            setState({ isIntersecting: isElementIntersecting, entry });
            onChangeRef.current?.(isElementIntersecting, entry);
          }
        },
        {
          threshold,
          root,
          rootMargin,
        }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [disconnectObserver, enabled, freezeOnceVisible, root, rootMargin, threshold]
  );

  // Clean up observer on unmount
  useEffect(() => {
    return () => {
      disconnectObserver();
    };
  }, [disconnectObserver]);

  // Construct return structure that works for both array and object destructuring
  const returnObject = {
    0: refCallback,
    1: state.isIntersecting,
    2: state.entry,
    ref: refCallback,
    isIntersecting: state.isIntersecting,
    entry: state.entry,
    hasIntersected: state.isIntersecting,
    *[Symbol.iterator]() {
      yield refCallback;
      yield state.isIntersecting;
      yield state.entry;
    },
  } as UseIntersectionObserverReturn<T>;

  return returnObject;
}

/**
 * LazyViewportSection
 *
 * Lightweight wrapper component utilizing useIntersectionObserver.
 * Renders a placeholder skeleton until scrolled into the viewport, then mounts the real content.
 */
export interface LazyViewportSectionProps {
  children: React.ReactNode;
  placeholder: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
  minHeight?: string | number;
  onVisible?: () => void;
}

export const LazyViewportSection: React.FC<LazyViewportSectionProps> = ({
  children,
  placeholder,
  rootMargin = '150px 0px',
  threshold = 0,
  className = '',
  minHeight,
  onVisible,
}) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    rootMargin,
    threshold,
    freezeOnceVisible: true,
    onChange: (visible) => {
      if (visible && onVisible) onVisible();
    },
  });

  return (
    <div
      ref={ref}
      className={className}
      style={minHeight ? { minHeight } : undefined}
    >
      {isIntersecting ? children : placeholder}
    </div>
  );
};
