import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Loader2, Play, Search, BookOpen, MessageSquare, CheckCircle, Mic, MoreHorizontal } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface NewsActionsProps {
  article: NewsItem;
  compact?: boolean;
}

const NewsActions = ({ article, compact = false }: NewsActionsProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast } = useToast();

  const actions = [
    { id: 'research', label: 'Research', icon: Search, color: 'text-cred-teal' },
    { id: 'history', label: 'History', icon: BookOpen, color: 'text-cred-purple' },
    { id: 'debate', label: 'Debate', icon: MessageSquare, color: 'text-cred-gold' },
    { id: 'fact-check', label: 'Fact Check', icon: CheckCircle, color: 'text-green-400' },
    { id: 'late-night', label: 'Late Night', icon: Mic, color: 'text-orange-400' },
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
      const audioFilePath = `${article.id}.mp3`;
      
      // Check if audio file exists in Supabase storage
      const { data: existingAudio, error: fetchError } = await supabase
        .storage
        .from('news-audio')
        .download(audioFilePath);
      
      let audioUrl: string;
      
      if (fetchError || !existingAudio) {
        console.log("Audio file not found in storage, generating new audio...");
        // Generate new audio if not found in storage
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

        if (!response.ok) {
          throw new Error('Failed to generate audio');
        }

        const { audioUrl: generatedUrl } = await response.json();
        audioUrl = generatedUrl;
      } else {
        console.log("Audio file found in storage, using existing file");
        // Get public URL from stored file
        const { data: publicUrl } = supabase
          .storage
          .from('news-audio')
          .getPublicUrl(audioFilePath);
          
        audioUrl = publicUrl.publicUrl;
      }
      
      console.log("Playing audio from URL:", audioUrl);
      
      // Create and play audio element
      const audio = new Audio(audioUrl);
      await audio.play();
      
      toast({
        title: "Playing Audio",
        description: "Audio playback started for this article.",
      });
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
      <div className="flex gap-3">
        <Button
          size="sm"
          onClick={handlePlayAudio}
          disabled={loadingAction === 'play-audio'}
          className="bg-cred-teal/10 border border-cred-teal/20 text-cred-teal hover:bg-cred-teal/20 hover:border-cred-teal/30 disabled:opacity-50"
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
              className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 hover:text-cred-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-cred-surface border-cred-gray-700 z-50 min-w-[160px]">
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownMenuItem
                  key={action.id}
                  onClick={() => handleAction(action.id, action.label)}
                  disabled={loadingAction === action.id}
                  className="text-cred-gray-300 hover:bg-cred-gray-800 focus:bg-cred-gray-800 cursor-pointer"
                >
                  {loadingAction === action.id ? (
                    <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                  ) : (
                    <Icon className={`w-4 h-4 mr-3 ${action.color}`} />
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePlayAudio}
          disabled={loadingAction === 'play-audio'}
          className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-medium shadow-lg"
        >
          {loadingAction === 'play-audio' ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Play className="w-4 h-4 mr-2" />
          )}
          Play Audio
        </Button>
        <Badge className="bg-cred-gray-800/50 text-cred-gray-400 border-cred-gray-700 font-normal">
          AI Generated
        </Badge>
      </div>
      
      <div className="grid grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={() => handleAction(action.id, action.label)}
              disabled={loadingAction === action.id}
              className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 hover:text-cred-gray-100 flex flex-col h-auto p-4 transition-all duration-200 disabled:opacity-50 group"
            >
              {loadingAction === action.id ? (
                <Loader2 className="w-5 h-5 mb-2 animate-spin" />
              ) : (
                <Icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
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
