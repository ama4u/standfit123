import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/utils";
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash, 
  Upload, 
  Image as ImageIcon, 
  Package, 
  DollarSign,
  Tag,
  Star,
  Eye,
  Download,
  MoreHorizontal,
  X,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export default function AdminProducts() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  // Form states
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    unit: "",
    categoryId: "",
    featured: false,
    inStock: true,
    imageFile: null as File | null,
    imageUrl: ""
  });

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: ""
  });

  const { data: products, isLoading: loadingProducts } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await fetch("/api/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json();
    },
  });

  // Image upload mutation
  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-media", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Image upload failed");
      return res.json() as Promise<{ url: string; filename: string; publicId: string }>;
    },
    onSuccess: (data) => {
      setProductForm(prev => ({ ...prev, imageUrl: data.url }));
      toast({ title: "Success", description: "Image uploaded successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to upload image", variant: "destructive" });
    },
  });

  // Product mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      resetProductForm();
      setShowAddProduct(false);
      toast({ title: "Success", description: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create product", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to update product");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
      resetProductForm();
      toast({ title: "Success", description: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Success", description: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    },
  });

  // Category mutations
  const createCategoryMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      setCategoryForm({ name: "", description: "" });
      setShowAddCategory(false);
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create category", variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
      toast({ title: "Success", description: "Category deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete category", variant: "destructive" });
    },
  });

  const resetProductForm = () => {
    setProductForm({
      name: "",
      description: "",
      price: "",
      unit: "",
      categoryId: "",
      featured: false,
      inStock: true,
      imageFile: null,
      imageUrl: ""
    });
  };

  const handleImageUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "Error", description: "Image size must be less than 10MB", variant: "destructive" });
      return;
    }
    
    setProductForm(prev => ({ ...prev, imageFile: file }));
    uploadImageMutation.mutate(file);
  };

  const handleProductSubmit = () => {
    if (!productForm.name.trim() || !productForm.price) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }

    const data = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      unit: productForm.unit,
      categoryId: productForm.categoryId || null,
      featured: productForm.featured,
      inStock: productForm.inStock,
      imageUrl: productForm.imageUrl,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const startEditProduct = (product: any) => {
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      unit: product.unit || "",
      categoryId: product.categoryId || "",
      featured: product.featured || false,
      inStock: product.inStock !== false,
      imageFile: null,
      imageUrl: product.imageUrl || ""
    });
    setShowAddProduct(true);
  };

  const filteredProducts = products?.filter((product: any) => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      categoryFilter === "all" || 
      product.categoryId === categoryFilter ||
      (categoryFilter === "uncategorized" && !product.categoryId);
    
    return matchesSearch && matchesCategory;
  });

  if (loadingProducts) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const productStats = {
    total: products?.length || 0,
    featured: products?.filter((p: any) => p.featured).length || 0,
    inStock: products?.filter((p: any) => p.inStock !== false).length || 0,
    outOfStock: products?.filter((p: any) => p.inStock === false).length || 0
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Product Management</h2>
          <p className="text-gray-600">Manage your product catalog and inventory</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAddCategory(true)}
          >
            <Tag className="w-4 h-4 mr-2" />
            Add Category
          </Button>
          <Button 
            size="sm" 
            onClick={() => setShowAddProduct(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{productStats.total}</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Featured</p>
                <p className="text-2xl font-bold text-yellow-600">{productStats.featured}</p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-green-600">{productStats.inStock}</p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Check className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">{productStats.outOfStock}</p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600" />
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
                  placeholder="Search products by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="uncategorized">Uncategorized</SelectItem>
                  {categories?.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Product</TableHead>
                  <TableHead className="font-semibold">Category</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts?.map((product: any) => (
                  <TableRow key={product.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12 rounded-lg">
                          <AvatarImage src={product.imageUrl} className="object-cover" />
                          <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-lg">
                            <Package className="w-6 h-6" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-sm text-gray-500 line-clamp-1">
                            {product.description || "No description"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.featured && (
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            {product.unit && (
                              <Badge variant="outline" className="text-xs">
                                {product.unit}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {product.category ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {product.category.name}
                        </Badge>
                      ) : (
                        <span className="text-gray-400 text-sm">Uncategorized</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600 mr-1" />
                        <span className="font-semibold text-green-600">
                          {formatPrice(product.price)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={product.inStock !== false ? "default" : "destructive"}
                        className={product.inStock !== false ? "bg-green-100 text-green-800" : ""}
                      >
                        {product.inStock !== false ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEditProduct(product)}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
                                  deleteProductMutation.mutate(product.id);
                                }
                              }}
                              className="text-red-600 focus:text-red-600"
                            >
                              <Trash className="w-4 h-4 mr-2" />
                              Delete Product
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
          
          {filteredProducts?.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Get started by adding your first product"
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={(open) => {
        setShowAddProduct(open);
        if (!open) {
          setEditingProduct(null);
          resetProductForm();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              {editingProduct ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              {editingProduct ? "Update product information" : "Create a new product for your catalog"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">Product Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                {productForm.imageUrl ? (
                  <div className="relative">
                    <img 
                      src={productForm.imageUrl} 
                      alt="Product preview" 
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProductForm(prev => ({ ...prev, imageUrl: "", imageFile: null }))}
                      className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <div>
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Upload product image</p>
                    <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                  className="hidden"
                  id="product-image"
                />
                <Label htmlFor="product-image" className="cursor-pointer">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="mt-4"
                    disabled={uploadImageMutation.isPending}
                  >
                    {uploadImageMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="w-4 h-4 mr-2" />
                    )}
                    {uploadImageMutation.isPending ? "Uploading..." : "Choose Image"}
                  </Button>
                </Label>
              </div>
            </div>

            {/* Product Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-name">Product Name *</Label>
                <Input
                  id="product-name"
                  value={productForm.name}
                  onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="product-unit">Unit</Label>
                <Input
                  id="product-unit"
                  value={productForm.unit}
                  onChange={(e) => setProductForm(prev => ({ ...prev, unit: e.target.value }))}
                  placeholder="e.g., kg, pieces, liters"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                value={productForm.description}
                onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="product-price">Price *</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="product-category">Category</Label>
                <Select 
                  value={productForm.categoryId} 
                  onValueChange={(value) => setProductForm(prev => ({ ...prev, categoryId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No Category</SelectItem>
                    {categories?.map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Product Options */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">Featured Product</Label>
                  <p className="text-sm text-gray-500">Show this product prominently on the homepage</p>
                </div>
                <Switch
                  checked={productForm.featured}
                  onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, featured: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <Label className="text-sm font-medium">In Stock</Label>
                  <p className="text-sm text-gray-500">Product is available for purchase</p>
                </div>
                <Switch
                  checked={productForm.inStock}
                  onCheckedChange={(checked) => setProductForm(prev => ({ ...prev, inStock: checked }))}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowAddProduct(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleProductSubmit}
                disabled={createProductMutation.isPending || updateProductMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Add New Category
            </DialogTitle>
            <DialogDescription>
              Create a new product category to organize your products
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="category-name">Category Name *</Label>
              <Input
                id="category-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
              />
            </div>
            
            <div>
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter category description"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button 
                variant="outline" 
                onClick={() => setShowAddCategory(false)}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => {
                  if (!categoryForm.name.trim()) {
                    toast({ title: "Error", description: "Category name is required", variant: "destructive" });
                    return;
                  }
                  createCategoryMutation.mutate(categoryForm);
                }}
                disabled={createCategoryMutation.isPending}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {createCategoryMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Check className="w-4 h-4 mr-2" />
                )}
                Create Category
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Categories Management */}
      {categories && categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              Categories ({categories.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category: any) => (
                <div key={category.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {products?.filter((p: any) => p.categoryId === category.id).length || 0} products
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
                          deleteCategoryMutation.mutate(category.id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}