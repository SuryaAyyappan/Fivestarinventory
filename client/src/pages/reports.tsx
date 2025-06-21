import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, FileDown, TrendingUp, Package, DollarSign, 
  Calendar, Users, ShoppingCart
} from "lucide-react";

export default function Reports() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: topSellingProducts } = useQuery({
    queryKey: ["/api/dashboard/top-selling"],
  });

  const { data: lowStockProducts } = useQuery({
    queryKey: ["/api/dashboard/low-stock"],
  });

  return (
    <div className="min-h-screen bg-chocolate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Reports & Analytics</h1>
            <p className="text-chocolate-600">Comprehensive business insights and reporting</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <BarChart3 className="mr-2 w-4 h-4" />
              Generate Report
            </Button>
            <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <FileDown className="mr-2 w-4 h-4" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 animate-scale-in">
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-chocolate-800">Sales Analytics</h3>
                <div className="bg-blue-500 text-white p-3 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <BarChart3 className="w-12 h-12 text-blue-400" />
              </div>
              <p className="text-chocolate-600 text-sm mb-4">Track sales performance, trends, and revenue growth over time.</p>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors duration-300">
                View Report
              </Button>
            </CardContent>
          </Card>

          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-chocolate-800">Inventory Report</h3>
                <div className="bg-green-500 text-white p-3 rounded-xl">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-12 h-12 text-green-400" />
              </div>
              <p className="text-chocolate-600 text-sm mb-4">Comprehensive stock analysis, turnover rates, and optimization insights.</p>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors duration-300">
                View Report
              </Button>
            </CardContent>
          </Card>

          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-chocolate-800">Financial Summary</h3>
                <div className="bg-gold-500 text-white p-3 rounded-xl">
                  <DollarSign className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg mb-4 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-gold-400" />
              </div>
              <p className="text-chocolate-600 text-sm mb-4">Revenue, expenses, profit margins, and financial health metrics.</p>
              <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white py-2 rounded-lg font-medium transition-colors duration-300">
                View Report
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
          {/* Revenue Chart */}
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-chocolate-800">Monthly Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gradient-to-br from-chocolate-50 to-gold-50 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 text-chocolate-400 mx-auto mb-4" />
                  <p className="text-chocolate-600">Revenue trend visualization</p>
                  <p className="text-sm text-chocolate-500 mt-2">Chart integration coming soon</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Products Chart */}
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-chocolate-800">Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSellingProducts?.slice(0, 5).map((product: any, index: number) => (
                  <div key={product.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        index === 0 ? 'bg-gold-500' :
                        index === 1 ? 'bg-chocolate-500' :
                        index === 2 ? 'bg-blue-500' :
                        'bg-green-500'
                      }`}>
                        <Package className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-chocolate-800 font-medium">{product.name}</span>
                    </div>
                    <span className="text-gold-500 font-bold">
                      ₹{((product.revenue || 0) / 1000).toFixed(0)}K
                    </span>
                  </div>
                )) || (
                  <div className="text-center py-8 text-chocolate-600">
                    <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-chocolate-400" />
                    <p>No sales data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6 text-center">
              <Package className="w-8 h-8 text-chocolate-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-chocolate-800">{stats?.totalProducts || 0}</div>
              <div className="text-chocolate-600">Total Products</div>
            </CardContent>
          </Card>
          
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6 text-center">
              <DollarSign className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gold-500">
                ₹{((stats?.totalStockValue || 0) / 100000).toFixed(1)}L
              </div>
              <div className="text-chocolate-600">Stock Value</div>
            </CardContent>
          </Card>
          
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-blue-500">{stats?.activeSuppliers || 0}</div>
              <div className="text-chocolate-600">Active Suppliers</div>
            </CardContent>
          </Card>
          
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-green-500">
                {lowStockProducts?.length || 0}
              </div>
              <div className="text-chocolate-600">Low Stock Items</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
