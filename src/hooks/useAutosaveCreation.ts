import React, { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction } from 'react';
import { CreationData } from '../types';

export const AUTOSAVE_STORAGE_KEY = 'playstart_autosave_current_creation';
export const AUTOSAVE_META_KEY = 'playstart_autosave_meta';

export type AutosaveReason = 'periodic_5s' | 'tag_edit' | 'manual' | 'generation' | 'lifecycle';

export interface AutosaveMeta {
  lastSavedAt: string;
  saveCount: number;
  reason: AutosaveReason;
  creationId: string;
  tagsCount: number;
}

/**
 * Validates if the parsed object conforms to CreationData interface
 */
export function isValidCreationData(obj: any): obj is CreationData {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.id === 'string' &&
    typeof obj.prompt === 'string' &&
    typeof obj.title === 'string' &&
    Array.isArray(obj.selectedNetworks) &&
    typeof obj.visualTheme === 'object'
  );
}

/**
 * Loads the last autosaved creation from LocalStorage
 */
export function loadAutosavedCreation(): CreationData | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (isValidCreationData(parsed)) {
      return parsed;
    }
  } catch (err) {
    console.warn('[Autosave] Failed to parse autosaved creation from LocalStorage:', err);
  }
  return null;
}

/**
 * Loads autosave metadata
 */
export function loadAutosaveMeta(): AutosaveMeta | null {
  try {
    const raw = localStorage.getItem(AUTOSAVE_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    return null;
  }
}

interface UseAutosaveCreationOptions {
  currentCreation: CreationData | null;
  setCurrentCreation: Dispatch<SetStateAction<CreationData | null>>;
  intervalMs?: number; // Default 5000ms (5 seconds)
  onAutosave?: (meta: AutosaveMeta) => void;
}

export function useAutosaveCreation({
  currentCreation,
  setCurrentCreation,
  intervalMs = 5000,
  onAutosave,
}: UseAutosaveCreationOptions) {
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(() => {
    const meta = loadAutosaveMeta();
    return meta?.lastSavedAt ? new Date(meta.lastSavedAt) : null;
  });
  const [saveCount, setSaveCount] = useState<number>(() => {
    const meta = loadAutosaveMeta();
    return meta?.saveCount || 0;
  });
  const [lastReason, setLastReason] = useState<AutosaveReason | null>(() => {
    const meta = loadAutosaveMeta();
    return meta?.reason || null;
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isRestoredFromStorage, setIsRestoredFromStorage] = useState<boolean>(false);

  // Keep references to prevent stale closures in setInterval and event listeners
  const currentCreationRef = useRef<CreationData | null>(currentCreation);
  const lastSerializedRef = useRef<string>('');
  const saveCountRef = useRef<number>(saveCount);

  useEffect(() => {
    currentCreationRef.current = currentCreation;
  }, [currentCreation]);

  /**
   * Core save function to LocalStorage with quota error protection
   */
  const saveToStorage = useCallback(
    (creationToSave: CreationData | null, reason: AutosaveReason = 'periodic_5s'): boolean => {
      if (!creationToSave) return false;

      try {
        const serialized = JSON.stringify(creationToSave);
        
        // Skip if identical to last save unless reason is explicit tag edit or manual
        if (serialized === lastSerializedRef.current && reason === 'periodic_5s') {
          return false;
        }

        setIsSaving(true);
        localStorage.setItem(AUTOSAVE_STORAGE_KEY, serialized);
        
        const now = new Date();
        const nextCount = saveCountRef.current + 1;
        saveCountRef.current = nextCount;

        const meta: AutosaveMeta = {
          lastSavedAt: now.toISOString(),
          saveCount: nextCount,
          reason,
          creationId: creationToSave.id,
          tagsCount: (creationToSave.userTags?.length || 0) + (creationToSave.visualTheme?.tags?.length || 0),
        };

        localStorage.setItem(AUTOSAVE_META_KEY, JSON.stringify(meta));
        lastSerializedRef.current = serialized;

        setLastSavedAt(now);
        setSaveCount(nextCount);
        setLastReason(reason);

        if (onAutosave) {
          onAutosave(meta);
        }

        setTimeout(() => setIsSaving(false), 400);
        return true;
      } catch (err: any) {
        console.warn('[Autosave] LocalStorage write error (possible quota or private mode):', err);
        setIsSaving(false);
        return false;
      }
    },
    [onAutosave]
  );

  /**
   * Immediate save wrapper for tag updates or manual trigger
   */
  const triggerImmediateSave = useCallback(
    (customCreation?: CreationData, reason: AutosaveReason = 'tag_edit') => {
      const target = customCreation || currentCreationRef.current;
      if (target) {
        saveToStorage(target, reason);
      }
    },
    [saveToStorage]
  );

  // 1. Initial Load: Restore saved creation on mount if state is empty or initial
  useEffect(() => {
    const saved = loadAutosavedCreation();
    if (saved) {
      // If we recovered a previous saved state
      setIsRestoredFromStorage(true);
      lastSerializedRef.current = JSON.stringify(saved);
    }
  }, []);

  // 2. Periodic 5-second interval timer
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentCreationRef.current) {
        saveToStorage(currentCreationRef.current, 'periodic_5s');
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs, saveToStorage]);

  // 3. Lifecycle safety: Save on window beforeunload and visibilitychange (tab switch/close)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentCreationRef.current) {
        saveToStorage(currentCreationRef.current, 'lifecycle');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && currentCreationRef.current) {
        saveToStorage(currentCreationRef.current, 'lifecycle');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [saveToStorage]);

  return {
    lastSavedAt,
    saveCount,
    lastReason,
    isSaving,
    isRestoredFromStorage,
    triggerImmediateSave,
    saveNow: () => triggerImmediateSave(undefined, 'manual'),
  };
}
