import { useState } from "react";
import { useAlerts, useMarkAlertAsRead, useResolveAlert } from "@/hooks/use-alerts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AlertItem from "@/components/alert-item";
import StatsCard from "@/components/stats-card";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, SquareCheck, AlertTriangle, Package, Calendar, 
  FileText, Bell
} from "lucide-react";

export default function Alerts() {
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { toast } = useToast();
  
  const { data: alerts, isLoading } = useAlerts();
  const markAsRead = useMarkAlertAsRead();
  const resolveAlert = useResolveAlert();

  const filteredAlerts = alerts?.filter(alert => {
    const matchesType = !typeFilter || alert.type === typeFilter;
    const matchesStatus = !statusFilter || 
      (statusFilter === "unread" && !alert.isRead) ||
      (statusFilter === "read" && alert.isRead) ||
      (statusFilter === "resolved" && alert.isResolved) ||
      (statusFilter === "unresolved" && !alert.isResolved);
    
    return matchesType && matchesStatus;
  }) || [];

  // Calculate statistics
  const stats = alerts ? {
    total: alerts.length,
    unread: alerts.filter(a => !a.isRead).length,
    resolved: alerts.filter(a => a.isResolved).length,
    critical: alerts.filter(a => a.severity === 'critical').length,
    lowStock: alerts.filter(a => a.type === 'low_stock').length,
    expiry: alerts.filter(a => a.type === 'expiry').length,
    overdue: alerts.filter(a => a.type === 'overdue_payment').length,
  } : { total: 0, unread: 0, resolved: 0, critical: 0, lowStock: 0, expiry: 0, overdue: 0 };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsRead.mutateAsync(id);
      toast({
        title: "Success",
        description: "Alert marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark alert as read",
        variant: "destructive",
      });
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await resolveAlert.mutateAsync({ id, userId: 1 });
      toast({
        title: "Success",
        description: "Alert resolved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resolve alert",
        variant: "destructive",
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadAlerts = alerts?.filter(a => !a.isRead) || [];
      await Promise.all(unreadAlerts.map(alert => markAsRead.mutateAsync(alert.id)));
      toast({
        title: "Success",
        description: "All alerts marked as read",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark all alerts as read",
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
            <h1 className="text-3xl font-bold text-chocolate-800 mb-2">Alerts & Notifications</h1>
            <p className="text-chocolate-600">Monitor system alerts and inventory notifications</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 sm:mt-0 animate-fade-in">
            <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              <Settings className="mr-2 w-4 h-4" />
              Settings
            </Button>
            <Button 
              onClick={handleMarkAllAsRead}
              disabled={markAsRead.isPending}
              className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <SquareCheck className="mr-2 w-4 h-4" />
              Mark All Read
            </Button>
          </div>
        </div>

        {/* Alert Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-scale-in">
          <StatsCard
            title="Active Alerts"
            value={stats.total - stats.resolved}
            icon={AlertTriangle}
            iconColor="bg-red-500"
          />
          <StatsCard
            title="Low Stock"
            value={stats.lowStock}
            icon={Package}
            iconColor="bg-orange-500"
          />
          <StatsCard
            title="Expiring Soon"
            value={stats.expiry}
            icon={Calendar}
            iconColor="bg-yellow-500"
          />
          <StatsCard
            title="Overdue Bills"
            value={stats.overdue}
            icon={FileText}
            iconColor="bg-red-500"
          />
        </div>

        {/* Filters */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <h3 className="text-xl font-bold text-chocolate-800">Alert Filters</h3>
              <div className="flex gap-2 mt-4 sm:mt-0">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="expiry">Expiry</SelectItem>
                    <SelectItem value="overdue_payment">Overdue Payment</SelectItem>
                    <SelectItem value="delivery_received">Delivery</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="unread">Unread</SelectItem>
                    <SelectItem value="read">Read</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="unresolved">Unresolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts List */}
        <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-chocolate-800">
              Recent Alerts ({filteredAlerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-chocolate-200">
              {filteredAlerts.map((alert) => (
                <AlertItem
                  key={alert.id}
                  alert={alert}
                  onMarkAsRead={handleMarkAsRead}
                  onResolve={handleResolve}
                  isUpdating={markAsRead.isPending || resolveAlert.isPending}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredAlerts.length === 0 && (
          <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 mt-8">
            <CardContent className="p-12 text-center">
              <div className="text-chocolate-400 text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold text-chocolate-800 mb-2">No Alerts Found</h3>
              <p className="text-chocolate-600 mb-6">
                {typeFilter || statusFilter ? "Try adjusting your filters" : "All caught up! No alerts at the moment."}
              </p>
              {(typeFilter || statusFilter) && (
                <Button 
                  onClick={() => {
                    setTypeFilter("");
                    setStatusFilter("");
                  }}
                  className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-6 py-3 rounded-xl"
                >
                  Clear Filters
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
