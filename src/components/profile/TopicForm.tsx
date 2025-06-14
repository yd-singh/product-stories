
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useCreateTopic } from "@/hooks/useUserProfile";
import { useRSSFeeds } from "@/hooks/useRSSFeeds";
import RSSFeedSelector from "./RSSFeedSelector";

interface TopicFormProps {
  onClose: () => void;
}

const TopicForm = ({ onClose }: TopicFormProps) => {
  const { data: availableRSSFeeds = [], isLoading: rssLoading, error: rssError } = useRSSFeeds();
  const createTopic = useCreateTopic();
  const { toast } = useToast();
  
  const [selectedRSSFeed, setSelectedRSSFeed] = useState<string>('');
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

  const handleRSSSelection = (feedId: string) => {
    console.log('Selected feed ID:', feedId);
    const selectedFeed = availableRSSFeeds.find(feed => feed.id === feedId);
    console.log('Found feed:', selectedFeed);
    
    if (selectedFeed) {
      setSelectedRSSFeed(feedId);
      setFormData({
        ...formData,
        topic_name: selectedFeed.title,
        rss_url: selectedFeed.rss_url,
      });
    }
  };

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
    setSelectedRSSFeed('');
    onClose();
  };

  const handleCancel = () => {
    setSelectedRSSFeed('');
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
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pt-6">
      <RSSFeedSelector
        availableRSSFeeds={availableRSSFeeds}
        selectedRSSFeed={selectedRSSFeed}
        onRSSSelection={handleRSSSelection}
        isLoading={rssLoading}
        error={rssError}
      />

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
            RSS URL
          </Label>
          <Input
            id="rss_url"
            value={formData.rss_url}
            onChange={(e) => setFormData({ ...formData, rss_url: e.target.value })}
            placeholder="Automatically filled when selecting from database"
            className="bg-cred-surface border-cred-gray-700 text-cred-gray-100"
            readOnly={!!selectedRSSFeed}
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
          onClick={handleCancel}
          className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TopicForm;
