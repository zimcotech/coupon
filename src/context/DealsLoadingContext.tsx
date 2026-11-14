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
  // Global loading state: defaults to false so scroll-based IntersectionObserver governs viewport rendering
  const [isGlobalLoading, setIsGlobalLoading] = useState<boolean>(false);
  const [sectionLoadingMap, setSectionLoadingMap] = useState<Record<string, boolean>>({
    'verified-deals': false,
    'black-friday': false,
    'new-arrivals': false,
    'search-deals': false,
    'brand-deals': false,
    'category-deals': false,
    'related-deals': false,
  });

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
