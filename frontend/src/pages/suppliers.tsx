import { motion } from 'framer-motion';
import { Users, Phone, Mail, MapPin } from 'lucide-react';

export default function Suppliers() {
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Users className="h-12 w-12 text-primary" />
            <div>
              <h3 className="text-xl font-semibold">Farm Fresh Co.</h3>
              <p className="text-muted-foreground">Premium Grains</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>contact@farmfresh.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Punjab, India</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Users className="h-12 w-12 text-green-500" />
            <div>
              <h3 className="text-xl font-semibold">Pure Naturals</h3>
              <p className="text-muted-foreground">Organic Products</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+91 87654 32109</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>info@purenaturals.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Kerala, India</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center space-x-4 mb-4">
            <Users className="h-12 w-12 text-blue-500" />
            <div>
              <h3 className="text-xl font-semibold">Local Dairy</h3>
              <p className="text-muted-foreground">Fresh Dairy Products</p>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>+91 76543 21098</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>orders@localdairy.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Gujarat, India</span>
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
        <h2 className="text-2xl font-bold mb-4">Supplier Features</h2>
        <p className="text-muted-foreground mb-6">
          Comprehensive supplier management with contact details, performance tracking, and automated communication.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Contact Management</h4>
            <p className="text-muted-foreground">Complete contact details</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Performance Tracking</h4>
            <p className="text-muted-foreground">Monitor supplier metrics</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Payment Tracking</h4>
            <p className="text-muted-foreground">Track payments & dues</p>
          </div>
          <div className="bg-muted/20 p-4 rounded-lg">
            <h4 className="font-semibold text-primary">Communication</h4>
            <p className="text-muted-foreground">Automated notifications</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}