
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Search, BookOpen, MessageSquare, CheckCircle, Mic } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";

interface NewsActionsProps {
  article: NewsItem;
  compact?: boolean;
}

const NewsActions = ({ article, compact = false }: NewsActionsProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast } = useToast();

  const actions = [
    { id: 'research', label: 'Research', icon: Search },
    { id: 'history', label: 'History Lesson', icon: BookOpen },
    { id: 'debate', label: 'Debate', icon: MessageSquare },
    { id: 'fact-check', label: 'Fact Check', icon: CheckCircle },
    { id: 'late-night', label: 'Late Night Show', icon: Mic },
  ];

  const handleAction = async (actionId: string, actionLabel: string) => {
    setLoadingAction(actionId);
    
    try {
      // TODO: Replace with actual n8n webhook URL
      const webhookUrl = `https://your-n8n-instance.com/webhook/${actionId}`;
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          article: {
            id: article.id,
            headline: article.headline,
            content: article.aiSummary,
            source: article.source,
            topic: article.topic,
            url: article.newsUrl,
          },
          action: actionId,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        toast({
          title: "Action Triggered",
          description: `${actionLabel} has been initiated for this article.`,
        });
      } else {
        throw new Error('Failed to trigger action');
      }
    } catch (error) {
      console.error(`Error triggering ${actionId}:`, error);
      toast({
        title: "Error",
        description: `Failed to trigger ${actionLabel}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const handlePlayAudio = async () => {
    setLoadingAction('play-audio');
    
    try {
      // TODO: Replace with actual audio generation endpoint
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `${article.headline}. ${article.aiSummary}`,
          articleId: article.id,
        }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        // Create and play audio element
        const audio = new Audio(audioUrl);
        audio.play();
        
        toast({
          title: "Playing Audio",
          description: "Audio playback started for this article.",
        });
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play audio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (compact) {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePlayAudio}
          disabled={loadingAction === 'play-audio'}
          className="bg-white/5 border-white/30 text-white hover:bg-white/20 hover:text-white disabled:opacity-50"
        >
          {loadingAction === 'play-audio' ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white/5 border-white/30 text-white hover:bg-white/20 hover:text-white"
            >
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-slate-800/95 backdrop-blur-sm border-white/20 z-50">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleAction(action.id, action.label)}
                  disabled={loadingAction === action.id}
                  className="text-white hover:bg-white/20 focus:bg-white/20 cursor-pointer"
                >
                  {loadingAction === action.id ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Icon className="w-4 h-4 mr-2" />
                  )}
                  {action.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button
          onClick={handlePlayAudio}
          disabled={loadingAction === 'play-audio'}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg"
        >
          {loadingAction === 'play-audio' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Play Audio
        </Button>
        <Badge variant="outline" className="text-white/60 border-white/30 bg-white/5">
          AI Generated Content
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleAction(action.id, action.label)}
              disabled={loadingAction === action.id}
              className="bg-white/5 border-white/30 text-white hover:bg-white/20 hover:text-white hover:border-white/40 flex flex-col h-auto p-4 transition-all duration-200 disabled:opacity-50"
            >
              {loadingAction === action.id ? (
                <Loader2 className="w-5 h-5 mb-2 animate-spin" />
              ) : (
                <Icon className="w-5 h-5 mb-2" />
              )}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default NewsActions;
