import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Share2 } from "lucide-react";

export default function NewsFlash() {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["newsflash"],
    queryFn: async () => {
      const res = await fetch("/api/newsflash", {
        credentials: 'include'
      });
      if (!res.ok) throw new Error("Failed to fetch news flash");
      return res.json();
    },
  });

  const handleItemClick = (item: any) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleShare = async (item: any) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title || 'Standfit News Flash',
          text: item.content || 'Check out this update from Standfit Premium',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `${item.title || 'Standfit News Flash'}\n${item.content || ''}\n${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-pink-600 to-indigo-600">News Flash</h1>
          <p className="text-muted-foreground mt-2">Latest images and short videos from Standfit — updates, promos and events.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="h-80 animate-pulse bg-gradient-to-br from-purple-100 to-pink-100" />
            ))
          ) : (
            items?.length ? (
              items.map((it: any) => (
                <Card 
                  key={it.id} 
                  className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-purple-200 cursor-pointer"
                  onClick={() => handleItemClick(it)}
                >
                  <div className="relative">
                    {it.mediaType === 'text' ? (
                      <div className="w-full h-60 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 flex items-center justify-center p-6">
                        <div className="text-center text-white">
                          <div className="text-4xl mb-4">💬</div>
                          <p className="text-lg font-medium line-clamp-4">
                            {it.content || 'News Update'}
                          </p>
                        </div>
                      </div>
                    ) : it.mediaType === 'video' ? (
                      <div className="relative w-full h-60 bg-black flex items-center justify-center group">
                        <video 
                          src={it.url} 
                          className="w-full h-full object-cover"
                          preload="metadata"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <div className="w-0 h-0 border-l-[16px] border-l-red-500 border-t-[12px] border-t-transparent border-b-[12px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={it.url} 
                        alt={it.title || 'News Flash Item'} 
                        className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300" 
                      />
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        it.mediaType === 'video' 
                          ? 'bg-red-500 text-white' 
                          : it.mediaType === 'text'
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {it.mediaType === 'video' ? '📹 Video' : it.mediaType === 'text' ? '💬 Text' : '📸 Image'}
                      </span>
                    </div>
                    <div className="absolute top-2 left-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(it);
                        }}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {it.title && (
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{it.title}</h3>
                    )}
                    {it.mediaType === 'text' && it.content && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {it.content}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center">
                      <span className="mr-1">📅</span>
                      {new Date(it.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-3 text-center py-16">
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-8 border border-purple-200">
                  <div className="text-6xl mb-4">📰</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No News Flash Items Yet</h3>
                  <p className="text-muted-foreground mb-4">Check back later for the latest updates, promos, and events from Standfit Premium.</p>
                  <Link href="/admin">
                    <a className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-medium">
                      Admins: Manage News Flash
                    </a>
                  </Link>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Full-screen dialog for viewing items */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedItem?.title || 'News Flash Item'}</span>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => selectedItem && handleShare(selectedItem)}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              {selectedItem.mediaType === 'text' ? (
                <div className="bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-600 rounded-lg p-8 text-center text-white">
                  <div className="text-6xl mb-6">💬</div>
                  <p className="text-xl leading-relaxed">
                    {selectedItem.content}
                  </p>
                </div>
              ) : selectedItem.mediaType === 'video' ? (
                <div className="relative">
                  <video 
                    src={selectedItem.url} 
                    controls 
                    className="w-full max-h-[60vh] object-contain rounded-lg bg-black"
                    autoPlay
                    preload="metadata"
                  />
                </div>
              ) : (
                <img 
                  src={selectedItem.url} 
                  alt={selectedItem.title || 'News Flash Item'} 
                  className="w-full max-h-[60vh] object-contain rounded-lg" 
                />
              )}
              
              <div className="text-center text-muted-foreground">
                <p className="flex items-center justify-center">
                  <span className="mr-2">📅</span>
                  {new Date(selectedItem.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
