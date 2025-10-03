'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useEffect } from 'react';
import { startQueueProcessor, stopQueueProcessor } from '@/store/queueProcessor';

const queryClient = new QueryClient();

function QueueProcessorInitializer() {
  useEffect(() => {
    startQueueProcessor();
    return () => {
      stopQueueProcessor();
    };
  }, []);
  
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <QueueProcessorInitializer />
          {children}
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </Provider>
  );
}

