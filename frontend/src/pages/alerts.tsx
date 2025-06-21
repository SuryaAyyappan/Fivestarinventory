import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function Alerts() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Alerts & Notifications</h1>
        <p className="text-muted-foreground">Stay updated with real-time alerts and system notifications</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <Bell className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Total Alerts</h3>
              <p className="text-2xl font-bold text-primary">47</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <AlertTriangle className="h-12 w-12 text-red-500" />
            <div>
              <h3 className="text-lg font-semibold">Critical</h3>
              <p className="text-2xl font-bold text-red-500">8</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <Clock className="h-12 w-12 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold">Pending</h3>
              <p className="text-2xl font-bold text-yellow-500">23</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Resolved</h3>
              <p className="text-2xl font-bold text-green-500">16</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Critical Stock Alert</h4>
              <p className="text-muted-foreground">Olive Oil 500ml is critically low (3 units remaining)</p>
            </div>
            <span className="text-sm text-muted-foreground">2 min ago</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
            <Clock className="h-6 w-6 text-yellow-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Payment Due Reminder</h4>
              <p className="text-muted-foreground">Invoice #INV-2024-001 from Farm Fresh Co. is due tomorrow</p>
            </div>
            <span className="text-sm text-muted-foreground">1 hour ago</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            <Bell className="h-6 w-6 text-blue-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">New Product Added</h4>
              <p className="text-muted-foreground">Premium Jasmine Rice has been added to inventory</p>
            </div>
            <span className="text-sm text-muted-foreground">3 hours ago</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <CheckCircle className="h-6 w-6 text-green-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">Stock Replenished</h4>
              <p className="text-muted-foreground">Almonds 250g stock has been replenished (50 units added)</p>
            </div>
            <span className="text-sm text-muted-foreground">5 hours ago</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="premium-card p-8 text-center"
      >
        <Bell className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Smart Alert System</h2>
        <p className="text-muted-foreground mb-6">
          Intelligent notifications with priority levels, automated triggers, and customizable thresholds.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Smart Thresholds</h4>
            <p className="text-muted-foreground">Customizable alert levels</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Priority Levels</h4>
            <p className="text-muted-foreground">Critical to info alerts</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Auto Actions</h4>
            <p className="text-muted-foreground">Automated responses</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Multi-channel</h4>
            <p className="text-muted-foreground">Email, SMS, in-app</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}