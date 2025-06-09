
import { useState, useMemo } from "react";
import { useNews } from "@/hooks/useNews";
import { isSameDay } from "date-fns";
import NewsHeader from "@/components/news/NewsHeader";
import NewsHero from "@/components/news/NewsHero";
import NewsContent from "@/components/news/NewsContent";
import NewsLoadingState from "@/components/news/NewsLoadingState";
import NewsErrorState from "@/components/news/NewsErrorState";

const News = () => {
  const { data: articles = [], isLoading, error } = useNews();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [playingArticleId, setPlayingArticleId] = useState<string | null>(null);

  const availableTags = useMemo(() => {
    const tags = articles.map(article => article.topic).filter(Boolean);
    return Array.from(new Set(tags)).sort();
  }, [articles]);

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

  const handleClearFilters = () => {
    setSelectedTags([]);
    setSelectedDate(undefined);
  };

  if (isLoading) {
    return <NewsLoadingState />;
  }

  if (error) {
    return <NewsErrorState error={error} />;
  }

  return (
    <div className="min-h-screen bg-cred-black">
      <NewsHeader />
      <NewsHero />
      <NewsContent
        articles={articles}
        availableTags={availableTags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onClearFilters={handleClearFilters}
        filteredArticles={filteredArticles}
        playingArticleId={playingArticleId}
      />
    </div>
  );
};

export default News;
