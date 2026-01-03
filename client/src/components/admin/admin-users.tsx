import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye, Search, Filter, Download, UserPlus, MoreHorizontal, Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete user");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast({ title: "Success", description: "User deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete user", variant: "destructive" });
    },
  });

  const filteredUsers = users?.filter((user: any) => {
    const matchesSearch = 
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phoneNumber?.includes(searchTerm);
    
    const matchesFilter = 
      filterType === "all" ||
      (filterType === "wholesale" && user.isWholesaleCustomer) ||
      (filterType === "retail" && !user.isWholesaleCustomer);
    
    return matchesSearch && matchesFilter;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">Users Management</h2>
          <p className="text-gray-600">Manage customer accounts and user information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <UserPlus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users?.length || 0}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wholesale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users?.filter((u: any) => u.isWholesaleCustomer).length || 0}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">W</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retail</p>
                <p className="text-2xl font-bold text-gray-900">
                  {users?.filter((u: any) => !u.isWholesaleCustomer).length || 0}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Badge className="bg-purple-100 text-purple-800">R</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search users by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Users</option>
                <option value="wholesale">Wholesale Only</option>
                <option value="retail">Retail Only</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">User</TableHead>
                  <TableHead className="font-semibold">Contact</TableHead>
                  <TableHead className="font-semibold">Type</TableHead>
                  <TableHead className="font-semibold">Joined</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers?.map((user: any) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={user.profileImageUrl} />
                          <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-sm text-gray-500 font-mono">
                            ID: {user.id.slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                        {user.phoneNumber && (
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            {user.phoneNumber}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isWholesaleCustomer ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                          Wholesale
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200">
                          Retail
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {format(new Date(user.createdAt), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-3">
                                <Avatar className="w-12 h-12">
                                  <AvatarImage src={user.profileImageUrl} />
                                  <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xl font-bold">{user.firstName} {user.lastName}</p>
                                  <p className="text-sm text-gray-500 font-normal">User Details</p>
                                </div>
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">User ID</p>
                                    <p className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{user.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Account Type</p>
                                    {user.isWholesaleCustomer ? (
                                      <Badge className="bg-green-100 text-green-800">Wholesale Customer</Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">Retail Customer</Badge>
                                    )}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Email Address</p>
                                    <p className="text-sm flex items-center">
                                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                      {user.email || "N/A"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Phone Number</p>
                                    <p className="text-sm flex items-center">
                                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                      {user.phoneNumber || "N/A"}
                                    </p>
                                  </div>
                                </div>
                                <div className="space-y-4">
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Full Address</p>
                                    <p className="text-sm flex items-start">
                                      <MapPin className="w-4 h-4 mr-2 text-gray-400 mt-0.5" />
                                      <span>{user.contactAddress || "No address provided"}</span>
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Account Created</p>
                                    <p className="text-sm">{format(new Date(user.createdAt), "PPP")}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Last Updated</p>
                                    <p className="text-sm">{format(new Date(user.updatedAt), "PPP")}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${user.firstName} ${user.lastName}?`)) {
                                  deleteUserMutation.mutate(user.id);
                                }
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredUsers?.length === 0 && (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
              <p className="text-gray-500">
                {searchTerm || filterType !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "No users have been registered yet"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
