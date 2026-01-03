import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format, subDays, startOfDay, endOfDay } from "date-fns";
import { formatPrice } from "@/lib/utils";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  Download,
  Eye,
  Activity,
  Target,
  Award,
  Clock
} from "lucide-react";
import { useState } from "react";

export default function AdminReports({ reports }: { reports: any }) {
  const [dateRange, setDateRange] = useState("7d");

  // Calculate growth percentages (mock data for now)
  const salesGrowth = 12.5;
  const ordersGrowth = 8.2;
  const usersGrowth = 15.3;
  const productsGrowth = 2.1;

  const statsCards = [
    {
      title: "Total Revenue",
      value: formatPrice(reports?.totalSales || 0),
      icon: DollarSign,
      change: `+${salesGrowth}%`,
      changeType: "positive" as const,
      description: "vs last period",
      color: "green"
    },
    {
      title: "Total Orders",
      value: reports?.totalOrders || 0,
      icon: ShoppingCart,
      change: `+${ordersGrowth}%`,
      changeType: "positive" as const,
      description: "vs last period",
      color: "blue"
    },
    {
      title: "Active Users",
      value: reports?.totalUsers || 0,
      icon: Users,
      change: `+${usersGrowth}%`,
      changeType: "positive" as const,
      description: "vs last period",
      color: "purple"
    },
    {
      title: "Products",
      value: reports?.totalProducts || 0,
      icon: Package,
      change: `+${productsGrowth}%`,
      changeType: "positive" as const,
      description: "vs last period",
      color: "orange"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      green: "bg-green-50 text-green-600",
      blue: "bg-blue-50 text-blue-600",
      purple: "bg-purple-50 text-purple-600",
      orange: "bg-orange-50 text-orange-600"
    };
    return colors[color as keyof typeof colors] || "bg-gray-50 text-gray-600";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Business insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${getColorClasses(stat.color)}`}>
                  <Icon className="h-5 w-5" />
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

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-600" />
              Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-green-600">{formatPrice(reports?.monthlyRevenue || 0)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Target</p>
                  <p className="text-lg font-semibold text-gray-700">{formatPrice(50000)}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Progress to target</span>
                  <span className="text-sm font-medium text-gray-900">
                    {Math.round(((reports?.monthlyRevenue || 0) / 50000) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(((reports?.monthlyRevenue || 0) / 50000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Award className="w-5 h-5 mr-2 text-purple-600" />
              Top Performing Products
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reports?.topProducts?.slice(0, 5).map((product: any, index: number) => (
                <div key={product.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category?.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{product.orderCount || 0} orders</p>
                    <p className="text-xs text-green-600">{formatPrice(product.revenue || 0)}</p>
                  </div>
                </div>
              )) || (
                <div className="text-center py-8 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No product data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2 text-green-600" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold">Order</TableHead>
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Amount</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports?.recentOrders?.slice(0, 10).map((order: any) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">#{order.id.slice(0, 8)}</TableCell>
                      <TableCell className="text-sm">
                        {order.user?.firstName} {order.user?.lastName}
                      </TableCell>
                      <TableCell className="font-semibold text-sm">{formatPrice(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={order.status === 'completed' ? 'default' : 'secondary'}
                          className={`text-xs ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {format(new Date(order.createdAt), "MMM dd")}
                      </TableCell>
                    </TableRow>
                  )) || (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                        <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No recent orders</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-600" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">Avg. Order Value</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice((reports?.totalSales || 0) / Math.max(reports?.totalOrders || 1, 1))}
                </span>
              </div>
            </div>

            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">Conversion Rate</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {((reports?.totalOrders || 0) / Math.max(reports?.totalUsers || 1, 1) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">New Customers</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {reports?.newCustomersThisMonth || 0}
                </span>
              </div>
            </div>

            <div className="p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Low Stock Items</span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {reports?.lowStockItems || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
            Performance Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Revenue Growth</p>
              <p className="text-2xl font-bold text-blue-600">+{salesGrowth}%</p>
              <p className="text-xs text-gray-500">vs last period</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Order Growth</p>
              <p className="text-2xl font-bold text-green-600">+{ordersGrowth}%</p>
              <p className="text-xs text-gray-500">vs last period</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">User Growth</p>
              <p className="text-2xl font-bold text-purple-600">+{usersGrowth}%</p>
              <p className="text-xs text-gray-500">vs last period</p>
            </div>

            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6 text-orange-600" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Product Growth</p>
              <p className="text-2xl font-bold text-orange-600">+{productsGrowth}%</p>
              <p className="text-xs text-gray-500">vs last period</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
