import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Eye, FileText, Edit, Building, Calendar, DollarSign,
  CheckCircle, Clock, AlertTriangle, XCircle
} from "lucide-react";
import { format } from "date-fns";
import type { Invoice, Supplier } from "@shared/schema";

interface InvoiceTableProps {
  invoices: Invoice[];
  suppliers: Supplier[];
  onStatusUpdate?: (id: number, status: string) => void;
  onView?: (invoice: Invoice) => void;
  onEdit?: (invoice: Invoice) => void;
  onDownloadPdf?: (invoice: Invoice) => void;
  isUpdating?: boolean;
}

export default function InvoiceTable({ 
  invoices, 
  suppliers, 
  onStatusUpdate, 
  onView, 
  onEdit, 
  onDownloadPdf,
  isUpdating = false
}: InvoiceTableProps) {
  const getSupplier = (supplierId: number) => {
    return suppliers.find(s => s.id === supplierId);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      paid: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { color: "bg-orange-100 text-orange-800", icon: Clock },
      overdue: { color: "bg-red-100 text-red-800", icon: AlertTriangle },
      cancelled: { color: "bg-gray-100 text-gray-800", icon: XCircle },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={config.color}>
        <IconComponent className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: string | number) => {
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  const formatDate = (date: Date | string) => {
    return format(new Date(date), "dd MMM yyyy");
  };

  return (
    <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-chocolate-800">Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-chocolate-50">
                <TableHead className="text-chocolate-700 font-medium">Invoice #</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Supplier</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Date</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Amount</TableHead>
                <TableHead className="text-chocolate-700 font-medium">GST</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Total</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Status</TableHead>
                <TableHead className="text-chocolate-700 font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const supplier = getSupplier(invoice.supplierId);
                
                return (
                  <TableRow key={invoice.id} className="hover:bg-chocolate-50 transition-colors duration-300">
                    <TableCell className="font-medium text-chocolate-800">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-chocolate-100 rounded-lg flex items-center justify-center mr-3">
                          <Building className="w-4 h-4 text-chocolate-600" />
                        </div>
                        <span className="text-chocolate-800">{supplier?.name || "Unknown"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-chocolate-600">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-chocolate-400" />
                        {formatDate(invoice.invoiceDate)}
                      </div>
                    </TableCell>
                    <TableCell className="text-chocolate-800 font-medium">
                      {formatCurrency(invoice.subtotal || 0)}
                    </TableCell>
                    <TableCell className="text-chocolate-600">
                      {formatCurrency(invoice.gstAmount || 0)}
                    </TableCell>
                    <TableCell className="text-chocolate-800 font-bold">
                      {formatCurrency(invoice.totalAmount || 0)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onView?.(invoice)}
                          className="p-2"
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadPdf?.(invoice)}
                          className="p-2 bg-red-50 hover:bg-red-100"
                        >
                          <FileText className="w-3 h-3 text-red-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onEdit?.(invoice)}
                          className="p-2 bg-blue-50 hover:bg-blue-100"
                        >
                          <Edit className="w-3 h-3 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        
        {invoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-chocolate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-chocolate-800 mb-2">No Invoices Found</h3>
            <p className="text-chocolate-600">No invoices match your current filters.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
