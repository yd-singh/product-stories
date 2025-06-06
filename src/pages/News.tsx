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
import { isSameDay } from "date-fns";

const News = () => {
  const { data: articles = [], isLoading, error } = useNews();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [playingArticleId, setPlayingArticleId] = useState<string | null>(null);

  // Get unique tags from articles
  const availableTags = useMemo(() => {
    const tags = articles.map(article => article.topic).filter(Boolean);
    return Array.from(new Set(tags)).sort();
  }, [articles]);

  // Filter articles based on selected tags and date
  const filteredArticles = useMemo(() => {
    let filtered = articles;
    
    if (selectedTags.length > 0) {
      filtered = filtered.filter(article => selectedTags.includes(article.topic));
    }
    
    if (selectedDate) {
      filtered = filtered.filter(article => {
        try {
          const articleDate = new Date(article.date);
          return isSameDay(articleDate, selectedDate);
        } catch {
          return false;
        }
      });
    }
    
    return filtered;
  }, [articles, selectedTags, selectedDate]);

  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedDate(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cred-black flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-2 border-cred-teal border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-cred-gray-300 font-medium">Loading news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cred-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-red-400 text-lg font-medium">Error loading news</p>
          <p className="text-cred-gray-400 text-sm">{error.message}</p>
          <Button asChild variant="outline" className="border-cred-gray-700 text-cred-gray-100 hover:bg-cred-surface">
            <Link to="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cred-black">
      {/* Header */}
      <div className="border-b border-cred-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button asChild variant="ghost" className="text-cred-gray-300 hover:text-cred-gray-100 hover:bg-cred-surface -ml-3">
            <Link to="/" className="flex items-center gap-3">
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium">Back</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-cred-gray-100 mb-6 leading-tight">
            News &{' '}
            <span className="text-cred-teal">Intelligence</span>
          </h1>
          <p className="text-xl text-cred-gray-300 leading-relaxed">
            AI-curated news with intelligent summaries and insights. 
            Stay informed with precision.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {articles.length === 0 ? (
          <Card className="cred-surface border-cred-gray-800">
            <CardContent className="p-12 text-center">
              <p className="text-cred-gray-400 text-lg">No news articles available</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {/* News Filter */}
            <NewsFilter
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onClearFilters={handleClearFilters}
            />

            {/* News Broadcast Player */}
            {filteredArticles.length > 0 && (
              <NewsBroadcast articles={filteredArticles} />
            )}

            {/* Results Summary */}
            {(selectedTags.length > 0 || selectedDate) && (
              <div className="flex items-center justify-between py-4">
                <span className="text-cred-gray-400 font-medium">
                  {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
                </span>
                {(selectedTags.length > 0 || selectedDate) && (
                  <Button 
                    variant="ghost" 
                    onClick={handleClearFilters}
                    className="text-cred-gray-400 hover:text-cred-gray-200 hover:bg-cred-surface"
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}

            {/* Featured Article */}
            {featuredArticle && (
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-cred-gray-100">Featured</h2>
                  <Badge className="bg-cred-teal/10 text-cred-teal border-cred-teal/20 font-medium">
                    Latest
                  </Badge>
                </div>
                <NewsCard 
                  article={featuredArticle} 
                  featured={true}
                  isPlaying={playingArticleId === featuredArticle.id}
                />
              </div>
            )}

            {/* Recent Articles */}
            {regularArticles.length > 0 && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-cred-gray-100">Recent Articles</h2>
                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
            {filteredArticles.length === 0 && (selectedTags.length > 0 || selectedDate) && (
              <Card className="cred-surface border-cred-gray-800">
                <CardContent className="p-12 text-center space-y-6">
                  <p className="text-cred-gray-400 text-lg">
                    No articles match your filters
                  </p>
                  <Button 
                    onClick={handleClearFilters}
                    className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-medium"
                  >
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
