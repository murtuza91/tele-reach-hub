import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { AppProvider } from "@/contexts/AppContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { useAuth } from "@/contexts/AuthContext"
import Dashboard from "./pages/Dashboard"
import Index from "./pages/Index"
import Accounts from "./pages/Accounts"
import Templates from "./pages/Templates"
import Campaigns from "./pages/Campaigns"
import NotFound from "./pages/NotFound"

const queryClient = new QueryClient()

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <BrowserRouter>
      {isAuthenticated ? (
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar />
            <main className="flex-1">
              <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background px-6">
                <SidebarTrigger />
                <div className="flex-1" />
              </header>
              <div className="container py-6">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/accounts" element={<Accounts />} />
                  <Route path="/templates" element={<Templates />} />
                  <Route path="/campaigns" element={<Campaigns />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </div>
            </main>
          </div>
        </SidebarProvider>
      ) : (
        <div className="min-h-screen">
          <div className="container py-6">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="*" element={<Index />} />
            </Routes>
          </div>
        </div>
      )}
    </BrowserRouter>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
