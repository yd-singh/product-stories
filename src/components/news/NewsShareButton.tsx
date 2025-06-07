
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Share, MessageCircle, Copy, Check } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";

interface NewsShareButtonProps {
  article: NewsItem;
}

const NewsShareButton = ({ article }: NewsShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `**${article.headline}**

${article.aiSummary}

*🤖 This news block is summarised and powered by NewsStories, Yash*

Read more: http://productstories.me`;

  const handleWhatsAppShare = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "News story copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100"
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-cred-surface border-cred-gray-700">
        <DropdownMenuItem
          onClick={handleWhatsAppShare}
          className="text-cred-gray-100 hover:bg-cred-gray-800 cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 mr-3 text-green-500" />
          Share on WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="text-cred-gray-100 hover:bg-cred-gray-800 cursor-pointer"
        >
          {copied ? (
            <Check className="w-4 h-4 mr-3 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-3" />
          )}
          {copied ? "Copied!" : "Copy to clipboard"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NewsShareButton;
