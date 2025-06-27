import React from 'react';
import { motion } from 'framer-motion';
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
import StatsCard from '../components/stats-card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/dashboard/stats'],
    queryFn: () => apiRequest('/api/dashboard/stats'),
    initialData: {},
  });
  const { data: topProducts, isLoading: topLoading } = useQuery({
    queryKey: ['/api/dashboard/top-selling'],
    queryFn: () => apiRequest('/api/dashboard/top-selling'),
    initialData: [],
  });
  const { data: lowStockItems, isLoading: lowLoading } = useQuery({
    queryKey: ['/api/dashboard/low-stock'],
    queryFn: () => apiRequest('/api/dashboard/low-stock'),
    initialData: [],
  });

  if (statsLoading || topLoading || lowLoading) return <div>Loading dashboard...</div>;

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
          value={stats.totalProducts?.toLocaleString?.() ?? '0'}
          change="+12%"
          changeType="positive"
          icon={Package}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue?.toLocaleString?.() ?? '0'}`}
          change="+8.2%"
          changeType="positive"
          icon={DollarSign}
          iconColor="text-green-500"
        />
        <StatsCard
          title="Active Suppliers"
          value={stats.totalSuppliers?.toString?.() ?? '0'}
          change="+5%"
          changeType="positive"
          icon={Users}
          iconColor="text-purple-500"
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats.lowStockAlerts?.toString?.() ?? '0'}
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
            <AreaChart data={[]}>
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
            <BarChart data={[]}>
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
            {topProducts.map((product: any, index: number) => (
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
                      ₹{product.sales?.toLocaleString?.() ?? '0'} sales
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
            {lowStockItems.map((item: any, index: number) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                    <div className="font-medium text-foreground">{item.name}</div>
                <div className="text-sm text-muted-foreground">Stock: {item.stock} (Min: {item.minStock})</div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {item.status === 'critical' ? 'Critical' : 'Warning'}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}