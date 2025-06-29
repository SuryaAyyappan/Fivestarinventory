import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import Navigation from './components/navigation';
import TopHeader from './components/top-header';
import ThreeParticles from './components/three-particles';
import Dashboard from './pages/dashboard';
import Products from './pages/products';
import Inventory from './pages/inventory';
import Suppliers from './pages/suppliers';
import Invoices from './pages/invoices';
import Reports from './pages/reports';
import Alerts from './pages/alerts';
import BarcodePage from './pages/barcode';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/footer';
import Outlets from './pages/outlets';
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
    <AuthProvider>
    <QueryClientProvider client={queryClient}>
      <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="*"
              element={
        <div className="min-h-screen chocolate-gradient relative overflow-hidden">
          <ThreeParticles />
          <TopHeader />
          <div className="relative z-10 flex">
            <Navigation />
            <main className="flex-1 ml-64 p-8 pt-20">
              <Routes>
                        <Route path="/" element={<PrivateRoute><Navigate to="/dashboard" replace /></PrivateRoute>} />
                        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
                        <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
                        <Route path="/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
                        <Route path="/outlets" element={<PrivateRoute><Outlets /></PrivateRoute>} />
                        <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
                        <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
                        <Route path="/alerts" element={<PrivateRoute><Alerts /></PrivateRoute>} />
                        <Route path="/barcode" element={<PrivateRoute><BarcodePage /></PrivateRoute>} />
              </Routes>
                      <Footer />
            </main>
          </div>
          <Toaster />
        </div>
              }
            />
          </Routes>
      </Router>
    </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;