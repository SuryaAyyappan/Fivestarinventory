import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import ThreeParticles from '@/components/three-particles';

// Pages
import Dashboard from '@/pages/dashboard';
import Products from '@/pages/products';
import Inventory from '@/pages/inventory';
import Suppliers from '@/pages/suppliers';
import Invoices from '@/pages/invoices';
import Reports from '@/pages/reports';
import Alerts from '@/pages/alerts';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="emart-theme">
        <Router>
          <div className="min-h-screen bg-background relative overflow-hidden">
            {/* 3D Particle Background */}
            <ThreeParticles />
            
            {/* Main Content */}
            <div className="content-overlay flex min-h-screen">
              {/* Sidebar Navigation */}
              <Navigation />
              
              {/* Main Content Area */}
              <main className="flex-1 ml-64 p-6 overflow-auto">
                <div className="max-w-7xl mx-auto">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </div>
              </main>
            </div>
            
            {/* Toast Notifications */}
            <Toaster />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;