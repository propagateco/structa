import { useEffect, useRef, useCallback } from "react";

interface UseAutoSaveOptions<TData> {
  /**
   * The data to monitor for changes
   */
  data: TData;
  
  /**
   * Function to check if data has changes
   */
  hasChanges: boolean;
  
  /**
   * The mutation function to call when auto-saving
   */
  onSave: (data: TData) => void;
  
  /**
   * Whether the mutation is currently pending
   */
  isPending: boolean;
  
  /**
   * Callback after successful save
   */
  onSuccess?: () => void;
  
  /**
   * Debounce delay in milliseconds before auto-saving (default: 2000ms)
   */
  debounceMs?: number;
  
  /**
   * Whether auto-save is enabled (default: true)
   */
  enabled?: boolean;
}

/**
 * Auto-save Hook
 * --------------
 * 
 * Monitors data for changes and automatically saves after a debounce period.
 * Useful for implementing background auto-save functionality in forms.
 * 
 * @example
 * const { mutate, isPending } = useUpdateMutation();
 * 
 * useAutoSave({
 *   data: formData,
 *   hasChanges: hasChanges,
 *   onSave: (data) => {
 *     mutate(data, {
 *       onSuccess: () => resetChanges()
 *     });
 *   },
 *   isPending,
 *   debounceMs: 2000
 * });
 */
export function useAutoSave<TData>({
  data,
  hasChanges,
  onSave,
  isPending,
  onSuccess,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<TData>) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dataRef = useRef<TData>(data);
  const hasChangesRef = useRef(hasChanges);
  const isPendingRef = useRef(isPending);
  const isSavingRef = useRef(false);
  const lastSaveDataRef = useRef<TData | null>(null);

  // Update refs
  useEffect(() => {
    dataRef.current = data;
    hasChangesRef.current = hasChanges;
    isPendingRef.current = isPending;
  });

  // Memoized save function with better duplicate prevention
  const performSave = useCallback(() => {
    // Check if we're already saving or if there are no changes
    if (!hasChangesRef.current || isPendingRef.current || isSavingRef.current) {
      return;
    }
    
    // Check if data has actually changed since last save
    const currentData = dataRef.current;
    if (lastSaveDataRef.current && 
        JSON.stringify(currentData) === JSON.stringify(lastSaveDataRef.current)) {
      return;
    }
    
    isSavingRef.current = true;
    lastSaveDataRef.current = currentData;
    
    onSave(currentData);
    
    // Reset the flag after a longer delay to prevent rapid re-saves
    setTimeout(() => {
      isSavingRef.current = false;
    }, 500);
  }, [onSave]);

  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Only set up auto-save if enabled and there are changes
    if (!enabled || !hasChanges || isPending) {
      return;
    }

    // Set up debounced auto-save
    timeoutRef.current = setTimeout(() => {
      performSave();
    }, debounceMs);

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [hasChanges, enabled, debounceMs, isPending, performSave]);

  // Save immediately when component unmounts if there are unsaved changes
  useEffect(() => {
    return () => {
      // Clear timeout to prevent double save
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      // Save any pending changes
      if (hasChangesRef.current && !isPendingRef.current && enabled && !isSavingRef.current) {
        onSave(dataRef.current);
      }
    };
  }, [enabled, onSave]);
  
  // Reset last save data when changes are cleared (indicating successful save)
  useEffect(() => {
    if (!hasChanges) {
      lastSaveDataRef.current = null;
    }
  }, [hasChanges]);

  return {
    isSaving: isPending || isSavingRef.current,
  };
}