import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface DealsLoadingContextType {
  isGlobalLoading: boolean;
  setGlobalLoading: (loading: boolean) => void;
  isSectionLoading: (sectionId: string) => boolean;
  setSectionLoading: (sectionId: string, loading: boolean) => void;
  triggerLazyFetch: (sectionId?: string, durationMs?: number) => Promise<void>;
}

const DealsLoadingContext = createContext<DealsLoadingContextType | undefined>(undefined);

export const useDealsLoading = (): DealsLoadingContextType => {
  const context = useContext(DealsLoadingContext);
  if (!context) {
    throw new Error('useDealsLoading must be used within a DealsLoadingProvider');
  }
  return context;
};

interface DealsLoadingProviderProps {
  children: ReactNode;
}

export const DealsLoadingProvider: React.FC<DealsLoadingProviderProps> = ({ children }) => {
  // Global loading state: initially true for 450ms to simulate asynchronous lazy fetching on cold start
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(true);
  const [sectionLoadingMap, setSectionLoadingMap] = useState<Record<string, boolean>>({
    'verified-deals': true,
    'black-friday': true,
    'new-arrivals': true,
    'search-deals': false,
    'brand-deals': false,
    'category-deals': false,
  });

  // Initial lazy fetch simulation to demonstrate the zero-shift skeleton shimmer on page boot
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGlobalLoading(false);
      setSectionLoadingMap((prev) => ({
        ...prev,
        'verified-deals': false,
        'black-friday': false,
        'new-arrivals': false,
      }));
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  const isSectionLoading = useCallback(
    (sectionId: string): boolean => {
      if (isGlobalLoading) return true;
      return Boolean(sectionLoadingMap[sectionId]);
    },
    [isGlobalLoading, sectionLoadingMap]
  );

  const setSectionLoading = useCallback((sectionId: string, loading: boolean) => {
    setSectionLoadingMap((prev) => ({
      ...prev,
      [sectionId]: loading,
    }));
  }, []);

  const triggerLazyFetch = useCallback(
    (sectionId?: string, durationMs: number = 320): Promise<void> => {
      return new Promise((resolve) => {
        if (sectionId) {
          setSectionLoadingMap((prev) => ({ ...prev, [sectionId]: true }));
          setTimeout(() => {
            setSectionLoadingMap((prev) => ({ ...prev, [sectionId]: false }));
            resolve();
          }, durationMs);
        } else {
          setIsGlobalLoading(true);
          setTimeout(() => {
            setIsGlobalLoading(false);
            resolve();
          }, durationMs);
        }
      });
    },
    []
  );

  return (
    <DealsLoadingContext.Provider
      value={{
        isGlobalLoading,
        setGlobalLoading: setIsGlobalLoading,
        isSectionLoading,
        setSectionLoading,
        triggerLazyFetch,
      }}
    >
      {children}
    </DealsLoadingContext.Provider>
  );
};
