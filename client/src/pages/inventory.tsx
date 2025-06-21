import { useState } from "react";
import { useInventory, useTransferStock } from "@/hooks/use-inventory";
import { useProducts } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import InventoryTable from "@/components/inventory-table";
import { 
  ArrowRightLeft, ClipboardCheck, Warehouse, Store, Lock, 
  TrendingUp, Package, Search
} from "lucide-react";

export default function Inventory() {
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  
  const { data: inventory, isLoading } = useInventory();
  const { data: productsData } = useProducts(1, 1000); // Get all products for search
  const transferStock = useTransferStock();

  // Calculate location statistics
  const warehouseStats = inventory?.filter(item => item.location === 'warehouse')
    .reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalValue: acc.totalValue + (item.quantity * 50) // Estimated value
    }), { totalItems: 0, totalValue: 0 }) || { totalItems: 0, totalValue: 0 };

  const shelfStats = inventory?.filter(item => item.location === 'shelf')
    .reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalValue: acc.totalValue + (item.quantity * 50) // Estimated value
    }), { totalItems: 0, totalValue: 0 }) || { totalItems: 0, totalValue: 0 };

  const reservedStats = inventory?.reduce((acc, item) => ({
    totalItems: acc.totalItems + (item.reservedQuantity || 0),
    totalValue: acc.totalValue + ((item.reservedQuantity || 0) * 50)
  }), { totalItems: 0, totalValue: 0 }) || { totalItems: 0, totalValue: 0 };

  const filteredInventory = inventory?.filter(item => {
    const matchesLocation = !selectedLocation || item.location === selectedLocation;
    const matchesSearch = !search || 
      productsData?.products.find(p => p.id === item.productId)?.name
        .toLowerCase().includes(search.toLowerCase());
    return matchesLocation && matchesSearch;
  }) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-chocolate-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chocolate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div className="animate-slide-up">
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Inventory Management</h1>
            <p className="text-chocolate-600">Track warehouse and shelf stock levels in real-time</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <ArrowRightLeft className="mr-2 w-4 h-4" />
              Stock Transfer
            </Button>
            <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <ClipboardCheck className="mr-2 w-4 h-4" />
              Stock Audit
            </Button>
          </div>
        </div>

        {/* Location Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-scale-in">
          {/* Warehouse Overview */}
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-chocolate-800">Warehouse Stock</h3>
                  <p className="text-chocolate-600">Central storage facility</p>
                </div>
                <div className="bg-blue-500 text-white p-4 rounded-xl">
                  <Warehouse className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 flex items-center justify-center">
                <Warehouse className="w-12 h-12 text-blue-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-chocolate-800">{warehouseStats.totalItems}</p>
                  <p className="text-sm text-chocolate-600">Total Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-500">₹{(warehouseStats.totalValue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-chocolate-600">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shelf Stock Overview */}
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-chocolate-800">Shelf Stock</h3>
                  <p className="text-chocolate-600">Store display areas</p>
                </div>
                <div className="bg-green-500 text-white p-4 rounded-xl">
                  <Store className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-green-50 to-green-100 rounded-lg mb-4 flex items-center justify-center">
                <Store className="w-12 h-12 text-green-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-chocolate-800">{shelfStats.totalItems}</p>
                  <p className="text-sm text-chocolate-600">Items on Display</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-500">₹{(shelfStats.totalValue / 100000).toFixed(1)}L</p>
                  <p className="text-sm text-chocolate-600">Display Value</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reserved Stock Overview */}
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-chocolate-800">Reserved Stock</h3>
                  <p className="text-chocolate-600">Orders and allocations</p>
                </div>
                <div className="bg-orange-500 text-white p-4 rounded-xl">
                  <Lock className="w-6 h-6" />
                </div>
              </div>
              <div className="h-32 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg mb-4 flex items-center justify-center">
                <Lock className="w-12 h-12 text-orange-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-chocolate-800">{reservedStats.totalItems}</p>
                  <p className="text-sm text-chocolate-600">Reserved Items</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gold-500">₹{(reservedStats.totalValue / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-chocolate-600">Reserved Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Search Products</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by product name..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-chocolate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                    <SelectItem value="shelf">Shelf</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearch("");
                    setSelectedLocation("");
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <InventoryTable 
          inventory={filteredInventory} 
          products={productsData?.products || []}
        />
      </div>
    </div>
  );
}
