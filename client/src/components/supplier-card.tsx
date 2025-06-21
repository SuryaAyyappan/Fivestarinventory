import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, FileText, Mail, Phone, MapPin, Building } from "lucide-react";
import type { Supplier } from "@shared/schema";

interface SupplierCardProps {
  supplier: Supplier;
  onEdit?: (supplier: Supplier) => void;
  onViewInvoices?: (supplier: Supplier) => void;
  onContact?: (supplier: Supplier) => void;
}

export default function SupplierCard({ 
  supplier, 
  onEdit, 
  onViewInvoices, 
  onContact 
}: SupplierCardProps) {
  return (
    <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 hover:border-chocolate-400 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="bg-chocolate-500 text-white p-3 rounded-xl">
            <Building className="w-6 h-6" />
          </div>
          <Badge 
            variant={supplier.isActive ? "default" : "secondary"}
            className={supplier.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
          >
            {supplier.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        
        <h3 className="font-bold text-xl text-chocolate-800 mb-2">{supplier.name}</h3>
        <p className="text-chocolate-600 mb-4">{supplier.contactPerson || "No contact person"}</p>
        
        <div className="space-y-3 mb-6">
          {supplier.email && (
            <div className="flex items-center text-sm text-chocolate-600">
              <Mail className="mr-2 w-4 h-4 text-chocolate-400" />
              <span className="truncate">{supplier.email}</span>
            </div>
          )}
          {supplier.phone && (
            <div className="flex items-center text-sm text-chocolate-600">
              <Phone className="mr-2 w-4 h-4 text-chocolate-400" />
              <span>{supplier.phone}</span>
            </div>
          )}
          {(supplier.city || supplier.state) && (
            <div className="flex items-center text-sm text-chocolate-600">
              <MapPin className="mr-2 w-4 h-4 text-chocolate-400" />
              <span className="truncate">
                {[supplier.city, supplier.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}
          {supplier.gstNumber && (
            <div className="text-sm text-chocolate-600">
              <span className="font-medium">GST:</span> {supplier.gstNumber}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center">
            <p className="text-lg font-bold text-chocolate-800">--</p>
            <p className="text-xs text-chocolate-600">Products</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-gold-500">--</p>
            <p className="text-xs text-chocolate-600">Total Value</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onEdit?.(supplier)}
            className="flex-1 bg-chocolate-500 hover:bg-chocolate-600 text-white py-2 rounded-lg text-sm font-medium transition-colors duration-300"
          >
            <Edit className="mr-1 w-3 h-3" />
            Edit
          </Button>
          <Button
            onClick={() => onViewInvoices?.(supplier)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg transition-colors duration-300"
          >
            <FileText className="w-3 h-3" />
          </Button>
          <Button
            onClick={() => onContact?.(supplier)}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg transition-colors duration-300"
          >
            <Mail className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
