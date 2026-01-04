import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Upload, Trash } from "lucide-react";

export default function AdminNewsFlash() {
  const qc = useQueryClient();
  const { data: items, isLoading } = useQuery({
    queryKey: ["newsflash-items"],
    queryFn: async () => {
      const res = await fetch("/api/newsflash");
      if (!res.ok) throw new Error("Failed to fetch newsflash items");
      return res.json();
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload-media", { 
        method: "POST", 
        body: fd,
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Upload failed");
      return res.json() as Promise<{ url: string; publicId: string; resourceType: string }>;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/admin/newsflash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to create news item");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsflash-items"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/newsflash/${id}`, { 
        method: "DELETE",
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["newsflash-items"] }),
  });

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 px-6 py-4 rounded-lg shadow-lg border-2 border-purple-300">
        <h2 className="text-2xl font-bold text-white">📰 News Flash Management</h2>
        <p className="text-purple-50 text-sm mt-1">Upload images or videos to Cloudinary for the News Flash page. Supported formats: JPG, PNG, GIF, WebP, MP4</p>
        <div className="mt-2 text-purple-100 text-xs">
          • Images: Max 10MB • Videos: Max 100MB • Auto-optimized by Cloudinary • Global CDN delivery
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Create News Flash Item</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="font-semibold">Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Short title or caption" />
          </div>

          <div>
            <Label className="font-semibold">Media (Image or MP4 Video)</Label>
            <div className="p-4 border-2 border-dashed border-purple-300 rounded-lg bg-purple-50/50">
              <div className="flex flex-col gap-4">
                <Input 
                  type="file" 
                  accept="image/*,video/mp4" 
                  onChange={(e) => {
                    const f = e.target.files?.[0] || null;
                    setFile(f);
                    if (f) setPreview(URL.createObjectURL(f));
                  }}
                  className="border-purple-200"
                />
                
                {preview && (
                  <div className="flex justify-center">
                    <div className="relative">
                      {file?.type.startsWith('video') ? (
                        <video src={preview} className="h-32 rounded-md shadow-md" controls />
                      ) : (
                        <img src={preview} className="h-32 rounded-md object-cover shadow-md" />
                      )}
                      <div className="absolute -top-2 -right-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          file?.type.startsWith('video') 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {file?.type.startsWith('video') ? '📹' : '📸'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <Button 
                  disabled={!file || uploadMutation.isPending || createMutation.isPending} 
                  onClick={async () => {
                    if (!file) return;
                    try {
                      const uploaded = await uploadMutation.mutateAsync(file);
                      console.log('Upload response:', uploaded); // Debug log
                      
                      // Ensure we have the required fields
                      const mediaType = uploaded.resourceType || (file.type.startsWith('video/') ? 'video' : 'image');
                      
                      await createMutation.mutateAsync({ 
                        title: title.trim() || null, 
                        url: uploaded.url, 
                        mediaType: mediaType,
                        publicId: uploaded.publicId || null
                      });
                      setTitle(''); 
                      setFile(null); 
                      setPreview(null);
                      // Reset file input
                      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
                      if (fileInput) fileInput.value = '';
                    } catch (error) {
                      console.error('Upload failed:', error);
                      alert('Upload failed. Please try again or check your internet connection.');
                    }
                  }} 
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
                >
                  <Upload className="w-4 h-4 mr-2" /> 
                  {uploadMutation.isPending || createMutation.isPending ? 'Uploading...' : 'Upload & Publish'}
                </Button>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">Existing Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : items?.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((it: any) => (
                <div key={it.id} className="p-4 border rounded-lg bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-md transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-32 h-24 overflow-hidden rounded-md bg-gray-100 relative">
                      {it.mediaType === 'video' ? (
                        <video src={it.url} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={it.url} className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-1 right-1">
                        <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                          it.mediaType === 'video' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-500 text-white'
                        }`}>
                          {it.mediaType === 'video' ? '📹' : '📸'}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 truncate">
                        {it.title || 'Untitled'}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {new Date(it.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Type: {it.mediaType}
                      </p>
                    </div>
                    <div>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this item?')) {
                            deleteMutation.mutate(it.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash className="w-4 h-4 mr-1" /> 
                        {deleteMutation.isPending ? '...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No News Flash Items</h3>
              <p className="text-muted-foreground">Upload your first image or video to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
