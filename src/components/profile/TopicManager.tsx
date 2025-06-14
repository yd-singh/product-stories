
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Rss, Trash2, ExternalLink } from "lucide-react";
import { useUserTopics, useCreateTopic, UserTopic } from "@/hooks/useUserProfile";
import { useToast } from "@/hooks/use-toast";

const TopicManager = () => {
  const { data: topics = [], isLoading } = useUserTopics();
  const createTopic = useCreateTopic();
  const { toast } = useToast();
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    topic_name: '',
    rss_url: '',
    auto_research: false,
    auto_history: false,
    auto_debate: false,
    auto_fact_check: false,
    auto_late_night: false,
    auto_podcast: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.topic_name.trim()) {
      toast({
        title: "Error",
        description: "Topic name is required.",
        variant: "destructive",
      });
      return;
    }

    createTopic.mutate({
      ...formData,
      is_active: true,
      rss_url: formData.rss_url || null,
    });

    // Reset form
    setFormData({
      topic_name: '',
      rss_url: '',
      auto_research: false,
      auto_history: false,
      auto_debate: false,
      auto_fact_check: false,
      auto_late_night: false,
      auto_podcast: false,
    });
    setShowForm(false);
  };

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
            <form onSubmit={handleSubmit} className="space-y-6 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="topic_name" className="text-cred-gray-200">
                    Topic Name *
                  </Label>
                  <Input
                    id="topic_name"
                    value={formData.topic_name}
                    onChange={(e) => setFormData({ ...formData, topic_name: e.target.value })}
                    placeholder="e.g., Technology, Finance, Sports"
                    className="bg-cred-surface border-cred-gray-700 text-cred-gray-100"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rss_url" className="text-cred-gray-200">
                    RSS URL (Optional)
                  </Label>
                  <Input
                    id="rss_url"
                    value={formData.rss_url}
                    onChange={(e) => setFormData({ ...formData, rss_url: e.target.value })}
                    placeholder="https://example.com/feed.xml"
                    className="bg-cred-surface border-cred-gray-700 text-cred-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-cred-gray-200 font-medium">Auto-Generate Features</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { key: 'auto_research', label: 'Research', icon: '🔍' },
                    { key: 'auto_history', label: 'History', icon: '📚' },
                    { key: 'auto_debate', label: 'Debate', icon: '💬' },
                    { key: 'auto_fact_check', label: 'Fact Check', icon: '✅' },
                    { key: 'auto_late_night', label: 'Late Night', icon: '🎭' },
                    { key: 'auto_podcast', label: 'Podcast', icon: '🎧' },
                  ].map((feature) => (
                    <div key={feature.key} className="flex items-center space-x-2">
                      <Switch
                        id={feature.key}
                        checked={formData[feature.key as keyof typeof formData] as boolean}
                        onCheckedChange={(checked) => 
                          setFormData({ ...formData, [feature.key]: checked })
                        }
                      />
                      <Label htmlFor={feature.key} className="text-cred-gray-300 text-sm">
                        {feature.icon} {feature.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createTopic.isPending}
                  className="bg-cred-teal hover:bg-cred-teal/90 text-black"
                >
                  {createTopic.isPending ? 'Creating...' : 'Create Topic'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        )}
      </Card>

      {/* Topics List */}
      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card key={topic.id} className="cred-surface-elevated border-cred-gray-700">
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
        ))}
        
        {topics.length === 0 && (
          <Card className="cred-surface-elevated border-cred-gray-700">
            <CardContent className="p-8 text-center">
              <Rss className="w-12 h-12 text-cred-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-cred-gray-300 mb-2">No Topics Yet</h3>
              <p className="text-cred-gray-500 mb-4">
                Create your first topic to start personalizing your news experience.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="bg-cred-teal hover:bg-cred-teal/90 text-black"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Topic
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TopicManager;
