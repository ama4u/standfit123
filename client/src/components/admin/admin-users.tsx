import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye } from "lucide-react";

export default function AdminUsers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      toast({ title: "Success", description: "User deleted" });
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Users Management</h2>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Wholesale</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user: any) => (
              <TableRow key={user.id}>
                <TableCell>{user.firstName} {user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber || "-"}</TableCell>
                <TableCell className="max-w-xs truncate" title={user.contactAddress || "No address"}>
                  {user.contactAddress || "-"}
                </TableCell>
                <TableCell>
                  {user.isWholesaleCustomer ? (
                    <Badge>Wholesale</Badge>
                  ) : (
                    <Badge variant="secondary">Retail</Badge>
                  )}
                </TableCell>
                <TableCell>{format(new Date(user.createdAt), "PP")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>User Details</DialogTitle>
                          <DialogDescription>
                            Complete information for {user.firstName} {user.lastName}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-gray-500">User ID</p>
                              <p className="text-sm font-mono">{user.id}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Account Type</p>
                              {user.isWholesaleCustomer ? (
                                <Badge>Wholesale Customer</Badge>
                              ) : (
                                <Badge variant="secondary">Retail Customer</Badge>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">First Name</p>
                              <p className="text-sm">{user.firstName || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last Name</p>
                              <p className="text-sm">{user.lastName || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Email Address</p>
                              <p className="text-sm">{user.email || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Phone Number</p>
                              <p className="text-sm">{user.phoneNumber || "N/A"}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-sm font-medium text-gray-500">Full Address</p>
                              <p className="text-sm">{user.contactAddress || "No address provided"}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Profile Image</p>
                              {user.profileImageUrl ? (
                                <img src={user.profileImageUrl} alt="Profile" className="w-16 h-16 rounded-full object-cover border" />
                              ) : (
                                <p className="text-sm text-gray-400">No image</p>
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Account Created</p>
                              <p className="text-sm">{format(new Date(user.createdAt), "PPP")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-500">Last Updated</p>
                              <p className="text-sm">{format(new Date(user.updatedAt), "PPP")}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUserMutation.mutate(user.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
