
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { getAudioUrl } from "@/utils/audioUtils";

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  // Load audio for current article
  useEffect(() => {
    const loadAudio = async () => {
      if (!articles[currentIndex]) return;
      
      setIsLoading(true);
      console.log(`Loading audio for article: ${articles[currentIndex].id}`);
      
      try {
        // Clean up previous audio
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
          audioRef.current.load();
        }

        const audioUrl = await getAudioUrl(articles[currentIndex].id);
        console.log(`Got audio URL: ${audioUrl}`);
        
        setCurrentAudioUrl(audioUrl);
        
        // Create new audio element
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        // Set up event listeners
        audio.addEventListener('loadedmetadata', () => {
          console.log(`Audio metadata loaded, duration: ${audio.duration}`);
          setDuration(audio.duration);
        });

        audio.addEventListener('canplaythrough', () => {
          console.log('Audio can play through');
          setIsLoading(false);
        });

        audio.addEventListener('timeupdate', () => {
          setCurrentTime(audio.currentTime);
        });

        audio.addEventListener('ended', () => {
          console.log('Audio ended');
          handleNext();
        });

        audio.addEventListener('play', () => {
          console.log('Audio playback started');
          setIsPlaying(true);
        });

        audio.addEventListener('pause', () => {
          console.log('Audio playback paused');
          setIsPlaying(false);
        });

        // Start loading the audio
        audio.load();
        
      } catch (error) {
        console.error('Error loading audio:', error);
        setIsLoading(false);
      }
    };

    loadAudio();

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, [currentIndex, articles]);

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      console.log('Pausing audio');
      audioRef.current.pause();
    } else {
      console.log('Resuming audio');
      audioRef.current.play();
    }
  };

  const handleNext = () => {
    console.log('Next button clicked');
    if (currentIndex < articles.length - 1) {
      const nextIndex = currentIndex + 1;
      onIndexChange(nextIndex);
      onNext();
      
      // Auto-play next article if currently playing
      setTimeout(() => {
        if (audioRef.current && isPlaying) {
          audioRef.current.play();
        }
      }, 500);
    }
  };

  const handlePrevious = () => {
    console.log('Previous button clicked');
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      onIndexChange(prevIndex);
      onPrevious();
      
      // Auto-play previous article if currently playing
      setTimeout(() => {
        if (audioRef.current && isPlaying) {
          audioRef.current.play();
        }
      }, 500);
    }
  };

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Seek Bar */}
      <div className="space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-2 bg-cred-gray-800 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #14B8A6 0%, #14B8A6 ${(currentTime / duration) * 100}%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`
          }}
        />
        <div className="flex justify-between text-sm text-cred-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <Button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || isLoading}
          variant="outline"
          size="sm"
          className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 disabled:opacity-50"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={togglePlayback}
          disabled={isLoading || !currentAudioUrl}
          className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 w-12 h-12 rounded-full"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-cred-black border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentIndex === articles.length - 1 || isLoading}
          variant="outline"
          size="sm"
          className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:border-cred-gray-600 disabled:opacity-50"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default NewsBroadcastPlayer;
