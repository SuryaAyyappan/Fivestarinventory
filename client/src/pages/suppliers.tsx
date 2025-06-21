import { useState } from "react";
import { useSuppliers } from "@/hooks/use-suppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SupplierCard from "@/components/supplier-card";
import { Plus, FileText, Search } from "lucide-react";

export default function Suppliers() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const { data: suppliers, isLoading } = useSuppliers();

  const filteredSuppliers = suppliers?.filter(supplier => {
    const matchesSearch = !search || 
      supplier.name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.city?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = !statusFilter || 
      (statusFilter === "active" && supplier.isActive) ||
      (statusFilter === "inactive" && !supplier.isActive);
    
    return matchesSearch && matchesStatus;
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
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Supplier Management</h1>
            <p className="text-chocolate-600">Manage relationships with suppliers and vendors</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Plus className="mr-2 w-4 h-4" />
              Add Supplier
            </Button>
            <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <FileText className="mr-2 w-4 h-4" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mb-8 animate-scale-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Search Suppliers</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name, email, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-chocolate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={() => {
                    setSearch("");
                    setStatusFilter("");
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

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-12 text-center">
              <div className="text-chocolate-400 text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-bold text-chocolate-800 mb-2">No Suppliers Found</h3>
              <p className="text-chocolate-600 mb-6">
                {search || statusFilter ? "Try adjusting your search criteria" : "Start by adding your first supplier"}
              </p>
              <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl">
                <Plus className="mr-2 w-4 h-4" />
                Add First Supplier
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats Summary */}
        {suppliers && suppliers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-chocolate-800">{suppliers.length}</div>
                <div className="text-chocolate-600">Total Suppliers</div>
              </CardContent>
            </Card>
            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {suppliers.filter(s => s.isActive).length}
                </div>
                <div className="text-chocolate-600">Active Suppliers</div>
              </CardContent>
            </Card>
            <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-gold-500">
                  {new Set(suppliers.map(s => s.city).filter(Boolean)).size}
                </div>
                <div className="text-chocolate-600">Cities Covered</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
