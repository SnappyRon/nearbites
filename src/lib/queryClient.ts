import { QueryClient } from '@tanstack/react-query';

/**
 * Global TanStack Query Client Configuration
 * Aligned with cache policies defined in /docs/architecture.md
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // 60 seconds default
      gcTime: 5 * 60 * 1000,      // 5 minutes garbage collection
      retry: 2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
