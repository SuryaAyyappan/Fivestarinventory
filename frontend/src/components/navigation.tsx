import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Warehouse,
  Users,
  FileText,
  BarChart3,
  Bell,
  Store,
  Sparkles,
} from 'lucide-react';

const navItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    description: 'Overview & Analytics',
  },
  {
    name: 'Products',
    href: '/products',
    icon: Package,
    description: 'Product Catalog',
  },
  {
    name: 'Inventory',
    href: '/inventory',
    icon: Warehouse,
    description: 'Stock Management',
  },
  {
    name: 'Suppliers',
    href: '/suppliers',
    icon: Users,
    description: 'Vendor Management',
  },
  {
    name: 'Invoices',
    href: '/invoices',
    icon: FileText,
    description: 'Billing & Payments',
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    description: 'Business Intelligence',
  },
  {
    name: 'Alerts',
    href: '/alerts',
    icon: Bell,
    description: 'Notifications',
  },
];

export default function Navigation() {
  const location = useLocation();

  return (
    <div className="fixed left-0 top-0 h-full w-64 sidebar-gradient border-r border-primary/20 z-10">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-primary/20">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="relative">
              <Store className="h-8 w-8 text-primary" />
              <Sparkles className="h-4 w-4 text-gold-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">eMart 5 Star</h1>
              <p className="text-xs text-muted-foreground">Premium Inventory</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={item.href}>
                    <div
                      className={`
                        group relative p-3 rounded-xl transition-all duration-300 cursor-pointer
                        hover:bg-primary/10 hover:border-primary/30 border border-transparent
                        ${isActive 
                          ? 'bg-primary/20 border-primary/40 shadow-lg shadow-primary/20' 
                          : 'hover:shadow-md hover:shadow-primary/10'
                        }
                      `}
                    >
                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="absolute left-0 top-0 w-1 h-full bg-primary rounded-r-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center space-x-3">
                        <div className={`
                          p-2 rounded-lg transition-all duration-300
                          ${isActive 
                            ? 'bg-primary text-background shadow-lg shadow-primary/30' 
                            : 'bg-muted/50 text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary'
                          }
                        `}>
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1">
                          <div className={`
                            font-medium transition-colors duration-300
                            ${isActive ? 'text-primary' : 'text-foreground group-hover:text-primary'}
                          `}>
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-primary/70 transition-colors">
                            {item.description}
                          </div>
                        </div>
                      </div>

                      {/* Hover glow effect */}
                      <div className={`
                        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        bg-gradient-to-r from-primary/5 to-transparent
                        ${isActive ? 'opacity-20' : ''}
                      `} />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary/20">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center"
          >
            <div className="premium-card p-3 rounded-lg">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                <span className="text-sm font-medium text-primary">Premium Edition</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Advanced Analytics & 3D Experience
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}