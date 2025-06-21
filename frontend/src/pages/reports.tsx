import { motion } from 'framer-motion';
import { BarChart3, PieChart, TrendingUp, Download } from 'lucide-react';

export default function Reports() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Reports & Analytics</h1>
        <p className="text-muted-foreground">Comprehensive business intelligence and reporting suite</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <BarChart3 className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Sales Report</h3>
              <p className="text-muted-foreground">Monthly sales analysis</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-green-500">₹34.6L</span>
            <Download className="h-5 w-5 text-primary cursor-pointer hover:text-primary/80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <PieChart className="h-12 w-12 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Inventory Report</h3>
              <p className="text-muted-foreground">Stock analysis</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-500">3,728 items</span>
            <Download className="h-5 w-5 text-primary cursor-pointer hover:text-primary/80" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <TrendingUp className="h-12 w-12 text-purple-500" />
            <div>
              <h3 className="text-xl font-semibold">Growth Report</h3>
              <p className="text-muted-foreground">Performance metrics</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-purple-500">+12.5%</span>
            <Download className="h-5 w-5 text-primary cursor-pointer hover:text-primary/80" />
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="premium-card p-8 text-center"
      >
        <BarChart3 className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive reporting suite with real-time analytics, trend analysis, and predictive insights.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Real-time Data</h4>
            <p className="text-muted-foreground">Live analytics dashboard</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Custom Reports</h4>
            <p className="text-muted-foreground">Build your own reports</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Export Options</h4>
            <p className="text-muted-foreground">PDF, Excel, CSV formats</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Scheduled Reports</h4>
            <p className="text-muted-foreground">Automated delivery</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}