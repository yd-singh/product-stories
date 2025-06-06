
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack, Volume2 } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import { useToast } from "@/hooks/use-toast";

interface NewsBroadcastProps {
  articles: NewsItem[];
}

const NewsBroadcast = ({ articles }: NewsBroadcastProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const currentArticle = articles[currentIndex];

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        audio.remove();
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
      if (audio) {
        audio.pause();
        audio.remove();
      }

      // TODO: Replace with actual audio generation endpoint
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `${article.headline}. ${article.aiSummary}`,
          articleId: article.id,
        }),
      });

      if (response.ok) {
        const { audioUrl } = await response.json();
        const newAudio = new Audio(audioUrl);
        
        newAudio.addEventListener('ended', playNext);
        newAudio.addEventListener('error', () => {
          toast({
            title: "Audio Error",
            description: "Failed to play audio for this article.",
            variant: "destructive",
          });
          playNext();
        });

        setAudio(newAudio);
        await newAudio.play();
        setIsPlaying(true);
      } else {
        throw new Error('Failed to generate audio');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Skipping to next article.",
        variant: "destructive",
      });
      playNext();
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
    <Card className="bg-gradient-to-r from-purple-600/10 to-blue-600/10 backdrop-blur-sm border-white/10 mb-8">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          News Broadcast
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Article Display */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-start justify-between mb-2">
              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                {currentArticle?.topic}
              </Badge>
              <span className="text-white/60 text-sm">
                {currentIndex + 1} of {articles.length}
              </span>
            </div>
            <h3 className="text-white font-semibold mb-2">
              {currentArticle?.headline}
            </h3>
            <p className="text-white/70 text-sm line-clamp-2">
              {currentArticle?.aiSummary}
            </p>
          </div>

          {/* Broadcast Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={playPrevious}
              disabled={currentIndex === 0}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={togglePlayback}
              className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Play'} Broadcast
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={playNext}
              disabled={currentIndex === articles.length - 1}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / articles.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsBroadcast;
