
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Radio } from "lucide-react";
import { NewsItem } from "@/hooks/useNews";
import NewsBroadcastPlayer from "./news/NewsBroadcastPlayer";
import NewsBroadcastArticle from "./news/NewsBroadcastArticle";
import ProgressBar from "./news/ProgressBar";

interface NewsBroadcastProps {
  articles: NewsItem[];
}

const NewsBroadcast = ({ articles }: NewsBroadcastProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < articles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
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
          <NewsBroadcastArticle 
            article={articles[currentIndex]} 
            index={currentIndex} 
            total={articles.length} 
          />

          {/* Broadcast Controls */}
          <NewsBroadcastPlayer
            articles={articles}
            currentIndex={currentIndex}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onIndexChange={setCurrentIndex}
          />

          {/* Progress Bar */}
          <ProgressBar currentIndex={currentIndex} total={articles.length} />
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsBroadcast;
