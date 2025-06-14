
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink } from "lucide-react";
import { UserTopic } from "@/hooks/useUserProfile";

interface TopicCardProps {
  topic: UserTopic;
}

const TopicCard = ({ topic }: TopicCardProps) => {
  const getFeatureCount = (topic: UserTopic) => {
    return [
      topic.auto_research,
      topic.auto_history,
      topic.auto_debate,
      topic.auto_fact_check,
      topic.auto_late_night,
      topic.auto_podcast,
    ].filter(Boolean).length;
  };

  return (
    <Card className="cred-surface-elevated border-cred-gray-700">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-semibold text-cred-gray-100">
                {topic.topic_name}
              </h3>
              <Badge className="bg-cred-purple/10 text-cred-purple border-cred-purple/20">
                {getFeatureCount(topic)} features enabled
              </Badge>
            </div>
            
            {topic.rss_url && (
              <div className="flex items-center gap-2 text-sm text-cred-gray-400">
                <ExternalLink className="w-4 h-4" />
                <span>RSS Feed Connected</span>
              </div>
            )}
            
            <div className="flex flex-wrap gap-2 mt-3">
              {topic.auto_research && <Badge variant="outline" className="text-xs">Research</Badge>}
              {topic.auto_history && <Badge variant="outline" className="text-xs">History</Badge>}
              {topic.auto_debate && <Badge variant="outline" className="text-xs">Debate</Badge>}
              {topic.auto_fact_check && <Badge variant="outline" className="text-xs">Fact Check</Badge>}
              {topic.auto_late_night && <Badge variant="outline" className="text-xs">Late Night</Badge>}
              {topic.auto_podcast && <Badge variant="outline" className="text-xs">Podcast</Badge>}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-cred-gray-500 hover:text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TopicCard;
