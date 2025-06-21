import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, ArrowRightLeft, Package } from "lucide-react";
import type { Inventory, Product } from "@shared/schema";

interface InventoryTableProps {
  inventory: Inventory[];
  products: Product[];
  onEdit?: (item: Inventory) => void;
  onTransfer?: (item: Inventory) => void;
}

export default function InventoryTable({ inventory, products, onEdit, onTransfer }: InventoryTableProps) {
  const getProduct = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  const getStockStatus = (item: Inventory, product?: Product) => {
    if (!product) return "Unknown";
    
    if (item.quantity === 0) return "Out of Stock";
    if (item.quantity <= (product.minStockLevel || 0)) return "Low Stock";
    return "In Stock";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge className="bg-green-100 text-green-800">In Stock</Badge>;
      case "Low Stock":
        return <Badge variant="destructive">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="secondary">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-chocolate-800">Stock Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-chocolate-50">
                <TableHead className="text-chocolate-700 font-medium">Product</TableHead>
                <TableHead className="text-chocolate-700 font-medium">SKU</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Location</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Quantity</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Reserved</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Damaged</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Status</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const product = getProduct(item.productId);
                const status = getStockStatus(item, product);
                
                return (
                  <TableRow key={item.id} className="hover:bg-chocolate-50 transition-colors duration-300">
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-chocolate-100 rounded-lg flex items-center justify-center mr-3">
                          <Package className="w-4 h-4 text-chocolate-600" />
                        </div>
                        <div>
                          <p className="font-medium text-chocolate-800">
                            {product?.name || "Unknown Product"}
                          </p>
                          <p className="text-sm text-chocolate-600">
                            {product?.description || "No description"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-chocolate-600">
                      {product?.sku || "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="outline" 
                        className={
                          item.location === 'warehouse' ? 'bg-blue-50 text-blue-700' : 'bg-green-50 text-green-700'
                        }
                      >
                        {item.location === 'warehouse' ? 'Warehouse' : 'Shelf'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-chocolate-800 font-medium">
                      {item.quantity}
                    </TableCell>
                    <TableCell className="text-chocolate-800 font-medium">
                      {item.reservedQuantity || 0}
                    </TableCell>
                    <TableCell className="text-chocolate-800 font-medium">
                      {item.damagedQuantity || 0}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => onEdit?.(item)}
                          className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => onTransfer?.(item)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors duration-300"
                        >
                          <ArrowRightLeft className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {inventory.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-chocolate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chocolate-800 mb-2">No Inventory Found</h3>
            <p className="text-chocolate-600">No inventory items match your current filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
