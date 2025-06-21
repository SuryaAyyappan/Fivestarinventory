import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock data
const products = [
  {
    id: 1,
    name: 'Premium Basmati Rice',
    sku: 'RICE001',
    category: 'Grains',
    supplier: 'Farm Fresh Co.',
    price: 450.00,
    stock: 150,
    minStock: 50,
    status: 'In Stock',
    image: '/api/placeholder/80/80'
  },
  {
    id: 2,
    name: 'Organic Honey',
    sku: 'HON001',
    category: 'Sweeteners',
    supplier: 'Pure Naturals',
    price: 320.00,
    stock: 25,
    minStock: 30,
    status: 'Low Stock',
    image: '/api/placeholder/80/80'
  },
  {
    id: 3,
    name: 'Fresh Milk 1L',
    sku: 'MILK001',
    category: 'Dairy',
    supplier: 'Local Dairy',
    price: 60.00,
    stock: 200,
    minStock: 100,
    status: 'In Stock',
    image: '/api/placeholder/80/80'
  },
  {
    id: 4,
    name: 'Whole Wheat Flour',
    sku: 'FLOUR001',
    category: 'Grains',
    supplier: 'Grain Masters',
    price: 45.00,
    stock: 80,
    minStock: 40,
    status: 'In Stock',
    image: '/api/placeholder/80/80'
  },
  {
    id: 5,
    name: 'Green Tea Bags',
    sku: 'TEA001',
    category: 'Beverages',
    supplier: 'Tea Gardens',
    price: 180.00,
    stock: 5,
    minStock: 20,
    status: 'Critical',
    image: '/api/placeholder/80/80'
  },
];

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: productData } = useQuery({
    queryKey: ['/api/products', { search: searchTerm, category: selectedCategory }],
    initialData: { products, total: products.length },
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
          <Button className="btn-3d bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
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
              {productData?.products.map((product, index) => (
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
                        <div className="text-sm text-muted-foreground">{product.supplier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm bg-muted/20 px-2 py-1 rounded">
                      {product.sku}
                    </span>
                  </td>
                  <td className="p-4">
                    <Badge variant="secondary">{product.category}</Badge>
                  </td>
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">{product.stock} units</div>
                      <div className="text-muted-foreground">Min: {product.minStock}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-foreground">₹{product.price.toFixed(2)}</div>
                  </td>
                  <td className="p-4">
                    {getStockBadge(getStockStatus(product.stock, product.minStock))}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
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