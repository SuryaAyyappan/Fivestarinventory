import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye,
  Download,
  Upload,
  Package,
  Barcode,
  DollarSign
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import AddProduct from './add-product';
import { apiRequest } from '../lib/queryClient';
import { useToast } from '../hooks/use-toast';
import RoleBasedView from '../components/RoleBasedView';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { role } = useAuth();

  const { data: productData, isLoading, isError } = useQuery({
    queryKey: ['/api/products', { search: searchTerm, category: selectedCategory, role }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('categoryId', selectedCategory);
      const url = `/api/products?${params.toString()}`;
      return apiRequest(url, { headers: role ? { role } : undefined });
    },
    initialData: { products: [], total: 0 },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast({ title: 'Deleted', description: 'Product deleted successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const approveProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}/approve`, { method: 'POST', headers: role ? { role } : undefined }),
    onSuccess: () => {
      toast({ title: 'Approved', description: 'Product approved successfully' });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const rejectProductMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/products/${id}/reject`, { method: 'POST', headers: role ? { role } : undefined }),
    onSuccess: () => {
      toast({ title: 'Rejected', description: 'Product rejected' });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock <= minStock * 0.5) return 'critical';
    if (stock <= minStock) return 'low';
    return 'good';
  };

  const getStockBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Critical</Badge>;
      case 'low':
        return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Low Stock</Badge>;
      default:
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">In Stock</Badge>;
    }
  };

  if (showAddProduct) {
    return <AddProduct onBack={() => setShowAddProduct(false)} />;
  }

  if (isLoading) return <div>Loading...</div>;
  if (isError) {
    console.error('Error loading products:', productData);
    return <div>Error loading products.</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold gradient-text">Products</h1>
          <p className="text-muted-foreground mt-2">
            Manage your product catalog with advanced features
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="btn-3d">
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline" className="btn-3d">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <RoleBasedView allowedRoles={['MAKER']}>
          <Button 
            className="btn-3d bg-primary hover:bg-primary/90"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
          </RoleBasedView>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-foreground mt-1">1,248</p>
            </div>
            <Package className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold text-foreground mt-1">24</p>
            </div>
            <Filter className="h-8 w-8 text-purple-500" />
          </div>
        </div>
        
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-red-500 mt-1">23</p>
            </div>
            <Barcode className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <div className="premium-card p-6 hover-lift">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold text-green-500 mt-1">₹24.6L</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="premium-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-gold"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="btn-3d">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="premium-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/20 border-b border-border">
              <tr>
                <th className="text-left p-4 font-semibold text-foreground">Product</th>
                <th className="text-left p-4 font-semibold text-foreground">SKU</th>
                <th className="text-left p-4 font-semibold text-foreground">Category</th>
                <th className="text-left p-4 font-semibold text-foreground">Stock</th>
                <th className="text-left p-4 font-semibold text-foreground">Price</th>
                <th className="text-left p-4 font-semibold text-foreground">Status</th>
                <th className="text-right p-4 font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData?.products.map((product: any, index: number) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="border-b border-border hover:bg-muted/10 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-muted/50 flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{product.name}</div>
                        <div className="text-sm text-muted-foreground">{product.supplier?.name || ''}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm bg-muted/20 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{product.category?.name || ''}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{product.stock} units</div>
                      <div className="text-muted-foreground">Min: {product.minStockLevel}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">₹{product.sellingPrice?.toFixed(2)}</div>
                  </td>
                  <td className="p-4">
                    {getStockBadge(getStockStatus(product.stock, product.minStockLevel))}
                  </td>
                  <td className="p-4">
                    {product.status || 'APPROVED'}
                  </td>
                  <td className="p-4">
                    <Button variant="destructive" size="sm" onClick={() => deleteProductMutation.mutate(product.id)}>
                      <Trash2 className="h-4 w-4" /> Delete
                    </Button>
                    {/* Approval actions for CHECKER on PENDING products */}
                    {role === 'CHECKER' && (product.status === 'PENDING' || !product.status) && (
                      <>
                        <Button variant="default" size="sm" onClick={() => approveProductMutation.mutate(product.id)} style={{ marginLeft: 8 }}>
                          Approve
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => rejectProductMutation.mutate(product.id)} style={{ marginLeft: 8 }}>
                          Reject
                        </Button>
                      </>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}