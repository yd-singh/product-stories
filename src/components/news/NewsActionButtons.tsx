
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Loader2, Search, BookOpen, MessageSquare, CheckCircle, Mic, MoreHorizontal, Podcast, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface NewsActionButtonsProps {
  articleId: string;
  compact?: boolean;
}

const NewsActionButtons = ({ articleId, compact = false }: NewsActionButtonsProps) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const actions = [
    { 
      id: 'research', 
      label: 'Research', 
      icon: Search, 
      color: 'text-cred-teal', 
      endpoint: 'research',
      tooltip: 'Deep dive into related articles, background reports from other sources.',
      loadingMessage: "Hang Tight!\nWe're digging deep into related research for you."
    },
    { 
      id: 'history', 
      label: 'History', 
      icon: BookOpen, 
      color: 'text-cred-purple', 
      endpoint: 'history',
      tooltip: 'Explore the timeline and key events that led to this headline',
      loadingMessage: "Hang Tight!\nWe're pulling up the article's history in the background."
    },
    { 
      id: 'debate', 
      label: 'Debate', 
      icon: MessageSquare, 
      color: 'text-cred-gold', 
      endpoint: 'debate',
      tooltip: 'See different viewpoints, opinions, and scream-less debates, with just facts.',
      loadingMessage: "Hang Tight!\nWe're gathering different perspectives for a balanced debate."
    },
    { 
      id: 'fact-check', 
      label: 'Fact Check', 
      icon: CheckCircle, 
      color: 'text-green-400', 
      endpoint: 'factCheck',
      tooltip: 'Verify claims with trusted sources and detect misinformation.',
      loadingMessage: "Hang Tight!\nWe're fact-checking this article with trusted sources."
    },
    { 
      id: 'late-night', 
      label: 'Late Night', 
      icon: Mic, 
      color: 'text-orange-400', 
      endpoint: 'lateNight',
      tooltip: 'Enjoy a lighter take — satire, commentary, and humor on the news.',
      loadingMessage: "Hang Tight!\nWe're cooking up some witty commentary for you."
    },
    { 
      id: 'podcast', 
      label: 'Podcast', 
      icon: Podcast, 
      color: 'text-pink-400', 
      endpoint: 'podcast',
      tooltip: 'Listen to an AI-generated podcast discussion about this topic.',
      loadingMessage: "Hang Tight!\nWe're creating your personalized podcast episode."
    },
  ];

  const handleAction = async (actionId: string, actionLabel: string, endpoint: string, loadingMessage: string) => {
    // Check if user is authenticated
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoadingAction(actionId);
    
    try {
      // Get the Basic Auth credentials from Supabase secrets
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('No active session');
      }

      // Show the loading message
      toast({
        title: loadingMessage.split('\n')[0],
        description: loadingMessage.split('\n')[1],
      });

      // Call the edge function to make the authenticated request
      const { data, error } = await supabase.functions.invoke('trigger-n8n-webhook', {
        body: {
          endpoint,
          newsId: articleId,
          // For debate, we might want to add debate topic in the future
          ...(actionId === 'debate' && { debateTopic: 'General discussion' })
        }
      });

      if (error) {
        throw error;
      }

      // Check if we got immediate results or if it's processing
      if (data?.immediate) {
        toast({
          title: "Ready!",
          description: `Your ${actionLabel.toLowerCase()} is ready to view.`,
        });
      } else {
        toast({
          title: "Processing Complete",
          description: `Your ${actionLabel.toLowerCase()} will be ready shortly. You'll be notified when it's available.`,
        });
      }
    } catch (error) {
      console.error(`Error triggering ${actionId}:`, error);
      toast({
        title: "Oops!",
        description: `Something went wrong while preparing your ${actionLabel.toLowerCase()}. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setLoadingAction(null);
    }
  };

  if (compact) {
    return (
      <TooltipProvider>
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
                <Tooltip key={action.id}>
                  <TooltipTrigger asChild>
                    <DropdownMenuItem
                      onClick={() => handleAction(action.id, action.label, action.endpoint, action.loadingMessage)}
                      disabled={loadingAction === action.id}
                      className="text-cred-gray-300 hover:bg-cred-gray-800 focus:bg-cred-gray-800 cursor-pointer relative"
                    >
                      {loadingAction === action.id ? (
                        <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                      ) : (
                        <>
                          <Icon className={`w-4 h-4 mr-3 ${action.color}`} />
                          {/* Notification indicator - you can add logic here to show when content is ready */}
                          <Bell className="w-2 h-2 absolute top-1 right-1 text-cred-teal opacity-0" />
                        </>
                      )}
                      {action.label}
                      {!user && <span className="ml-auto text-xs text-cred-gray-500">Sign in</span>}
                    </DropdownMenuItem>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="right" 
                    className="bg-cred-surface border-cred-gray-700 text-cred-gray-100 max-w-xs"
                  >
                    {action.tooltip}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="grid grid-cols-6 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Tooltip key={action.id}>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAction(action.id, action.label, action.endpoint, action.loadingMessage)}
                  disabled={loadingAction === action.id}
                  className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 hover:text-cred-gray-100 flex flex-col h-auto p-4 transition-all duration-200 disabled:opacity-50 group relative"
                >
                  {loadingAction === action.id ? (
                    <Loader2 className="w-5 h-5 mb-2 animate-spin" />
                  ) : (
                    <>
                      <Icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
                      {/* Notification indicator - you can add logic here to show when content is ready */}
                      <Bell className="w-3 h-3 absolute -top-1 -right-1 text-cred-teal opacity-0" />
                    </>
                  )}
                  <span className="text-xs font-medium">{action.label}</span>
                  {!user && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-cred-teal rounded-full"></span>
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="bg-cred-surface border-cred-gray-700 text-cred-gray-100 max-w-xs"
              >
                {action.tooltip}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
};

export default NewsActionButtons;
