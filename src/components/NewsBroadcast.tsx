
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipForward, SkipBack, Radio } from "lucide-react";
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
              disabled={currentIndex === 0}
              className="border-cred-gray-700 text-cred-gray-300 hover:bg-cred-surface hover:text-cred-gray-100 disabled:opacity-30 h-10 w-10 p-0"
            >
              <SkipBack className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={togglePlayback}
              className="bg-cred-teal text-cred-black hover:bg-cred-teal/90 font-bold px-8 py-3 h-12 shadow-lg"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 mr-2" />
              ) : (
                <Play className="w-5 h-5 mr-2" />
              )}
              {isPlaying ? 'Pause' : 'Play'} Broadcast
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={playNext}
              disabled={currentIndex === articles.length - 1}
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
