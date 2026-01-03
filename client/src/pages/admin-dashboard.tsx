import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Bell, 
  LogOut, 
  Menu,
  X,
  BarChart3,
  Settings,
  Home,
  TrendingUp,
  Activity,
  FileText,
  Zap,
  MessageSquare
} from "lucide-react";
import AdminUsers from "@/components/admin/admin-users";
import AdminOrders from "@/components/admin/admin-orders";
import AdminProducts from "@/components/admin/admin-products";
import AdminReports from "@/components/admin/admin-reports";
import AdminNewsFlash from "@/components/admin/admin-newsflash";
import AdminNotifications from "@/components/admin/admin-notifications";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { id: "overview", label: "Dashboard", icon: Home },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "products", label: "Products", icon: Package },
  { id: "users", label: "Customers", icon: Users },
  { id: "newsflash", label: "News Flash", icon: Bell },
  { id: "notifications", label: "Notifications", icon: MessageSquare },
  { id: "reports", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboard() {
  const { admin, isAdmin, logout } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
    }
  }, [isAdmin, navigate]);

  const { data: reports } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await fetch("/api/admin/reports");
      if (!res.ok) throw new Error("Failed to fetch reports");
      return res.json();
    },
  });

  const { data: recentActivity } = useQuery({
    queryKey: ["admin-activity"],
    queryFn: async () => {
      const res = await fetch("/api/admin/activity");
      if (!res.ok) return [];
      return res.json();
    },
  });

  if (!isAdmin) {
    return null;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewContent reports={reports} recentActivity={recentActivity} />;
      case "orders":
        return <AdminOrders />;
      case "users":
        return <AdminUsers />;
      case "products":
        return <AdminProducts />;
      case "reports":
        return <AdminReports reports={reports} />;
      case "newsflash":
        return <AdminNewsFlash />;
      case "notifications":
        return <AdminNotifications />;
      case "settings":
        return <SettingsContent admin={admin} />;
      default:
        return <OverviewContent reports={reports} recentActivity={recentActivity} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">StandFit Admin</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200",
                    activeTab === item.id
                      ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mr-3",
                    activeTab === item.id ? "text-blue-600" : "text-gray-400"
                  )} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Admin Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={admin?.email} />
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                {admin?.firstName?.[0]}{admin?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {admin?.firstName} {admin?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="w-full justify-start text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 capitalize">
                  {activeTab === "newsflash" ? "News Flash" : activeTab}
                </h1>
                <p className="text-sm text-gray-600">
                  {activeTab === "overview" && "Dashboard overview and key metrics"}
                  {activeTab === "orders" && "Manage customer orders and fulfillment"}
                  {activeTab === "products" && "Product catalog and inventory management"}
                  {activeTab === "users" && "Customer accounts and user management"}
                  {activeTab === "reports" && "Analytics and business insights"}
                  {activeTab === "newsflash" && "Manage news flash content"}
                  {activeTab === "notifications" && "Send notifications and manage alerts"}
                  {activeTab === "settings" && "System configuration and preferences"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
                <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
                  3
                </Badge>
              </Button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Overview Content Component
function OverviewContent({ reports, recentActivity }: { reports: any; recentActivity: any }) {
  const statsCards = [
    {
      title: "Total Revenue",
      value: formatPrice(reports?.totalSales || 0),
      icon: DollarSign,
      change: "+12.5%",
      changeType: "positive" as const,
      description: "vs last month"
    },
    {
      title: "Total Orders",
      value: reports?.totalOrders || 0,
      icon: ShoppingCart,
      change: "+8.2%",
      changeType: "positive" as const,
      description: "vs last month"
    },
    {
      title: "Active Users",
      value: reports?.totalUsers || 0,
      icon: Users,
      change: "+15.3%",
      changeType: "positive" as const,
      description: "vs last month"
    },
    {
      title: "Products",
      value: reports?.totalProducts || 0,
      icon: Package,
      change: "+2.1%",
      changeType: "positive" as const,
      description: "vs last month"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <Icon className="h-5 w-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="flex items-center text-xs">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-green-600 font-medium">{stat.change}</span>
                  <span className="text-gray-500 ml-1">{stat.description}</span>
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -mr-10 -mt-10" />
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity?.slice(0, 5).map((activity: any, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-500">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Package className="w-4 h-4 mr-2" />
              Add New Product
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ShoppingCart className="w-4 h-4 mr-2" />
              View Pending Orders
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Bell className="w-4 h-4 mr-2" />
              Send Notification
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {reports?.recentOrders?.slice(0, 5).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-500">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatPrice(order.totalAmount)}</p>
                  <Badge variant={order.status === 'completed' ? 'default' : 'secondary'} className="text-xs">
                    {order.status}
                  </Badge>
                </div>
              </div>
            )) || (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Settings Content Component
function SettingsContent({ admin }: { admin: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-gray-600" />
            System Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admin Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{admin?.firstName || "N/A"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{admin?.lastName || "N/A"}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">{admin?.email || "N/A"}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">v1.0.0</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Environment</label>
                <p className="text-sm text-gray-900 p-2 bg-gray-50 rounded">Production</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Settings className="w-4 h-4 mr-2" />
              Update Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
