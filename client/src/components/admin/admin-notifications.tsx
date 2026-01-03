import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { 
  Bell, 
  Send, 
  Trash, 
  Eye, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  MessageSquare,
  Users,
  Megaphone
} from "lucide-react";
import { useState } from "react";

export default function AdminNotifications() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("info");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const res = await fetch("/api/admin/notifications");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const sendNotificationMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send notification");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      setTitle("");
      setMessage("");
      setType("info");
      toast({ title: "Success", description: "Notification sent successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send notification", variant: "destructive" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/notifications/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete notification");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
      toast({ title: "Success", description: "Notification deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete notification", variant: "destructive" });
    },
  });

  const getTypeIcon = (notificationType: string) => {
    switch (notificationType) {
      case "success": return <CheckCircle className="w-4 h-4" />;
      case "warning": return <AlertCircle className="w-4 h-4" />;
      case "error": return <AlertCircle className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const getTypeColor = (notificationType: string) => {
    switch (notificationType) {
      case "success": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "warning": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "error": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Send notifications to users and manage system alerts</p>
        </div>
      </div>

      {/* Send Notification Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Megaphone className="w-5 h-5 mr-2 text-blue-600" />
            Send New Notification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Notification title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="warning">Warning</option>
                <option value="error">Error</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Notification message"
              rows={3}
            />
          </div>
          <Button
            onClick={() => {
              if (!title.trim() || !message.trim()) {
                toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" });
                return;
              }
              sendNotificationMutation.mutate({ title, message, type });
            }}
            disabled={sendNotificationMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Send className="w-4 h-4 mr-2" />
            {sendNotificationMutation.isPending ? "Sending..." : "Send Notification"}
          </Button>
        </CardContent>
      </Card>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sent</p>
                <p className="text-2xl font-bold text-gray-900">{notifications?.length || 0}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Info</p>
                <p className="text-2xl font-bold text-blue-600">
                  {notifications?.filter((n: any) => n.type === "info").length || 0}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Info className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success</p>
                <p className="text-2xl font-bold text-green-600">
                  {notifications?.filter((n: any) => n.type === "success").length || 0}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {notifications?.filter((n: any) => n.type === "warning" || n.type === "error").length || 0}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
            Recent Notifications
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {notifications?.length > 0 ? (
              notifications.map((notification: any) => (
                <div key={notification.id} className="flex items-start justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>{format(new Date(notification.createdAt), "MMM dd, yyyy 'at' h:mm a")}</span>
                        <Badge variant="outline" className="text-xs">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this notification?")) {
                          deleteNotificationMutation.mutate(notification.id);
                        }
                      }}
                      disabled={deleteNotificationMutation.isPending}
                    >
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications sent</h3>
                <p className="text-gray-500">Send your first notification to users</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}