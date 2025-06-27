import React from 'react';
import { motion } from 'framer-motion';
import { Warehouse, Package, AlertCircle, TrendingUp } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import RoleBasedView from '../components/RoleBasedView';

const inventoryItems = [
  { id: 1, product: { name: 'Premium Basmati Rice' }, location: 'Warehouse', stock: 150, minStockLevel: 50 },
  { id: 2, product: { name: 'Organic Honey' }, location: 'Shelf', stock: 25, minStockLevel: 30 },
  { id: 3, product: { name: 'Fresh Milk 1L' }, location: 'Warehouse', stock: 200, minStockLevel: 100 },
  { id: 4, product: { name: 'Whole Wheat Flour' }, location: 'Shelf', stock: 80, minStockLevel: 40 },
  { id: 5, product: { name: 'Green Tea Bags' }, location: 'Warehouse', stock: 5, minStockLevel: 20 },
];

export default function Inventory() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-yellow-500 gradient-text mb-4">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your stock levels across multiple locations</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <Warehouse className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Warehouse Stock</h3>
              <p className="text-2xl font-bold text-green-500">2,450 items</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <Package className="h-12 w-12 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Shelf Stock</h3>
              <p className="text-2xl font-bold text-blue-500">1,280 items</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <div>
              <h3 className="text-xl font-semibold">Low Stock</h3>
              <p className="text-2xl font-bold text-red-500">23 items</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="premium-card p-8 text-center"
      >
        <TrendingUp className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Advanced Inventory Features</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive inventory management with real-time tracking, automated alerts, and multi-location support.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Real-time Tracking</h4>
            <p className="text-muted-foreground">Live inventory updates</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Automated Alerts</h4>
            <p className="text-muted-foreground">Low stock notifications</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Multi-location</h4>
            <p className="text-muted-foreground">Track across locations</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Stock Transfers</h4>
            <p className="text-muted-foreground">Easy stock movement</p>
          </div>
        </div>
      </motion.div>

      <table className="min-w-full rounded shadow bg-[#3b2412] mt-8">
        <thead className="bg-[#4e2e13]">
          <tr>
            <th className="p-4 text-left text-yellow-500">Product</th>
            <th className="p-4 text-left text-yellow-500">Location</th>
            <th className="p-4 text-left text-yellow-500">Stock</th>
            <th className="p-4 text-left text-yellow-500">Status</th>
          </tr>
        </thead>
        <tbody>
          {inventoryItems.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05 }}
              className="border-b border-[#6b4a2b] hover:bg-[#4e2e13]/80 transition-colors group"
            >
              <td className="p-4 font-medium text-[#fbbf24]">{item.product.name}</td>
              <td className="p-4 text-[#fbbf24]">{item.location}</td>
              <td className="p-4 text-[#fbbf24]">{item.stock}</td>
              <td className="p-4">
                {item.stock <= item.minStockLevel ? (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Low</span>
                ) : (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">OK</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <RoleBasedView allowedRoles={['ADMIN', 'CHECKER']}>
        <div>{/* Approval UI here */}</div>
      </RoleBasedView>
    </div>
  );
}