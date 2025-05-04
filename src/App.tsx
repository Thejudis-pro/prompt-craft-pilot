
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SavedPrompts from "./pages/SavedPrompts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Security improvements for React Query
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: true,
    },
  },
});

// Update CSP to allow Google Fonts
const setContentSecurityPolicy = () => {
  if (typeof document !== 'undefined') {
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self'; connect-src 'self' https://eohmfnlakvoqftkzmrtz.supabase.co; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; frame-src 'none';";
    document.head.appendChild(meta);
  }
};

// Execute CSP setup only in browser environments
if (typeof window !== 'undefined') {
  setContentSecurityPolicy();
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/saved-prompts" element={<SavedPrompts />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
