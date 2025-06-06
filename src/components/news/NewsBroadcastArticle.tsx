
import { Badge } from "@/components/ui/badge";
import { NewsItem } from "@/hooks/useNews";

interface NewsBroadcastArticleProps {
  article: NewsItem;
  index: number;
  total: number;
}

const NewsBroadcastArticle = ({ article, index, total }: NewsBroadcastArticleProps) => {
  return (
    <div className="cred-surface border border-cred-gray-800 rounded-xl p-6">
      <div className="flex items-start justify-between mb-4">
        <Badge className="bg-cred-teal/10 text-cred-teal border border-cred-teal/20 font-medium">
          {article?.topic}
        </Badge>
        <span className="text-cred-gray-400 text-sm font-medium">
          {index + 1} of {total}
        </span>
      </div>
      <h3 className="text-cred-gray-100 font-bold mb-3 text-xl leading-tight">
        {article?.headline}
      </h3>
      <p className="text-cred-gray-300 leading-relaxed">
        {article?.aiSummary}
      </p>
    </div>
  );
};

export default NewsBroadcastArticle;
