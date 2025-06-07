
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
  const [playlistMode, setPlaylistMode] = useState(false); // Track if we're in playlist mode
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentAudioUrlRef = useRef<string>("");

  // Get the current article
  const currentArticle = articles[currentIndex];

  // Clean up audio completely
  const cleanupAudio = () => {
    console.log("Cleaning up audio");
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.src = '';
      audioRef.current.load();
      audioRef.current = null;
    }
    
    if (currentAudioUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(currentAudioUrlRef.current);
    }
    currentAudioUrlRef.current = "";
    
    setCurrentTime(0);
    setDuration(0);
    setIsLoading(false);
  };

  // Load and play audio for an article
  const loadAndPlayAudio = async (article: NewsItem, shouldAutoPlay: boolean = true) => {
    console.log("Loading audio for article:", article.id, "Auto-play:", shouldAutoPlay);
    
    try {
      setIsLoading(true);
      cleanupAudio();
      
      // Get audio URL
      const audioUrl = await getOrGenerateAudio(article);
      console.log("Got audio URL:", audioUrl);
      currentAudioUrlRef.current = audioUrl;
      
      // Create new audio element
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.src = audioUrl;
      
      // Set up event listeners
      audio.addEventListener('loadedmetadata', () => {
        console.log("Audio metadata loaded, duration:", audio.duration);
        setDuration(audio.duration || 0);
      });
      
      audio.addEventListener('timeupdate', () => {
        setCurrentTime(audio.currentTime);
      });
      
      audio.addEventListener('canplaythrough', () => {
        console.log("Audio can play through");
        setIsLoading(false);
        
        if (shouldAutoPlay) {
          console.log("Auto-playing audio");
          audio.play()
            .then(() => {
              setIsPlaying(true);
              console.log("Audio playback started");
            })
            .catch((error) => {
              console.error("Error starting playback:", error);
              setIsPlaying(false);
              toast({
                title: "Audio Error",
                description: "Failed to play audio for this article.",
                variant: "destructive",
              });
            });
        }
      });
      
      audio.addEventListener('ended', () => {
        console.log("Audio ended");
        setIsPlaying(false);
        setCurrentTime(0);
        
        // Auto-advance to next article if in playlist mode
        if (playlistMode && currentIndex < articles.length - 1) {
          console.log("Auto-advancing to next article");
          onNext();
        } else if (playlistMode) {
          console.log("Playlist finished");
          setPlaylistMode(false);
        }
      });
      
      audio.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        setIsLoading(false);
        setIsPlaying(false);
        toast({
          title: "Audio Error",
          description: "Failed to load audio. Skipping to next article.",
          variant: "destructive",
        });
        
        if (playlistMode && currentIndex < articles.length - 1) {
          onNext();
        }
      });
      
      audioRef.current = audio;
      audio.load();
      
    } catch (error) {
      console.error('Error loading audio:', error);
      setIsLoading(false);
      setIsPlaying(false);
      toast({
        title: "Error",
        description: "Failed to load audio for this article.",
        variant: "destructive",
      });
    }
  };

  // Handle play/pause toggle
  const togglePlayback = () => {
    console.log("Toggle playback. Current state:", { isPlaying, currentArticle: currentArticle?.id });
    
    if (!currentArticle) {
      toast({
        title: "Error",
        description: "No article available to play.",
        variant: "destructive",
      });
      return;
    }

    if (isPlaying && audioRef.current) {
      // Pause current audio
      console.log("Pausing audio");
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current && audioRef.current.src) {
      // Resume existing audio
      console.log("Resuming audio");
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setPlaylistMode(true); // Enable playlist mode when playing
        })
        .catch((error) => {
          console.error("Error resuming playback:", error);
          toast({
            title: "Audio Error",
            description: "Failed to resume audio playback.",
            variant: "destructive",
          });
        });
    } else {
      // Start new audio (Play Broadcast)
      console.log("Starting new broadcast");
      setPlaylistMode(true); // Enable playlist mode
      loadAndPlayAudio(currentArticle, true);
    }
  };

  // Handle next button
  const handleNext = () => {
    console.log("Next button clicked. Playlist mode:", playlistMode);
    const shouldAutoPlay = playlistMode || isPlaying;
    setIsPlaying(false);
    onNext();
    
    // The useEffect will handle loading the new audio
    if (shouldAutoPlay) {
      setPlaylistMode(true);
    }
  };

  // Handle previous button
  const handlePrevious = () => {
    console.log("Previous button clicked. Playlist mode:", playlistMode);
    const shouldAutoPlay = playlistMode || isPlaying;
    setIsPlaying(false);
    onPrevious();
    
    // The useEffect will handle loading the new audio
    if (shouldAutoPlay) {
      setPlaylistMode(true);
    }
  };

  // Handle seek bar click
  const handleSeek = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !duration) return;
    
    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const newTime = (clickX / rect.width) * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Format time display
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Effect to handle article changes
  useEffect(() => {
    if (currentArticle && playlistMode) {
      console.log("Article changed, loading new audio. Playlist mode:", playlistMode);
      loadAndPlayAudio(currentArticle, true);
    }
  }, [currentIndex, currentArticle]);

  // Reset when articles change (filters applied)
  useEffect(() => {
    cleanupAudio();
    setIsPlaying(false);
    setPlaylistMode(false);
  }, [articles]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
      setIsPlaying(false);
      setPlaylistMode(false);
    };
  }, []);

  // Reset to first article when articles change
  useEffect(() => {
    if (currentIndex >= articles.length && articles.length > 0) {
      onIndexChange(0);
    }
  }, [articles, currentIndex, onIndexChange]);

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
      {/* Progress Bar (Seek Bar) */}
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
              {audioRef.current && audioRef.current.src ? 'Resume' : 'Play Broadcast'}
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
