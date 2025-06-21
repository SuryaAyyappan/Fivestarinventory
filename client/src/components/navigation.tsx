import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Menu, Store, BarChart3, Package, Warehouse, Truck, FileText, TrendingUp, Bell, User } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/products", label: "Products", icon: Package },
    { href: "/inventory", label: "Inventory", icon: Warehouse },
    { href: "/suppliers", label: "Suppliers", icon: Truck },
    { href: "/invoices", label: "Invoices", icon: FileText },
    { href: "/reports", label: "Reports", icon: TrendingUp },
    { href: "/alerts", label: "Alerts", icon: Bell, badge: 3 },
  ];

  const NavItem = ({ href, label, icon: Icon, badge, mobile = false }: { 
    href: string; 
    label: string; 
    icon: any; 
    badge?: number; 
    mobile?: boolean;
  }) => {
    const isActive = location === href;
    
    return (
      <Link href={href} onClick={() => mobile && setIsOpen(false)}>
        <Button
          variant={isActive ? "default" : "ghost"}
          className={`
            ${mobile ? "w-full justify-start" : ""}
            ${isActive 
              ? "bg-chocolate-500 text-white hover:bg-chocolate-600" 
              : "text-chocolate-600 hover:text-chocolate-800 hover:bg-chocolate-100"
            }
            transition-all duration-300 relative
          `}
        >
          <Icon className="w-4 h-4 mr-2" />
          {label}
          {badge && (
            <Badge 
              variant="destructive" 
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs animate-pulse"
            >
              {badge}
            </Badge>
          )}
        </Button>
      </Link>
    );
  };

  return (
    <nav className="nav-3d bg-white shadow-xl border-b-4 border-chocolate-500 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center animate-fade-in cursor-pointer">
              <div className="chocolate-gradient text-white p-3 rounded-xl shadow-lg mr-3">
                <Store className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-chocolate-700">eMart 5 Star</h1>
                <p className="text-xs text-chocolate-500">Premium Inventory</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-2">
            {navItems.map((item) => (
              <NavItem key={item.href} {...item} />
            ))}
          </div>

          {/* User Profile & Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-chocolate-500 text-white border-chocolate-500 hover:bg-chocolate-600 hover:border-chocolate-600 transition-all duration-300 hover:scale-110"
            >
              <User className="w-4 h-4" />
            </Button>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  <div className="flex items-center mb-6">
                    <div className="chocolate-gradient text-white p-3 rounded-xl shadow-lg mr-3">
                      <Store className="w-6 h-6" />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold text-chocolate-700">eMart 5 Star</h1>
                      <p className="text-xs text-chocolate-500">Premium Inventory</p>
                    </div>
                  </div>
                  {navItems.map((item) => (
                    <NavItem key={item.href} {...item} mobile />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
