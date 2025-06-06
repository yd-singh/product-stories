
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";
import { getOrGenerateAudio } from "@/utils/audioUtils";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string>("");

  // Get the current article from the filtered articles array
  const currentArticle = articles[currentIndex];

  // Function to completely stop and cleanup current audio
  const stopAndCleanupAudio = () => {
    console.log("Stopping and cleaning up audio");
    if (audioRef.current) {
      // Remove all event listeners first
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      audioRef.current.removeEventListener('error', handleAudioError);
      
      // Stop and clear audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load(); // This clears the audio completely
      audioRef.current = null;
    }
    
    // Clean up blob URL if it exists
    if (currentAudioUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
    }
    currentAudioUrlRef.current = "";
    
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
  };

  // Event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      console.log("Audio metadata loaded, duration:", audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlayThrough = () => {
    if (audioRef.current) {
      console.log("Audio can play through, starting playback");
      audioRef.current.play()
        .then(() => {
          console.log("Audio playback started successfully");
          setIsPlaying(true);
          setIsLoading(false);
        })
        .catch((playError) => {
          console.error("Error starting audio playback:", playError);
          setIsPlaying(false);
          setIsLoading(false);
          toast({
            title: "Audio Error",
            description: "Failed to play audio for this article.",
            variant: "destructive",
          });
        });
    }
  };

  const handleAudioEnded = () => {
    console.log("Audio ended, moving to next article");
    setIsPlaying(false);
    setCurrentTime(0);
    if (currentIndex < articles.length - 1) {
      onNext();
      // Auto-play next article after navigation
      setTimeout(() => {
        const nextArticle = articles[currentIndex + 1];
        if (nextArticle) {
          playAudio(nextArticle);
        }
      }, 100);
    }
  };

  const handleAudioError = (e: Event) => {
    console.error("Audio playback error:", e);
    if (audioRef.current) {
      console.error("Audio error details:", {
        error: audioRef.current.error,
        networkState: audioRef.current.networkState,
        readyState: audioRef.current.readyState,
        src: audioRef.current.src
      });
    }
    stopAndCleanupAudio();
    toast({
      title: "Audio Error",
      description: "Failed to play audio for this article. Skipping to next.",
      variant: "destructive",
    });
    if (currentIndex < articles.length - 1) {
      onNext();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAndCleanupAudio();
    };
  }, []);

  // Stop audio when articles change (filters applied)
  useEffect(() => {
    stopAndCleanupAudio();
  }, [articles]);

  // Reset to first article when articles change
  useEffect(() => {
    if (currentIndex >= articles.length && articles.length > 0) {
      onIndexChange(0);
    }
  }, [articles, currentIndex, onIndexChange]);

  const playAudio = async (article: NewsItem) => {
    try {
      console.log("Playing audio for article:", article.id, article.headline);
      setIsLoading(true);
      
      // Stop any existing audio first
      stopAndCleanupAudio();
      
      // Get or generate audio for this specific article
      const audioUrl = await getOrGenerateAudio(article);
      console.log("Got audio URL:", audioUrl);
      currentAudioUrlRef.current = audioUrl;
      
      // Create new audio element
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('canplaythrough', handleCanPlayThrough);
      audio.addEventListener('ended', handleAudioEnded);
      audio.addEventListener('error', handleAudioError);
      
      audio.addEventListener('loadstart', () => {
        console.log("Audio loading started");
      });
      
      audio.addEventListener('loadeddata', () => {
        console.log("Audio data loaded");
      });

      // Set the audio reference and source
      audioRef.current = audio;
      audio.src = audioUrl;
      
      // Load the audio
      audio.load();
      
      console.log("Audio setup complete");
    } catch (error) {
      console.error('Error playing audio:', error);
      stopAndCleanupAudio();
      toast({
        title: "Error",
        description: "Failed to play audio. Skipping to next article.",
        variant: "destructive",
      });
      if (currentIndex < articles.length - 1) {
        onNext();
      }
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

    if (isPlaying && audioRef.current) {
      console.log("Pausing audio");
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      console.log("Starting playback for article:", currentArticle.headline);
      playAudio(currentArticle);
    }
  };

  const handleNext = () => {
    console.log("Next button clicked");
    stopAndCleanupAudio();
    onNext();
  };

  const handlePrevious = () => {
    console.log("Previous button clicked");
    stopAndCleanupAudio();
    onPrevious();
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Don't render if no articles available
  if (!articles.length || !currentArticle) {
    return (
      <div className="flex items-center justify-center gap-4 text-cred-gray-500">
        <span>No articles available for broadcast</span>
      </div>
    );
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div 
          className="w-full bg-cred-gray-800 rounded-full h-2 cursor-pointer hover:h-3 transition-all duration-200"
          onClick={handleSeek}
        >
          <div
            className="bg-cred-teal h-full rounded-full transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-cred-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevious}
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
          onClick={handleNext}
          disabled={currentIndex === articles.length - 1 || isLoading}
          className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NewsBroadcastPlayer;
