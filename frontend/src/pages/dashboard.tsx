import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  Eye
} from 'lucide-react';
import StatsCard from '@/components/stats-card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock data for demo
const dashboardStats = {
  totalProducts: 1248,
  totalSuppliers: 89,
  totalStockValue: 2456789,
  lowStockAlerts: 23,
  totalRevenue: 3456789,
  monthlyGrowth: 12.5,
};

const salesData = [
  { month: 'Jan', sales: 420000, orders: 145 },
  { month: 'Feb', sales: 380000, orders: 132 },
  { month: 'Mar', sales: 520000, orders: 178 },
  { month: 'Apr', sales: 610000, orders: 203 },
  { month: 'May', sales: 580000, orders: 189 },
  { month: 'Jun', sales: 720000, orders: 234 },
];

const topProducts = [
  { name: 'Premium Basmati Rice', sales: 45230, growth: 15.2 },
  { name: 'Organic Honey', sales: 32100, growth: 8.7 },
  { name: 'Fresh Milk 1L', sales: 28950, growth: 12.1 },
  { name: 'Whole Wheat Flour', sales: 25840, growth: 6.3 },
  { name: 'Green Tea Bags', sales: 22170, growth: 18.9 },
];

const lowStockItems = [
  { name: 'Olive Oil 500ml', stock: 5, minStock: 20, status: 'critical' },
  { name: 'Almonds 250g', stock: 12, minStock: 25, status: 'warning' },
  { name: 'Dark Chocolate', stock: 8, minStock: 15, status: 'warning' },
  { name: 'Coconut Oil 1L', stock: 3, minStock: 10, status: 'critical' },
];

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    initialData: dashboardStats,
  });

  const { data: lowStock } = useQuery({
    queryKey: ['/api/dashboard/low-stock'],
    initialData: lowStockItems,
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome to your premium inventory management system
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Today</div>
          <div className="text-lg font-semibold text-primary">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts.toLocaleString() || '0'}
          change="+12%"
          changeType="positive"
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          change="+8.2%"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Suppliers"
          value={stats?.totalSuppliers.toString() || '0'}
          change="+5%"
          changeType="positive"
          icon={Users}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats?.lowStockAlerts.toString() || '0'}
          change="-3%"
          changeType="negative"
          icon={AlertTriangle}
          iconColor="text-red-500"
        />
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Sales Trend</h3>
              <p className="text-muted-foreground">Monthly revenue overview</p>
            </div>
            <TrendingUp className="h-6 w-6 text-primary" />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                fill="url(#salesGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Monthly Orders</h3>
              <p className="text-muted-foreground">Order volume tracking</p>
            </div>
            <ShoppingCart className="h-6 w-6 text-primary" />
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
              />
              <Bar 
                dataKey="orders" 
                fill="hsl(var(--primary))" 
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Top Products</h3>
              <p className="text-muted-foreground">Best performing items</p>
            </div>
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>

          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {product.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ₹{product.sales.toLocaleString()} sales
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    product.growth > 10 ? 'text-green-500' : 'text-yellow-500'
                  }`}>
                    +{product.growth}%
                  </div>
                  <div className="text-xs text-muted-foreground">growth</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Low Stock Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="premium-card p-6 hover-lift"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground">Low Stock Alert</h3>
              <p className="text-muted-foreground">Items requiring attention</p>
            </div>
            <AlertTriangle className="h-6 w-6 text-red-500" />
          </div>

          <div className="space-y-4">
            {lowStock?.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.status === 'critical' ? 'bg-red-500' : 'bg-yellow-500'
                  } animate-pulse`} />
                  <div>
                    <div className="font-medium text-foreground">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Min: {item.minStock} units
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    item.status === 'critical' ? 'text-red-500' : 'text-yellow-500'
                  }`}>
                    {item.stock} left
                  </div>
                  <button className="text-xs text-primary hover:text-primary/80 transition-colors">
                    <Eye className="h-3 w-3 inline mr-1" />
                    View
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}