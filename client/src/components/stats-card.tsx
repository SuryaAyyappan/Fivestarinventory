import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconColor?: string;
}

export default function StatsCard({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon: Icon, 
  iconColor = "bg-chocolate-500" 
}: StatsCardProps) {
  const changeColorMap = {
    positive: "text-green-600",
    negative: "text-red-600",
    neutral: "text-chocolate-600"
  };

  return (
    <Card className="card-3d bg-white rounded-2xl shadow-xl border border-chocolate-200 animate-fade-in">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-chocolate-600 text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-chocolate-800">{value}</p>
            {change && (
              <p className={`text-sm ${changeColorMap[changeType]}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`${iconColor} text-white p-4 rounded-xl`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
