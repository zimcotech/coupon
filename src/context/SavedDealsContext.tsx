import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'couponify_saved_deals_v1';

interface SavedDealsContextType {
  savedDealIds: string[];
  isSaved: (dealId: string) => boolean;
  toggleSave: (dealId: string) => void;
  removeSaved: (dealId: string) => void;
  clearSaved: () => void;
  savedCount: number;
}

const SavedDealsContext = createContext<SavedDealsContextType>({
  savedDealIds: [],
  isSaved: () => false,
  toggleSave: () => {},
  removeSaved: () => {},
  clearSaved: () => {},
  savedCount: 0,
});

export const SavedDealsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedDealIds, setSavedDealIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read saved deals from localStorage:', e);
    }
    // Start with deal-1 (ElevenLabs 50% OFF) saved by default for instant onboarding preview
    return ['deal-1'];
  });

  // Persist to localStorage whenever savedDealIds updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedDealIds));
    } catch (e) {
      console.warn('Could not write saved deals to localStorage:', e);
    }
  }, [savedDealIds]);

  const isSaved = useCallback(
    (dealId: string) => savedDealIds.includes(dealId),
    [savedDealIds]
  );

  const toggleSave = useCallback((dealId: string) => {
    setSavedDealIds((prev) =>
      prev.includes(dealId) ? prev.filter((id) => id !== dealId) : [...prev, dealId]
    );
  }, []);

  const removeSaved = useCallback((dealId: string) => {
    setSavedDealIds((prev) => prev.filter((id) => id !== dealId));
  }, []);

  const clearSaved = useCallback(() => {
    setSavedDealIds([]);
  }, []);

  return (
    <SavedDealsContext.Provider
      value={{
        savedDealIds,
        isSaved,
        toggleSave,
        removeSaved,
        clearSaved,
        savedCount: savedDealIds.length,
      }}
    >
      {children}
    </SavedDealsContext.Provider>
  );
};

export const useSavedDeals = () => useContext(SavedDealsContext);
