
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, User, Sparkles, Globe, ArrowUpRight } from "lucide-react";
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
      Technology: "bg-cred-teal/10 text-cred-teal border-cred-teal/20",
      Business: "bg-green-500/10 text-green-400 border-green-500/20",
      Politics: "bg-red-500/10 text-red-400 border-red-500/20",
      Sports: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      Science: "bg-cred-purple/10 text-cred-purple border-cred-purple/20",
      RBI: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      CRED: "bg-cred-gold/10 text-cred-gold border-cred-gold/20",
      "PPI Wallet": "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    };
    return colors[topic as keyof typeof colors] || "bg-cred-gray-700/20 text-cred-gray-400 border-cred-gray-700/20";
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
      <Card className={`cred-surface-elevated border-cred-gray-700 overflow-hidden group hover:border-cred-gray-600 transition-all duration-300 ${isPlaying ? 'ring-1 ring-cred-teal border-cred-teal' : ''}`}>
        <div className="lg:flex">
          <div className="lg:w-1/3 bg-gradient-to-br from-cred-teal/5 to-cred-purple/5 border-r border-cred-gray-800 p-8 flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-cred-teal/10 border border-cred-teal/20 rounded-xl mx-auto flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cred-teal" />
              </div>
              <Badge className={getCategoryColor(article.topic)}>
                {article.topic}
              </Badge>
            </div>
          </div>
          <div className="lg:w-2/3">
            <CardHeader className="pb-4">
              <CardTitle className="text-cred-gray-100 text-2xl group-hover:text-cred-teal transition-colors leading-tight">
                {article.headline}
              </CardTitle>
              <CardDescription className="text-cred-gray-300 text-base leading-relaxed">
                {getPreviewContent()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6 text-sm text-cred-gray-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.date)}
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.source}
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  {getDomainFromUrl(article.newsUrl)}
                </div>
              </div>
              
              <NewsActions article={article} />
              
              <Button 
                variant="outline"
                className="border-cred-gray-700 text-cred-gray-100 hover:bg-cred-surface hover:border-cred-gray-600 group"
                onClick={() => window.open(article.newsUrl, '_blank')}
              >
                Read Full Article
                <ArrowUpRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Button>
            </CardContent>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`cred-surface-elevated border-cred-gray-700 hover:border-cred-gray-600 transition-all duration-300 group cursor-pointer h-full ${isPlaying ? 'ring-1 ring-cred-teal border-cred-teal' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-3">
          <Badge className={getCategoryColor(article.topic)}>
            {article.topic}
          </Badge>
          <ArrowUpRight className="w-4 h-4 text-cred-gray-500 group-hover:text-cred-gray-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <CardTitle className="text-cred-gray-100 group-hover:text-cred-teal transition-colors text-lg leading-tight">
          {article.headline}
        </CardTitle>
        <CardDescription className="text-cred-gray-400 line-clamp-3 leading-relaxed">
          {getPreviewContent()}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between text-sm text-cred-gray-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {formatDate(article.date)}
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {article.source}
          </div>
        </div>
        
        {/* Link Preview Section */}
        <div className="cred-surface border border-cred-gray-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-cred-gray-500 font-medium">
            <Globe className="w-3 h-3" />
            {getDomainFromUrl(article.newsUrl)}
          </div>
          <p className="text-cred-gray-400 text-sm line-clamp-2 leading-relaxed">
            {getPreviewContent()}
          </p>
        </div>
        
        <NewsActions article={article} compact={true} />
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full border-cred-gray-700 text-cred-gray-100 hover:bg-cred-surface hover:border-cred-gray-600"
          onClick={() => window.open(article.newsUrl, '_blank')}
        >
          Read Article
        </Button>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
