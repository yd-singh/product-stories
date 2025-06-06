
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, User, Sparkles } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";

interface NewsCardProps {
  article: NewsItem;
  featured?: boolean;
}

const NewsCard = ({ article, featured = false }: NewsCardProps) => {
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
    };
    return colors[topic as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  if (featured) {
    return (
      <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300">
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
                {article.aiSummary}
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
              </div>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
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
    <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer h-full">
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
          {article.aiSummary}
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
