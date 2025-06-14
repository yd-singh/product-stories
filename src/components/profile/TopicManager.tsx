
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Rss } from "lucide-react";
import { useUserTopics } from "@/hooks/useUserProfile";
import TopicForm from "./TopicForm";
import TopicCard from "./TopicCard";
import EmptyTopicsState from "./EmptyTopicsState";

const TopicManager = () => {
  const { data: topics = [], isLoading } = useUserTopics();
  const [showForm, setShowForm] = useState(false);

  if (isLoading) {
    return (
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-cred-gray-800 rounded w-1/4"></div>
            <div className="h-4 bg-cred-gray-800 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-cred-gray-100 flex items-center gap-3">
                <Rss className="w-5 h-5 text-cred-purple" />
                My Topics
              </CardTitle>
              <CardDescription className="text-cred-gray-400">
                Manage your personalized news topics and RSS feeds
              </CardDescription>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-cred-teal hover:bg-cred-teal/90 text-black font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Topic
            </Button>
          </div>
        </CardHeader>
        
        {showForm && (
          <CardContent className="border-t border-cred-gray-800">
            <TopicForm onClose={() => setShowForm(false)} />
          </CardContent>
        )}
      </Card>

      {/* Topics List */}
      <div className="grid gap-4">
        {topics.map((topic) => (
          <TopicCard key={topic.id} topic={topic} />
        ))}
        
        {topics.length === 0 && (
          <EmptyTopicsState onAddTopic={() => setShowForm(true)} />
        )}
      </div>
    </div>
  );
};

export default TopicManager;
