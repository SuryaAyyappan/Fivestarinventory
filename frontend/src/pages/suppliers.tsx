import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Mail, MapPin } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export default function Suppliers() {
  const { data: suppliers, isLoading, isError } = useQuery({
    queryKey: ['/api/suppliers'],
    queryFn: () => apiRequest('/api/suppliers'),
    initialData: [],
  });

  if (isLoading) return <div>Loading suppliers...</div>;
  if (isError) return <div>Error loading suppliers.</div>;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Supplier Management</h1>
        <p className="text-muted-foreground">Manage your vendor relationships and supplier information</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {suppliers.map((supplier: any, index: number) => (
          <motion.div
            key={supplier.id}
            initial={{ opacity: 0, x: -20 + index * 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
            className="premium-card p-6 hover-lift"
          >
            <div className="flex items-center space-x-4 mb-4">
              <Users className="h-12 w-12 text-primary" />
              <div>
                <h3 className="text-xl font-semibold">{supplier.name}</h3>
                <p className="text-muted-foreground">{supplier.contactPerson}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{supplier.city}, {supplier.state}</span>
              </div>
            </div>
            <div className="mt-4">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${supplier.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {supplier.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}