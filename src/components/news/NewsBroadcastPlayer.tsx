
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";
import { getOrGenerateAudio, playAudioFromUrl } from "@/utils/audioUtils";

interface NewsBroadcastPlayerProps {
  articles: NewsItem[];
  currentIndex: number;
  onNext: () => void;
  onPrevious: () => void;
  onIndexChange: (index: number) => void;
}

const NewsBroadcastPlayer = ({ 
  articles, 
  currentIndex, 
  onNext, 
  onPrevious,
  onIndexChange 
}: NewsBroadcastPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Get the current article from the filtered articles array
  const currentArticle = articles[currentIndex];

  // Clean up audio when component unmounts or articles change
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  // Stop playing when articles change (filters applied)
  useEffect(() => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
  }, [articles]);

  // Reset to first article when articles change
  useEffect(() => {
    if (currentIndex >= articles.length && articles.length > 0) {
      onIndexChange(0);
    }
  }, [articles, currentIndex, onIndexChange]);

  const playAudio = async (article: NewsItem) => {
    try {
      console.log("Playing audio for article in broadcast:", article.id, article.headline);
      setIsLoading(true);
      
      // Stop any existing audio
      if (audio) {
        audio.pause();
        audio.src = '';
      }
      
      // Get or generate audio for this specific article
      const audioUrl = await getOrGenerateAudio(article);
      console.log("Got audio URL for broadcast:", audioUrl);
      
      // Play the audio
      const newAudio = await playAudioFromUrl(audioUrl);
      
      // Set up event listeners
      newAudio.addEventListener('ended', () => {
        console.log("Audio ended, moving to next article");
        setIsPlaying(false);
        if (currentIndex < articles.length - 1) {
          onNext();
          // Auto-play next article after a short delay
          setTimeout(() => {
            const nextArticle = articles[currentIndex + 1];
            if (nextArticle) {
              playAudio(nextArticle);
            }
          }, 500);
        }
      });

      newAudio.addEventListener('error', (e) => {
        console.error("Audio playback error in broadcast:", e);
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Failed to play audio for this article. Skipping to next.",
          variant: "destructive",
        });
        if (currentIndex < articles.length - 1) {
          onNext();
        }
      });

      setAudio(newAudio);
      audioRef.current = newAudio;
      setIsPlaying(true);
      console.log("Audio playback started for broadcast");
    } catch (error) {
      console.error('Error playing audio in broadcast:', error);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to play audio. Skipping to next article.",
        variant: "destructive",
      });
      if (currentIndex < articles.length - 1) {
        onNext();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    console.log("Toggle playback clicked. Current state:", { isPlaying, currentArticle: currentArticle?.id });
    
    if (!currentArticle) {
      console.error("No current article available");
      toast({
        title: "Error",
        description: "No article available to play.",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying && audio) {
      console.log("Pausing audio");
      audio.pause();
      setIsPlaying(false);
    } else {
      console.log("Starting playback for article:", currentArticle.headline);
      playAudio(currentArticle);
    }
  };

  // Don't render if no articles available
  if (!articles.length || !currentArticle) {
    return (
      <div className="flex items-center justify-center gap-4 text-cred-gray-500">
        <span>No articles available for broadcast</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onPrevious}
        disabled={currentIndex === 0 || isLoading}
        className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={togglePlayback}
        disabled={isLoading || !currentArticle}
        className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-bold px-8 py-3 h-12 shadow-lg"
      >
        {isLoading ? (
          <span className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-cred-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading...
          </span>
        ) : isPlaying ? (
          <>
            <Pause className="w-5 h-5 mr-2" />
            Pause
          </>
        ) : (
          <>
            <Play className="w-5 h-5 mr-2" />
            Play Broadcast
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onNext}
        disabled={currentIndex === articles.length - 1 || isLoading}
        className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
      >
        <SkipForward className="w-4 h-4" />
      </Button>
    </div>
  );
};

export default NewsBroadcastPlayer;
