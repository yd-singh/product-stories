
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause } from "lucide-react";
import { getOrGenerateAudio, playAudioFromUrl } from "@/utils/audioUtils";
import { useToast } from "@/hooks/use-toast";

interface NewsPlayButtonProps {
  article: {
    id: string;
    headline: string;
    aiSummary: string;
  };
  size?: "sm" | "default";
  onPlayStarted?: () => void;
}

const NewsPlayButton = ({ article, size = "default", onPlayStarted }: NewsPlayButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handlePlayAudio = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    
    try {
      // Stop any currently playing audio
      if (audio) {
        audio.pause();
        setAudio(null);
      }
      
      // Get or generate audio for this article
      const audioUrl = await getOrGenerateAudio(article);
      
      // Play the audio
      const newAudio = await playAudioFromUrl(audioUrl);
      
      setAudio(newAudio);
      setIsPlaying(true);
      
      if (onPlayStarted) {
        onPlayStarted();
      }
      
      // Handle audio ending
      newAudio.addEventListener('ended', () => {
        setIsPlaying(false);
        setAudio(null);
      });
      
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
      setIsLoading(false);
    }
  };

  if (size === "sm") {
    return (
      <Button
        size="sm"
        onClick={handlePlayAudio}
        disabled={isLoading}
        className="bg-cred-teal/10 border border-cred-teal/20 text-cred-teal hover:bg-cred-teal/20 hover:border-cred-teal/30 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isPlaying ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePlayAudio}
      disabled={isLoading}
      className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-medium shadow-lg"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isPlaying ? (
        <Pause className="w-4 h-4 mr-2" />
      ) : (
        <Play className="w-4 h-4 mr-2" />
      )}
      {isPlaying ? "Pause Audio" : "Play Audio"}
    </Button>
  );
};

export default NewsPlayButton;
