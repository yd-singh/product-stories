
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NewsItem } from "@/hooks/useNews";
import NewsCard from "@/components/NewsCard";
import NewsFilter from "@/components/NewsFilter";
import NewsBroadcast from "@/components/NewsBroadcast";
import NewsEmptyState from "./NewsEmptyState";

interface NewsContentProps {
  articles: NewsItem[];
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
  filteredArticles: NewsItem[];
  playingArticleId: string | null;
}

const NewsContent = ({
  articles,
  availableTags,
  selectedTags,
  onTagsChange,
  selectedDate,
  onDateChange,
  onClearFilters,
  filteredArticles,
  playingArticleId
}: NewsContentProps) => {
  const featuredArticle = filteredArticles[0];
  const regularArticles = filteredArticles.slice(1);

  if (articles.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 pb-24">
        <NewsEmptyState type="no-articles" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 pb-24">
      <div className="space-y-12">
        <NewsFilter
          availableTags={availableTags}
          selectedTags={selectedTags}
          onTagsChange={onTagsChange}
          selectedDate={selectedDate}
          onDateChange={onDateChange}
          onClearFilters={onClearFilters}
        />

        {filteredArticles.length > 0 && (
          <NewsBroadcast articles={filteredArticles} />
        )}

        {(selectedTags.length > 0 || selectedDate) && (
          <div className="flex items-center justify-between py-4">
            <span className="text-cred-gray-400 font-medium">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} found
            </span>
            {(selectedTags.length > 0 || selectedDate) && (
              <Button 
                variant="ghost" 
                onClick={onClearFilters}
                className="text-cred-gray-400 hover:text-cred-gray-200 hover:bg-cred-surface"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}

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

        {filteredArticles.length === 0 && (selectedTags.length > 0 || selectedDate) && (
          <NewsEmptyState type="no-filtered-results" onClearFilters={onClearFilters} />
        )}
      </div>
    </div>
  );
};

export default NewsContent;
