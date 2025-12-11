import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function UserOrders({ orders }: { orders: any }) {
  if (!orders || orders.length === 0) {
    return <div className="text-center py-8 text-gray-500">No orders yet</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Order History</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "PPP")}</TableCell>
                <TableCell>{order.items?.length || 0} items</TableCell>
                <TableCell className="font-semibold">{formatPrice(order.totalAmount)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "completed"
                        ? "default"
                        : order.status === "processing"
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Order Details</DialogTitle>
                        <DialogDescription>
                          Order ID: {order.id}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">Order Date</p>
                            <p className="text-sm">{format(new Date(order.createdAt), "PPP")}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Status</p>
                            <Badge
                              variant={
                                order.status === "completed"
                                  ? "default"
                                  : order.status === "processing"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {order.status}
                            </Badge>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Payment Method</p>
                            <p className="text-sm">{order.paymentMethod || "Not specified"}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-500">Shipping Address</p>
                            <p className="text-sm">{order.shippingAddress || "N/A"}</p>
                          </div>
                        </div>

                        {order.notes && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Notes</p>
                            <p className="text-sm">{order.notes}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-2">Order Items</p>
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Product</TableHead>
                                  <TableHead>Quantity</TableHead>
                                  <TableHead>Price</TableHead>
                                  <TableHead>Subtotal</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {order.items?.map((item: any) => (
                                  <TableRow key={item.id}>
                                    <TableCell>{item.product?.name || "Unknown Product"}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{formatPrice(item.priceAtPurchase)}</TableCell>
                                    <TableCell>{formatPrice(item.subtotal)}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="text-lg font-semibold">Total</span>
                          <span className="text-2xl font-bold text-blue-600">{formatPrice(order.totalAmount)}</span>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
