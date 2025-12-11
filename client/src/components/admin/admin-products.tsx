import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPrice } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";

export default function AdminProducts() {
  const qc = useQueryClient();
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

  // Local state for forms
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [prodName, setProdName] = useState("");
  const [prodDescription, setProdDescription] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodUnit, setProdUnit] = useState("");
  const [prodCategoryId, setProdCategoryId] = useState<string | undefined>(undefined);
  const [isFeatured, setIsFeatured] = useState(false);
  const [inStock, setInStock] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [editImageUrl, setEditImageUrl] = useState<string | null>(null);

  // Helpers
  function resetProductForm() {
    setProdName("");
    setProdDescription("");
    setProdPrice("");
    setProdUnit("");
    setProdCategoryId(undefined);
    setIsFeatured(false);
    setInStock(true);
    setImageFile(null);
    setImageUrl(null);
  }

  // Mutations
  const createCategory = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: catName, description: catDescription }),
      });
      if (!res.ok) throw new Error("Failed to create category");
      return res.json();
    },
    onSuccess: () => {
      setCatName("");
      setCatDescription("");
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const uploadImage = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Image upload failed");
      return res.json() as Promise<{ url: string; filename: string; publicId: string }>;
    },
    onSuccess: (data) => {
      setImageUrl(data.url);
    },
  });

  const createProduct = useMutation({
    mutationFn: async () => {
      const payload: any = {
        name: prodName,
        description: prodDescription,
        price: Number(prodPrice || 0),
        unit: prodUnit,
        categoryId: prodCategoryId || null,
        featured: isFeatured,
        inStock: inStock,
        imageUrl: imageUrl,
      };
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create product");
      return res.json();
    },
    onSuccess: () => {
      resetProductForm();
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const updateProduct = useMutation({
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
      setEditingProductId(null);
      setEditImageUrl(null);
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });

  const uploadEditImage = useMutation({
    mutationFn: async ({ file, productId }: { file: File; productId: string }) => {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) throw new Error("Image upload failed");
      const data = await res.json() as { url: string; filename: string };
      // Auto-update product with new image
      await updateProduct.mutateAsync({ id: productId, data: { imageUrl: data.url } });
      return data;
    },
  });

  if (loadingProducts) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4 rounded-lg shadow-lg border-2 border-blue-300">
        <h2 className="text-3xl font-bold text-white drop-shadow-lg">Products Management</h2>
        <p className="text-blue-50 text-sm mt-1">Manage categories, products, and images</p>
      </div>

      {/* Category management */}
      <Card className="border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4">
          <CardTitle className="text-white text-xl font-semibold drop-shadow-md">Create Category</CardTitle>
        </div>
        <CardContent className="space-y-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="cat-name" className="font-semibold text-gray-700">Name</Label>
              <Input id="cat-name" value={catName} onChange={(e) => setCatName(e.target.value)} placeholder="e.g., Beverages" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="cat-desc" className="font-semibold text-gray-700">Description</Label>
              <Input id="cat-desc" value={catDescription} onChange={(e) => setCatDescription(e.target.value)} placeholder="Short description" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
          </div>
          <Button onClick={() => createCategory.mutate()} disabled={!catName}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all border-2 border-blue-300 font-semibold">
            Add Category
          </Button>

          <div className="mt-6 p-4 bg-white/50 rounded-lg border border-blue-100">
            <h3 className="font-semibold mb-3 text-blue-900">Existing Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories?.map((c: any) => (
                <span key={c.id} className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-2 rounded-full text-sm font-medium text-blue-900 shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                  {c.name}
                  <button aria-label={`delete-${c.id}`} onClick={() => deleteCategory.mutate(c.id)} className="text-red-500 hover:text-red-700 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Product creation */}
      <Card className="border-2 border-blue-200 shadow-xl hover:shadow-2xl transition-shadow rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-6 py-4">
          <CardTitle className="text-white text-xl font-semibold drop-shadow-md">Create Product</CardTitle>
        </div>
        <CardContent className="space-y-4 bg-gradient-to-br from-blue-50/80 to-indigo-50/60 backdrop-blur-sm pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prod-name" className="font-semibold text-gray-700">Name</Label>
              <Input id="prod-name" value={prodName} onChange={(e) => setProdName(e.target.value)} placeholder="e.g., Coca-Cola 50cl" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="prod-price" className="font-semibold text-gray-700">Price (₦)</Label>
              <Input id="prod-price" type="number" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} placeholder="0" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="prod-desc" className="font-semibold text-gray-700">Description</Label>
              <Textarea id="prod-desc" value={prodDescription} onChange={(e) => setProdDescription(e.target.value)} placeholder="Short description" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <Label htmlFor="prod-unit" className="font-semibold text-gray-700">Unit</Label>
              <Input id="prod-unit" value={prodUnit} onChange={(e) => setProdUnit(e.target.value)} placeholder="e.g., per pack" className="border-blue-200 focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <Label className="font-semibold text-gray-700">Category</Label>
              <Select value={prodCategoryId} onValueChange={setProdCategoryId as any}>
                <SelectTrigger className="border-blue-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="font-semibold text-gray-700">Product Image</Label>
              <div className="flex items-center gap-3 p-3 border-2 border-dashed border-blue-300 rounded-lg bg-white/50 hover:bg-blue-50/50 transition-colors">
                <Input type="file" accept="image/*" onChange={(e) => {
                  const f = e.target.files?.[0] || null;
                  setImageFile(f);
                  if (f) uploadImage.mutate(f);
                }} className="border-0 bg-transparent" />
                {imageUrl && (
                  <img src={imageUrl} alt="preview" className="h-20 w-20 object-cover rounded-lg border-2 border-blue-300 shadow-md" />
                )}
              </div>
            </div>
          </div>
          <Button onClick={() => createProduct.mutate()} disabled={!prodName || !prodPrice || !prodUnit}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all border-2 border-blue-300 font-semibold">
            Add Product
          </Button>
        </CardContent>
      </Card>

      {/* Product list */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-200 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-blue-900 drop-shadow-sm">Products</h3>
          <span className="text-sm text-blue-700 font-medium bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
            {products?.length || 0} items
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products?.map((product: any) => (
            <Card key={product.id} className="border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-1 duration-300 rounded-xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 px-4 py-3">
                <CardTitle className="text-white text-lg flex items-center justify-between drop-shadow-md">
                  <span className="truncate font-semibold">{product.name}</span>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct.mutate(product.id)} 
                    className="bg-red-600 hover:bg-red-700 text-white border-0 shadow-md">
                    Delete
                  </Button>
                </CardTitle>
              </div>
              <CardContent className="bg-gradient-to-br from-white to-blue-50/30 p-4">
                <div className="relative group mb-3">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="h-40 w-full object-cover rounded-lg border-2 border-blue-200 shadow-md" />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <label htmlFor={`file-${product.id}`} className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg font-medium">
                      Change Image
                    </label>
                    <input
                      id={`file-${product.id}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadEditImage.mutate({ file: f, productId: product.id });
                      }}
                    />
                  </div>
                </div>
                {editingProductId === product.id ? (
                  <div className="space-y-2">
                    <Input
                      defaultValue={product.name}
                      placeholder="Product name"
                      onBlur={(e) => {
                        if (e.target.value !== product.name) {
                          updateProduct.mutate({ id: product.id, data: { name: e.target.value } });
                        }
                      }}
                      className="border-blue-300 focus:border-blue-500"
                    />
                    <Textarea
                      defaultValue={product.description}
                      placeholder="Description"
                      onBlur={(e) => {
                        if (e.target.value !== product.description) {
                          updateProduct.mutate({ id: product.id, data: { description: e.target.value } });
                        }
                      }}
                      className="border-blue-300 focus:border-blue-500"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        defaultValue={product.price}
                        placeholder="Price"
                        onBlur={(e) => {
                          const newPrice = Number(e.target.value);
                          if (newPrice !== product.price) {
                            updateProduct.mutate({ id: product.id, data: { price: newPrice } });
                          }
                        }}
                        className="border-blue-300 focus:border-blue-500"
                      />
                      <Input
                        defaultValue={product.unit}
                        placeholder="Unit"
                        onBlur={(e) => {
                          if (e.target.value !== product.unit) {
                            updateProduct.mutate({ id: product.id, data: { unit: e.target.value } });
                          }
                        }}
                        className="border-blue-300 focus:border-blue-500"
                      />
                    </div>
                    <Button size="sm" onClick={() => setEditingProductId(null)} className="w-full bg-green-600 hover:bg-green-700">
                      Done Editing
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">{product.description}</p>
                    <div className="flex items-baseline justify-between mb-2">
                      <p className="text-xl font-bold text-blue-900">{formatPrice(product.price)}</p>
                      <p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">{product.unit}</p>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => setEditingProductId(product.id)} className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                      Edit Product
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
