import { motion } from 'framer-motion';
import { FileText, DollarSign, Calendar, CheckCircle } from 'lucide-react';

export default function Invoices() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">Invoice Management</h1>
        <p className="text-muted-foreground">Track invoices, payments, and billing with automated features</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4">
            <FileText className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">Total Invoices</h3>
              <p className="text-2xl font-bold text-primary">1,248</p>
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
            <DollarSign className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Total Amount</h3>
              <p className="text-2xl font-bold text-green-500">₹34.6L</p>
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
            <Calendar className="h-12 w-12 text-yellow-500" />
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
              <h3 className="text-lg font-semibold">Paid</h3>
              <p className="text-2xl font-bold text-green-500">1,225</p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="premium-card p-8 text-center"
      >
        <FileText className="h-16 w-16 text-primary mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Advanced Invoice Features</h2>
        <p className="text-muted-foreground mb-6">
          Complete invoice management with GST calculation, automated reminders, and payment tracking.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">GST Calculation</h4>
            <p className="text-muted-foreground">Automatic tax calculation</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Payment Tracking</h4>
            <p className="text-muted-foreground">Monitor payment status</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Automated Reminders</h4>
            <p className="text-muted-foreground">Payment due alerts</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Export & Print</h4>
            <p className="text-muted-foreground">PDF generation</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}