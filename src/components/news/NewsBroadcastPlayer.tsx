
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
  const isNavigatingRef = useRef(false);

  // Get the current article from the filtered articles array
  const currentArticle = articles[currentIndex];

  // Complete audio cleanup function
  const cleanupAudio = () => {
    console.log("Cleaning up audio completely");
    
    if (audioRef.current) {
      // Remove all event listeners
      audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      audioRef.current.removeEventListener('ended', handleAudioEnded);
      audioRef.current.removeEventListener('error', handleAudioError);
      
      // Stop and clear audio
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    
    // Clean up blob URL if it exists
    if (currentAudioUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
    }
    currentAudioUrlRef.current = "";
    
    // Reset all states
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
  };

  // Event handlers
  const handleTimeUpdate = () => {
    if (audioRef.current && !isNavigatingRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current && !isNavigatingRef.current) {
      console.log("Audio metadata loaded, duration:", audioRef.current.duration);
      setDuration(audioRef.current.duration);
    }
  };

  const handleCanPlayThrough = () => {
    if (audioRef.current && !isNavigatingRef.current) {
      console.log("Audio can play through, starting playback");
      audioRef.current.play()
        .then(() => {
          if (!isNavigatingRef.current) {
            console.log("Audio playback started successfully");
            setIsPlaying(true);
            setIsLoading(false);
          }
        })
        .catch((playError) => {
          if (!isNavigatingRef.current) {
            console.error("Error starting audio playback:", playError);
            setIsPlaying(false);
            setIsLoading(false);
            toast({
              title: "Audio Error",
              description: "Failed to play audio for this article.",
              variant: "destructive",
            });
          }
        });
    }
  };

  const handleAudioEnded = () => {
    if (isNavigatingRef.current) return;
    
    console.log("Audio ended, moving to next article");
    setIsPlaying(false);
    setCurrentTime(0);
    
    if (currentIndex < articles.length - 1) {
      isNavigatingRef.current = true;
      onNext();
      // Auto-play next article after a short delay
      setTimeout(() => {
        isNavigatingRef.current = false;
        const nextArticle = articles[currentIndex + 1];
        if (nextArticle) {
          playAudio(nextArticle);
        }
      }, 200);
    }
  };

  const handleAudioError = (e: Event) => {
    if (isNavigatingRef.current) return;
    
    console.error("Audio playback error:", e);
    cleanupAudio();
    toast({
      title: "Audio Error",
      description: "Failed to play audio for this article. Skipping to next.",
      variant: "destructive",
    });
    
    if (currentIndex < articles.length - 1) {
      isNavigatingRef.current = true;
      onNext();
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 200);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, []);

  // Stop audio when articles change (filters applied)
  useEffect(() => {
    cleanupAudio();
    isNavigatingRef.current = false;
  }, [articles]);

  // Reset to first article when articles change
  useEffect(() => {
    if (currentIndex >= articles.length && articles.length > 0) {
      onIndexChange(0);
    }
  }, [articles, currentIndex, onIndexChange]);

  // Effect to handle article changes due to navigation
  useEffect(() => {
    if (currentArticle && !isNavigatingRef.current) {
      // Only auto-play if we were already playing
      if (isPlaying) {
        playAudio(currentArticle);
      }
    }
  }, [currentIndex]);

  const playAudio = async (article: NewsItem) => {
    if (isNavigatingRef.current) return;
    
    try {
      console.log("Playing audio for article:", article.id, article.headline);
      setIsLoading(true);
      
      // Clean up any existing audio first
      cleanupAudio();
      
      // Get or generate audio for this specific article
      const audioUrl = await getOrGenerateAudio(article);
      
      // Check if we're still supposed to play this article (user might have navigated away)
      if (isNavigatingRef.current || articles[currentIndex]?.id !== article.id) {
        console.log("Navigation occurred during audio loading, aborting");
        setIsLoading(false);
        return;
      }
      
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
      
      // Set the audio reference and source
      audioRef.current = audio;
      audio.src = audioUrl;
      
      // Load the audio
      audio.load();
      
      console.log("Audio setup complete");
    } catch (error) {
      if (!isNavigatingRef.current) {
        console.error('Error playing audio:', error);
        cleanupAudio();
        toast({
          title: "Error",
          description: "Failed to play audio. Skipping to next article.",
          variant: "destructive",
        });
        
        if (currentIndex < articles.length - 1) {
          isNavigatingRef.current = true;
          onNext();
          setTimeout(() => {
            isNavigatingRef.current = false;
          }, 200);
        }
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
    isNavigatingRef.current = true;
    cleanupAudio();
    onNext();
    
    // Reset navigation flag after a delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
  };

  const handlePrevious = () => {
    console.log("Previous button clicked");
    isNavigatingRef.current = true;
    cleanupAudio();
    onPrevious();
    
    // Reset navigation flag after a delay
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 200);
  };

  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration || isNavigatingRef.current) return;
    
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
