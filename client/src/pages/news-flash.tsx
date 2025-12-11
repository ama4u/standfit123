import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function NewsFlash() {
  const { data: items, isLoading } = useQuery({
    queryKey: ["newsflash"],
    queryFn: async () => {
      const res = await fetch("/api/newsflash");
      if (!res.ok) throw new Error("Failed to fetch news flash");
      return res.json();
    },
  });

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
                <Card key={it.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] bg-white/80 backdrop-blur-sm border border-purple-200">
                  <div className="relative">
                    {it.mediaType === 'video' ? (
                      <video 
                        src={it.url} 
                        controls 
                        className="w-full h-60 object-cover"
                        poster={it.url.replace('.mp4', '-poster.jpg')}
                      />
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
                          : 'bg-blue-500 text-white'
                      }`}>
                        {it.mediaType === 'video' ? '📹 Video' : '📸 Image'}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    {it.title && (
                      <h3 className="font-semibold text-lg text-gray-800 mb-2">{it.title}</h3>
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
    </div>
  );
}
