import { useState } from "react";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, Search, Edit, QrCode, ChevronLeft, ChevronRight } from "lucide-react";

export default function Products() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>();
  
  const { data: productsData, isLoading } = useProducts(page, 12, search, categoryId);
  const { data: categories } = useCategories();

  const products = productsData?.products || [];
  const total = productsData?.total || 0;
  const totalPages = Math.ceil(total / 12);

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
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Product Management</h1>
            <p className="text-chocolate-600">Manage your product catalog with advanced features</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Plus className="mr-2 w-4 h-4" />
              Add Product
            </Button>
            <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Upload className="mr-2 w-4 h-4" />
              Bulk Import
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mb-8 animate-scale-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Search Products</label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search by name, SKU..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10"
                  />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-chocolate-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Category</label>
                <Select onValueChange={(value) => setCategoryId(value ? parseInt(value) : undefined)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Price Range</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Prices" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-50">₹0 - ₹50</SelectItem>
                    <SelectItem value="51-100">₹51 - ₹100</SelectItem>
                    <SelectItem value="101-200">₹101 - ₹200</SelectItem>
                    <SelectItem value="200+">₹200+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-chocolate-700 mb-2">Stock Status</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Stock" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in-stock">In Stock</SelectItem>
                    <SelectItem value="low-stock">Low Stock</SelectItem>
                    <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in mb-8">
          {products.map((product: any) => (
            <Card key={product.id} className="card-3d bg-white rounded-2xl overflow-hidden shadow-xl border border-chocolate-200 hover:border-chocolate-400 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-chocolate-100 to-chocolate-200 flex items-center justify-center">
                <div className="text-chocolate-400 text-4xl">📦</div>
              </div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-chocolate-800 line-clamp-1">{product.name}</h3>
                  <Badge variant={product.isActive ? "default" : "secondary"} className="bg-green-100 text-green-800">
                    In Stock
                  </Badge>
                </div>
                <p className="text-chocolate-600 text-sm mb-3 line-clamp-2">
                  {product.description || `SKU: ${product.sku}`}
                </p>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-chocolate-800">
                    ₹{product.sellingPrice || "0"}
                  </span>
                  <span className="text-sm text-chocolate-500">
                    Stock: {product.stock || "N/A"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1 bg-chocolate-500 hover:bg-chocolate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300">
                    <Edit className="mr-1 w-3 h-3" />
                    Edit
                  </Button>
                  <Button className="bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-lg transition-colors duration-300">
                    <QrCode className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-12 text-center">
              <div className="text-chocolate-400 text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-chocolate-800 mb-2">No Products Found</h3>
              <p className="text-chocolate-600 mb-6">
                {search || categoryId ? "Try adjusting your search criteria" : "Start by adding your first product"}
              </p>
              <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl">
                <Plus className="mr-2 w-4 h-4" />
                Add First Product
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12 animate-fade-in">
            <div className="flex items-center space-x-1">
              <Button
                variant="outline"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-chocolate-300 rounded-l-lg hover:bg-chocolate-50"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    onClick={() => setPage(pageNum)}
                    className={
                      page === pageNum
                        ? "px-4 py-2 bg-chocolate-500 text-white border border-chocolate-500"
                        : "px-4 py-2 border border-chocolate-300 hover:bg-chocolate-50"
                    }
                  >
                    {pageNum}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-chocolate-300 rounded-r-lg hover:bg-chocolate-50"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
