import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, Package, Calendar, FileText, Truck, 
  CheckCircle, ExternalLink, Clock
} from "lucide-react";
import { format } from "date-fns";
import type { Alert } from "@shared/schema";

interface AlertItemProps {
  alert: Alert;
  onMarkAsRead?: (id: number) => void;
  onResolve?: (id: number) => void;
  onView?: (alert: Alert) => void;
  isUpdating?: boolean;
}

export default function AlertItem({ 
  alert, 
  onMarkAsRead, 
  onResolve, 
  onView,
  isUpdating = false
}: AlertItemProps) {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return AlertTriangle;
      case "expiry":
        return Calendar;
      case "overdue_payment":
        return FileText;
      case "delivery_received":
        return Truck;
      default:
        return Package;
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    if (severity === "critical") return "bg-red-500";
    
    switch (type) {
      case "low_stock":
        return "bg-red-500";
      case "expiry":
        return "bg-yellow-500";
      case "overdue_payment":
        return "bg-red-500";
      case "delivery_received":
        return "bg-blue-500";
      default:
        return "bg-chocolate-500";
    }
  };

  const getSeverityBadge = (severity: string) => {
    const config = {
      low: { color: "bg-blue-100 text-blue-800" },
      medium: { color: "bg-yellow-100 text-yellow-800" },
      high: { color: "bg-orange-100 text-orange-800" },
      critical: { color: "bg-red-100 text-red-800" },
    };

    const { color } = config[severity as keyof typeof config] || config.medium;
    
    return (
      <Badge className={color}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const alertDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - alertDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return format(alertDate, "dd MMM yyyy");
  };

  const IconComponent = getAlertIcon(alert.type);
  const iconColor = getAlertColor(alert.type, alert.severity);

  return (
    <div className={`p-6 hover:bg-chocolate-50 transition-colors duration-300 flex items-start space-x-4 ${
      !alert.isRead ? "bg-chocolate-25" : ""
    }`}>
      <div className={`${iconColor} text-white p-3 rounded-xl flex-shrink-0`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-bold text-chocolate-800">{alert.title}</h4>
              {getSeverityBadge(alert.severity)}
              {!alert.isRead && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  New
                </Badge>
              )}
              {alert.isResolved && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Resolved
                </Badge>
              )}
            </div>
            <p className="text-chocolate-600 mb-2">{alert.message}</p>
            <div className="flex items-center space-x-4 text-sm text-chocolate-500">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatTimeAgo(alert.createdAt)}
              </span>
              <span className="capitalize">{alert.type.replace('_', ' ')}</span>
              {alert.entityType && (
                <span className="capitalize">{alert.entityType}</span>
              )}
            </div>
          </div>
          <div className="flex space-x-2 flex-shrink-0 ml-4">
            {!alert.isRead && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMarkAsRead?.(alert.id)}
                disabled={isUpdating}
                className="px-3 py-1"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Read
              </Button>
            )}
            {!alert.isResolved && (
              <Button
                size="sm"
                onClick={() => onResolve?.(alert.id)}
                disabled={isUpdating}
                className="bg-chocolate-500 hover:bg-chocolate-600 text-white px-3 py-1"
              >
                Resolve
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView?.(alert)}
              className="px-3 py-1"
            >
              <ExternalLink className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
