import { motion } from 'framer-motion';
import { Warehouse, Package, AlertCircle, TrendingUp } from 'lucide-react';

export default function Inventory() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Inventory Management</h1>
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
    </div>
  );
}