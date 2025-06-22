import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import Navigation from '@/components/navigation';
import ThreeParticles from '@/components/three-particles';
import Dashboard from '@/pages/dashboard';
import Products from '@/pages/products';
import Inventory from '@/pages/inventory';
import Suppliers from '@/pages/suppliers';
import Invoices from '@/pages/invoices';
import Reports from '@/pages/reports';
import Alerts from '@/pages/alerts';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen chocolate-gradient relative overflow-hidden">
          <ThreeParticles />
          
          <div className="relative z-10 flex">
            <Navigation />
            
            <main className="flex-1 ml-64 p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/suppliers" element={<Suppliers />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/alerts" element={<Alerts />} />
              </Routes>
            </main>
          </div>
          
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;