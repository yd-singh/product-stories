
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNews } from "@/hooks/useNews";
import NewsCard from "@/components/NewsCard";
import NewsFilter from "@/components/NewsFilter";
import NewsBroadcast from "@/components/NewsBroadcast";

const News = () => {
  const { data: articles = [], isLoading, error } = useNews();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [playingArticleId, setPlayingArticleId] = useState<string | null>(null);

  // Get unique tags from articles
  const availableTags = useMemo(() => {
    const tags = articles.map(article => article.topic).filter(Boolean);
    return Array.from(new Set(tags)).sort();
  }, [articles]);

  // Filter articles based on selected tags
  const filteredArticles = useMemo(() => {
    if (selectedTags.length === 0) {
      return articles;
    }
    return articles.filter(article => selectedTags.includes(article.topic));
  }, [articles, selectedTags]);

  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400 mx-auto mb-4" />
          <p className="text-white/70">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error loading news: {error.message}</p>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            News & 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Updates</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Stay updated with the latest news from my Seatable database with AI-generated summaries.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {articles.length === 0 ? (
            <Card className="bg-white/5 backdrop-blur-sm border-white/10">
              <CardContent className="p-8 text-center">
                <p className="text-white/70">No news articles found.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* News Filter */}
              <NewsFilter
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagsChange={setSelectedTags}
                onClearFilters={() => setSelectedTags([])}
              />

              {/* News Broadcast Player */}
              {filteredArticles.length > 0 && (
                <NewsBroadcast articles={filteredArticles} />
              )}

              {/* Results Summary */}
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-4 text-white/70">
                  <span>
                    Showing {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} 
                    {selectedTags.length > 0 && ` for: ${selectedTags.join(', ')}`}
                  </span>
                </div>
              )}

              {/* Featured Article */}
              {featuredArticle && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    Featured Article
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Latest</Badge>
                  </h2>
                  <NewsCard 
                    article={featuredArticle} 
                    featured={true}
                    isPlaying={playingArticleId === featuredArticle.id}
                  />
                </div>
              )}

              {/* Recent Articles */}
              {regularArticles.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-white mb-6">Recent Articles</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularArticles.map((article) => (
                      <NewsCard 
                        key={article.id} 
                        article={article}
                        isPlaying={playingArticleId === article.id}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {filteredArticles.length === 0 && selectedTags.length > 0 && (
                <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                  <CardContent className="p-8 text-center">
                    <p className="text-white/70 mb-4">
                      No articles found for the selected topics: {selectedTags.join(', ')}
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedTags([])}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      Clear Filters
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Subscribe to get notified about new articles and project updates directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
