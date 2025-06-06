import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack, Radio } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateAudio } from "@/api/generate-audio";

interface NewsBroadcastProps {
  articles: NewsItem[];
}

const NewsBroadcast = ({ articles }: NewsBroadcastProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentArticle = articles[currentIndex];

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [audio]);

  const playNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (isPlaying) {
        playAudio(articles[currentIndex + 1]);
      }
    } else {
      setIsPlaying(false);
      toast({
        title: "Broadcast Complete",
        description: "All news articles have been played.",
      });
    }
  };

  const playPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (isPlaying) {
        playAudio(articles[currentIndex - 1]);
      }
    }
  };

  const playAudio = async (article: NewsItem) => {
    try {
      setIsLoading(true);
      
      if (audio) {
        audio.pause();
      }
      
      // Check if audio file already exists in Supabase storage
      const audioFilePath = `${article.id}.wav`;
      
      console.log("Checking for audio in bucket: news-audio, file:", audioFilePath);
      
      let audioUrl: string;
      
      try {
        // Try to get the audio file from storage
        const { data: publicUrl } = supabase
          .storage
          .from('news-audio')
          .getPublicUrl(audioFilePath);
          
        // Try to play the file to see if it exists
        const tempAudio = new Audio(publicUrl.publicUrl);
        
        // Set up a promise to check if the file loads or errors
        const checkAudio = new Promise((resolve, reject) => {
          tempAudio.onloadeddata = () => resolve(true);
          tempAudio.onerror = () => reject(new Error("Audio file not found or invalid"));
        });
        
        // Wait for 2 seconds max to see if the audio loads
        const fileExists = await Promise.race([
          checkAudio,
          new Promise((resolve) => setTimeout(() => resolve(false), 2000))
        ]);
        
        if (fileExists) {
          console.log("Audio file found in storage, using existing file");
          audioUrl = publicUrl.publicUrl;
        } else {
          throw new Error("Audio file not available");
        }
      } catch (error) {
        console.log("Audio file not found in storage, generating new audio...");
        // Generate new audio
        const { audioUrl: generatedUrl } = await generateAudio(
          `${article.headline}. ${article.aiSummary}`,
          article.id
        );
        audioUrl = generatedUrl;
      }
      
      console.log("Playing audio from URL:", audioUrl);
      
      const newAudio = new Audio(audioUrl);
      
      newAudio.addEventListener('ended', playNext);
      newAudio.addEventListener('error', (e) => {
        console.error("Audio playback error:", e);
        toast({
          title: "Audio Error",
          description: "Failed to play audio for this article.",
          variant: "destructive",
        });
        playNext();
      });

      setAudio(newAudio);
      audioRef.current = newAudio;
      await newAudio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to play audio. Skipping to next article.",
        variant: "destructive",
      });
      playNext();
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (isPlaying) {
      if (audio) {
        audio.pause();
      }
      setIsPlaying(false);
    } else {
      playAudio(currentArticle);
    }
  };

  if (articles.length === 0) {
    return null;
  }

  return (
    <Card className="cred-surface-elevated border-cred-gray-700 overflow-hidden">
      <CardHeader className="border-b border-cred-gray-800">
        <CardTitle className="text-cred-gray-100 flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cred-teal/10 rounded-lg">
              <Radio className="w-5 h-5 text-cred-teal" />
            </div>
            <span className="text-xl font-bold">News Broadcast</span>
          </div>
          <Badge className="bg-red-500 text-white border-none shadow-lg font-bold px-3 py-1.5 text-xs uppercase tracking-wider animate-pulse">
            ● LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {/* Current Article Display */}
          <div className="cred-surface border border-cred-gray-800 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <Badge className="bg-cred-teal/10 text-cred-teal border border-cred-teal/20 font-medium">
                {currentArticle?.topic}
              </Badge>
              <span className="text-cred-gray-400 text-sm font-medium">
                {currentIndex + 1} of {articles.length}
              </span>
            </div>
            <h3 className="text-cred-gray-100 font-bold mb-3 text-xl leading-tight">
              {currentArticle?.headline}
            </h3>
            <p className="text-cred-gray-300 leading-relaxed">
              {currentArticle?.aiSummary}
            </p>
          </div>

          {/* Broadcast Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={playPrevious}
              disabled={currentIndex === 0 || isLoading}
              className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={togglePlayback}
              disabled={isLoading}
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
              onClick={playNext}
              disabled={currentIndex === articles.length - 1 || isLoading}
              className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-cred-gray-800 rounded-full h-1">
              <div
                className="bg-cred-teal h-1 rounded-full transition-all duration-500"
                style={{ width: `${((currentIndex + 1) / articles.length) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-cred-gray-500">
              <span>Progress</span>
              <span>{Math.round(((currentIndex + 1) / articles.length) * 100)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsBroadcast;
