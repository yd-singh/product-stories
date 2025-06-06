
import { NewsItem } from "@/hooks/useNews";
import { Badge } from "@/components/ui/badge";
import NewsPlayButton from "./news/NewsPlayButton";
import NewsActionButtons from "./news/NewsActionButtons";

interface NewsActionsProps {
  article: NewsItem;
  compact?: boolean;
}

const NewsActions = ({ article, compact = false }: NewsActionsProps) => {
  if (compact) {
    return (
      <div className="flex gap-3">
        <NewsPlayButton article={article} size="sm" />
        <NewsActionButtons articleId={article.id} compact />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <NewsPlayButton article={article} />
        <Badge className="bg-cred-gray-800/50 text-cred-gray-400 border-cred-gray-700 font-normal">
          AI Generated
        </Badge>
      </div>
      
      <NewsActionButtons articleId={article.id} />
    </div>
  );
};

export default NewsActions;
