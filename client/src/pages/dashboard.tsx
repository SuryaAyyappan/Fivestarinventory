import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatsCard from "@/components/stats-card";
import { 
  Package, DollarSign, AlertTriangle, Truck, Plus, Upload, BarChart3, QrCode,
  TrendingUp, Clock, CheckCircle, TriangleAlert
} from "lucide-react";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/dashboard/low-stock"],
  });

  const { data: topSellingProducts } = useQuery({
    queryKey: ["/api/dashboard/top-selling"],
  });

  if (statsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-chocolate-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chocolate-50 relative">
      {/* Hero Section */}
      <section className="animated-bg py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full bg-gradient-to-br from-chocolate-800/20 to-gold-500/20"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            eMart 5 Star 
            <span className="block text-gold-500 animate-pulse-slow">Premium Inventory</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 animate-fade-in max-w-3xl mx-auto">
            Comprehensive inventory management system with advanced analytics, real-time tracking, and intelligent automation for your grocery business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-scale-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-chocolate-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <BarChart3 className="mr-2 w-5 h-5" />
              View Analytics
            </Button>
            <Button variant="outline" className="bg-white/20 backdrop-blur hover:bg-white/30 text-white border-white/30 px-8 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Plus className="mr-2 w-5 h-5" />
              Add Product
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            change="+12% from last month"
            changeType="positive"
            icon={Package}
            iconColor="bg-chocolate-500"
          />
          <StatsCard
            title="Total Stock Value"
            value={`₹${((stats?.totalStockValue || 0) / 100000).toFixed(1)}L`}
            change="+8% from last month"
            changeType="positive"
            icon={DollarSign}
            iconColor="bg-gold-500"
          />
          <StatsCard
            title="Low Stock Items"
            value={stats?.lowStockCount || 0}
            change="Needs attention"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="bg-red-500"
          />
          <StatsCard
            title="Active Suppliers"
            value={stats?.activeSuppliers || 0}
            change="+3 new this month"
            changeType="positive"
            icon={Truck}
            iconColor="bg-blue-500"
          />
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-chocolate-800">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockProducts?.slice(0, 5).map((product: any, index: number) => (
                    <div key={product.id} className="flex items-center space-x-4 p-4 bg-chocolate-50 rounded-xl hover:bg-chocolate-100 transition-colors duration-300">
                      <div className="bg-red-500 text-white p-2 rounded-lg">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-chocolate-800">Low Stock Alert</p>
                        <p className="text-sm text-chocolate-600">{product.name} - Only {product.currentStock} units remaining</p>
                      </div>
                      <span className="text-sm text-chocolate-500">Now</span>
                    </div>
                  )) || (
                    <div className="text-center py-8 text-chocolate-600">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>All products are well stocked!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Top Categories */}
          <div className="space-y-6">
            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-chocolate-800">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-chocolate-500 hover:bg-chocolate-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                    <Plus className="mr-2 w-4 h-4" />
                    Add New Product
                  </Button>
                  <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                    <Upload className="mr-2 w-4 h-4" />
                    Bulk Import CSV
                  </Button>
                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                    <BarChart3 className="mr-2 w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:scale-105">
                    <QrCode className="mr-2 w-4 h-4" />
                    Generate Barcodes
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-chocolate-800">Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topSellingProducts?.slice(0, 4).map((product: any, index: number) => (
                    <div key={product.id} className="flex justify-between items-center">
                      <span className="text-chocolate-600">{product.name}</span>
                      <span className="bg-chocolate-500 text-white px-2 py-1 rounded-full text-sm">
                        ₹{((product.revenue || 0) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  )) || (
                    Array.from({ length: 4 }, (_, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="h-4 bg-chocolate-200 rounded w-24 animate-pulse"></div>
                        <div className="h-6 bg-chocolate-200 rounded w-12 animate-pulse"></div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
