
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Database } from "lucide-react";
import { RSSFeed } from "@/hooks/useRSSFeeds";

interface RSSFeedSelectorProps {
  availableRSSFeeds: RSSFeed[];
  selectedRSSFeed: string;
  onRSSSelection: (feedId: string) => void;
  isLoading: boolean;
  error: Error | null;
}

const RSSFeedSelector = ({ 
  availableRSSFeeds, 
  selectedRSSFeed, 
  onRSSSelection, 
  isLoading, 
  error 
}: RSSFeedSelectorProps) => {
  console.log('RSSFeedSelector - availableRSSFeeds:', availableRSSFeeds);
  console.log('RSSFeedSelector - isLoading:', isLoading);
  console.log('RSSFeedSelector - error:', error);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Database className="w-4 h-4 text-cred-teal" />
        <Label className="text-cred-gray-200 font-medium">
          Choose from Available RSS Feeds ({availableRSSFeeds.length} available)
        </Label>
      </div>
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
          <p className="text-red-400 text-sm">Error loading RSS feeds: {error.message}</p>
        </div>
      )}
      
      <Select value={selectedRSSFeed} onValueChange={onRSSSelection}>
        <SelectTrigger className="bg-cred-surface border-cred-gray-700 text-cred-gray-100">
          <SelectValue placeholder={
            isLoading 
              ? "Loading feeds..." 
              : availableRSSFeeds.length > 0 
                ? "Select an RSS feed from database" 
                : "No RSS feeds available"
          } />
        </SelectTrigger>
        <SelectContent className="bg-cred-surface border-cred-gray-700 max-h-96 z-50">
          {availableRSSFeeds.length > 0 ? (
            availableRSSFeeds.map((feed) => (
              <SelectItem 
                key={feed.id} 
                value={feed.id}
                className="text-cred-gray-100 hover:bg-cred-gray-800 focus:bg-cred-gray-800"
              >
                <div className="flex flex-col py-1">
                  <span className="font-medium text-sm">{feed.title}</span>
                  <span className="text-xs text-cred-gray-400">{feed.source} • {feed.category}</span>
                </div>
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-feeds" disabled className="text-cred-gray-500">
              No RSS feeds found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default RSSFeedSelector;
