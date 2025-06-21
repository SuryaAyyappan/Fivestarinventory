import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, QrCode } from "lucide-react";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onGenerateBarcode?: (product: Product) => void;
}

export default function ProductCard({ product, onEdit, onGenerateBarcode }: ProductCardProps) {
  const getStockStatus = () => {
    // This would typically come from inventory data
    return "In Stock";
  };

  const getStockBadgeVariant = () => {
    const status = getStockStatus();
    return status === "In Stock" ? "default" : status === "Low Stock" ? "destructive" : "secondary";
  };

  return (
    <Card className="card-3d bg-white rounded-2xl overflow-hidden shadow-xl border border-chocolate-200 hover:border-chocolate-400 transition-all duration-300">
      <div className="h-48 bg-gradient-to-br from-chocolate-100 to-chocolate-200 flex items-center justify-center">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-chocolate-400 text-4xl">📦</div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-chocolate-800 line-clamp-1">{product.name}</h3>
          <Badge 
            variant={getStockBadgeVariant()} 
            className="bg-green-100 text-green-800"
          >
            {getStockStatus()}
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
            Min: {product.minStockLevel || 0}
          </span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => onEdit?.(product)}
            className="flex-1 bg-chocolate-500 hover:bg-chocolate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            <Edit className="mr-1 w-3 h-3" />
            Edit
          </Button>
          <Button 
            onClick={() => onGenerateBarcode?.(product)}
            className="bg-gold-500 hover:bg-gold-600 text-white px-3 py-2 rounded-lg transition-colors duration-300"
          >
            <QrCode className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
