
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Loader2, Search, BookOpen, MessageSquare, CheckCircle, Mic, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
    { id: 'research', label: 'Research', icon: Search, color: 'text-cred-teal', endpoint: 'research' },
    { id: 'history', label: 'History', icon: BookOpen, color: 'text-cred-purple', endpoint: 'history' },
    { id: 'debate', label: 'Debate', icon: MessageSquare, color: 'text-cred-gold', endpoint: 'debate' },
    { id: 'fact-check', label: 'Fact Check', icon: CheckCircle, color: 'text-green-400', endpoint: 'factCheck' },
    { id: 'late-night', label: 'Late Night', icon: Mic, color: 'text-orange-400', endpoint: 'lateNight' },
  ];

  const handleAction = async (actionId: string, actionLabel: string, endpoint: string) => {
    // Check if user is authenticated
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoadingAction(actionId);
    
    try {
      const baseUrl = 'https://n8n.srv848613.hstgr.cloud/webhook';
      const url = `${baseUrl}/${endpoint}`;
      
      let body: any = { newsId: articleId };
      
      // For debate, we might want to add debate topic in the future
      if (actionId === 'debate') {
        // For now, just send newsId. Can be extended later for debate topic
        body = { newsId: articleId };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: Basic auth credentials should be added via environment variables
          // For now, using placeholder - you'll need to add the actual credentials
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: "Action Triggered",
          description: `${actionLabel} has been initiated for this article.`,
        });
      } else {
        throw new Error(`HTTP ${response.status}`);
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

  if (compact) {
    return (
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
                onClick={() => handleAction(action.id, action.label, action.endpoint)}
                disabled={loadingAction === action.id}
                className="text-cred-gray-300 hover:bg-cred-gray-800 focus:bg-cred-gray-800 cursor-pointer"
              >
                {loadingAction === action.id ? (
                  <Loader2 className="w-4 h-4 mr-3 animate-spin" />
                ) : (
                  <Icon className={`w-4 h-4 mr-3 ${action.color}`} />
                )}
                {action.label}
                {!user && <span className="ml-auto text-xs text-cred-gray-500">Sign in</span>}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-3">
      {actions.map((action) => {
        const Icon = action.icon;
        return (
          <Button
            key={action.id}
            variant="outline"
            size="sm"
            onClick={() => handleAction(action.id, action.label, action.endpoint)}
            disabled={loadingAction === action.id}
            className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 hover:text-cred-gray-100 flex flex-col h-auto p-4 transition-all duration-200 disabled:opacity-50 group relative"
          >
            {loadingAction === action.id ? (
              <Loader2 className="w-5 h-5 mb-2 animate-spin" />
            ) : (
              <Icon className={`w-5 h-5 mb-2 ${action.color} group-hover:scale-110 transition-transform`} />
            )}
            <span className="text-xs font-medium">{action.label}</span>
            {!user && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cred-teal rounded-full"></span>
            )}
          </Button>
        );
      })}
    </div>
  );
};

export default NewsActionButtons;
