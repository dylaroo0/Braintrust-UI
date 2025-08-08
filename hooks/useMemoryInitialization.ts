import { useEffect } from 'react';
import { useMemoryStore } from '../stores/memoryStore';

/**
 * Hook to initialize the memory store when the app starts
 * This ensures the store is properly set up and ready to use
 */
export const useMemoryInitialization = () => {
  const initializeStore = useMemoryStore(state => state.initializeStore);
  const getMemoryStats = useMemoryStore(state => state.getMemoryStats);

  useEffect(() => {
    // Initialize the store
    initializeStore();
    
    // Log initial stats for debugging
    const stats = getMemoryStats();
    console.log('Memory Store initialized with stats:', stats);
  }, [initializeStore, getMemoryStats]);

  return {
    isInitialized: true, // Since Zustand with persist handles initialization automatically
  };
};