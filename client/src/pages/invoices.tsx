import { useState } from "react";
import { useInvoices, useUpdateInvoice } from "@/hooks/use-invoices";
import { useSuppliers } from "@/hooks/use-suppliers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import InvoiceTable from "@/components/invoice-table";
import StatsCard from "@/components/stats-card";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Download, FileText, CheckCircle, Clock, AlertTriangle, 
  DollarSign
} from "lucide-react";

export default function Invoices() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const { toast } = useToast();
  
  const { data: invoicesData, isLoading } = useInvoices(
    page, 
    20, 
    supplierFilter ? parseInt(supplierFilter) : undefined, 
    statusFilter || undefined
  );
  const { data: suppliers } = useSuppliers();
  const updateInvoice = useUpdateInvoice();

  const invoices = invoicesData?.invoices || [];
  const total = invoicesData?.total || 0;

  // Calculate statistics
  const stats = invoices.reduce((acc, invoice) => {
    const amount = parseFloat(invoice.totalAmount || "0");
    acc.total += amount;
    
    switch (invoice.status) {
      case 'paid':
        acc.paid += amount;
        break;
      case 'pending':
        acc.pending += amount;
        break;
      case 'overdue':
        acc.overdue += amount;
        break;
    }
    return acc;
  }, { total: 0, paid: 0, pending: 0, overdue: 0 });

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await updateInvoice.mutateAsync({ 
        id, 
        data: { 
          status,
          ...(status === 'paid' ? { paidDate: new Date() } : {})
        } 
      });
      toast({
        title: "Success",
        description: "Invoice status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

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
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Invoice Management</h1>
            <p className="text-chocolate-600">Generate and track supplier invoices with GST</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Plus className="mr-2 w-4 h-4" />
              Create Invoice
            </Button>
            <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Download className="mr-2 w-4 h-4" />
              Export All
            </Button>
          </div>
        </div>

        {/* Invoice Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-scale-in">
          <StatsCard
            title="Total Invoices"
            value={invoices.length}
            icon={FileText}
            iconColor="bg-blue-500"
          />
          <StatsCard
            title="Paid Amount"
            value={`₹${(stats.paid / 100000).toFixed(1)}L`}
            change="+8% from last month"
            changeType="positive"
            icon={CheckCircle}
            iconColor="bg-green-500"
          />
          <StatsCard
            title="Pending Payment"
            value={`₹${(stats.pending / 100000).toFixed(1)}L`}
            icon={Clock}
            iconColor="bg-orange-500"
          />
          <StatsCard
            title="Overdue"
            value={`₹${(stats.overdue / 1000).toFixed(0)}K`}
            change="Needs attention"
            changeType="negative"
            icon={AlertTriangle}
            iconColor="bg-red-500"
          />
        </div>

        {/* Filters */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="text-xl font-bold text-chocolate-800">Invoice Filters</h3>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={supplierFilter} onValueChange={setSupplierFilter}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Suppliers</SelectItem>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.id.toString()}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <InvoiceTable 
          invoices={invoices}
          suppliers={suppliers || []}
          onStatusUpdate={handleStatusUpdate}
          isUpdating={updateInvoice.isPending}
        />

        {/* Empty State */}
        {invoices.length === 0 && (
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200">
            <CardContent className="p-12 text-center">
              <div className="text-chocolate-400 text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-chocolate-800 mb-2">No Invoices Found</h3>
              <p className="text-chocolate-600 mb-6">
                {statusFilter || supplierFilter ? "Try adjusting your filters" : "Start by creating your first invoice"}
              </p>
              <Button className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl">
                <Plus className="mr-2 w-4 h-4" />
                Create First Invoice
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
