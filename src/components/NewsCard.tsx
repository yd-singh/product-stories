import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, User, Sparkles, Globe } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import NewsActions from "./NewsActions";

interface NewsCardProps {
  article: NewsItem;
  featured?: boolean;
  isPlaying?: boolean;
}

const NewsCard = ({ article, featured = false, isPlaying = false }: NewsCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getCategoryColor = (topic: string) => {
    const colors = {
      Technology: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Business: "bg-green-500/20 text-green-400 border-green-500/30",
      Politics: "bg-red-500/20 text-red-400 border-red-500/30",
      Sports: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      Science: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      RBI: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      CRED: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "PPI Wallet": "bg-indigo-500/20 text-indigo-400 border-indigo-500/30",
    };
    return colors[topic as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const getPreviewContent = () => {
    if (article.aiSummary) {
      return article.aiSummary;
    }
    return `Read the latest news from ${article.source} about ${article.topic.toLowerCase()}.`;
  };

  if (featured) {
    return (
      <Card className={`bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300 ${isPlaying ? 'ring-2 ring-purple-500/50 bg-purple-500/10' : ''}`}>
        <div className="md:flex">
          <div className="md:w-1/3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <Badge className={getCategoryColor(article.topic)}>
                {article.topic}
              </Badge>
            </div>
          </div>
          <div className="md:w-2/3">
            <CardHeader>
              <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors">
                {article.headline}
              </CardTitle>
              <CardDescription className="text-white/60">
                {getPreviewContent()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.date)}
                </div>
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {article.source}
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  {getDomainFromUrl(article.newsUrl)}
                </div>
              </div>
              
              {/* News Actions */}
              <div className="mb-4">
                <NewsActions article={article} />
              </div>
              
              <Button 
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
                onClick={() => window.open(article.newsUrl, '_blank')}
              >
                Read Full Article
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer h-full ${isPlaying ? 'ring-2 ring-purple-500/50 bg-purple-500/10' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge className={getCategoryColor(article.topic)}>
            {article.topic}
          </Badge>
          <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
        </div>
        <CardTitle className="text-white group-hover:text-blue-400 transition-colors text-lg">
          {article.headline}
        </CardTitle>
        <CardDescription className="text-white/60 line-clamp-3">
          {getPreviewContent()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm text-white/60 mb-4">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(article.date)}
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            {article.source}
          </div>
        </div>
        
        {/* Link Preview Section */}
        <div className="bg-white/5 rounded-lg p-3 mb-4 border border-white/10">
          <div className="flex items-center gap-2 text-xs text-white/50 mb-1">
            <Globe className="w-3 h-3" />
            {getDomainFromUrl(article.newsUrl)}
          </div>
          <p className="text-white/70 text-sm line-clamp-2">
            {getPreviewContent()}
          </p>
        </div>
        
        {/* Compact News Actions */}
        <div className="mb-4">
          <NewsActions article={article} compact={true} />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-white/20 text-white hover:bg-white/10"
          onClick={() => window.open(article.newsUrl, '_blank')}
        >
          Read Article
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
