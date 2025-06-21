import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

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
  iconColor = "text-primary" 
}: StatsCardProps) {
  const getChangeColor = () => {
    switch (changeType) {
      case "positive":
        return "text-green-500";
      case "negative":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <motion.div
      whileHover={{ 
        scale: 1.02,
        rotateY: 5,
      }}
      whileTap={{ scale: 0.98 }}
      className="premium-card p-6 hover-lift cursor-pointer group"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground group-hover:text-primary/70 transition-colors">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground mt-2 glow-text">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${getChangeColor()}`}>
              {change} from last month
            </p>
          )}
        </div>
        
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          className={`
            p-3 rounded-xl bg-muted/30 group-hover:bg-primary/20 transition-all duration-300
            ${iconColor}
          `}
        >
          <Icon className="h-6 w-6" />
        </motion.div>
      </div>

      {/* Animated background gradient */}
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl" />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden rounded-xl pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
            animate={{
              y: [-10, -20, -10],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}