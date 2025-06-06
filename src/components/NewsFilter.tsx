
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface NewsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onClearFilters: () => void;
}

const NewsFilter = ({ availableTags, selectedTags, onTagsChange, onClearFilters }: NewsFilterProps) => {
  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const handleTagRemove = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="text-white/80 text-sm mb-2 block font-medium">Filter by Topic:</label>
          <Select onValueChange={handleTagSelect}>
            <SelectTrigger className="bg-white/10 border-white/30 text-white hover:bg-white/15 focus:bg-white/15 focus:border-white/40">
              <SelectValue placeholder="Select a topic to filter" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800/95 backdrop-blur-sm border-white/20 z-50">
              {availableTags.map((tag) => (
                <SelectItem 
                  key={tag} 
                  value={tag} 
                  disabled={selectedTags.includes(tag)}
                  className="text-white hover:bg-white/20 focus:bg-white/20 disabled:opacity-50"
                >
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedTags.length > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-white/70 hover:text-white hover:bg-white/15 transition-colors"
          >
            Clear All
          </Button>
        )}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-blue-500/20 text-blue-300 border border-blue-500/40 pr-1 hover:bg-blue-500/30 transition-colors"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 text-blue-300 hover:text-blue-200 hover:bg-transparent"
                  onClick={() => handleTagRemove(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFilter;
