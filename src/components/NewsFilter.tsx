
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface NewsFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  onClearFilters: () => void;
}

const NewsFilter = ({ 
  availableTags, 
  selectedTags, 
  onTagsChange, 
  selectedDate,
  onDateChange,
  onClearFilters 
}: NewsFilterProps) => {
  const [tagSelectValue, setTagSelectValue] = useState("");

  const handleTagSelect = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onTagsChange([...selectedTags, tag]);
    }
    setTagSelectValue(""); // Reset the select value
  };

  const handleTagRemove = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedDate;

  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-6 mb-8">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Topic Filter */}
          <div>
            <label className="text-white/80 text-sm mb-2 block font-medium">Filter by Topic:</label>
            <Select value={tagSelectValue} onValueChange={handleTagSelect}>
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

          {/* Date Filter */}
          <div>
            <label className="text-white/80 text-sm mb-2 block font-medium">Filter by Date:</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full bg-white/10 border-white/30 text-white hover:bg-white/15 focus:bg-white/15 focus:border-white/40 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800/95 backdrop-blur-sm border-white/20 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={onDateChange}
                  initialFocus
                  className="text-white"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-white/70 hover:text-white hover:bg-white/15 transition-colors whitespace-nowrap"
          >
            Clear All Filters
          </Button>
        )}
      </div>
      
      {(selectedTags.length > 0 || selectedDate) && (
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
            {selectedDate && (
              <Badge
                className="bg-purple-500/20 text-purple-300 border border-purple-500/40 pr-1 hover:bg-purple-500/30 transition-colors"
              >
                {format(selectedDate, "MMM dd, yyyy")}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-1 text-purple-300 hover:text-purple-200 hover:bg-transparent"
                  onClick={() => onDateChange(undefined)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsFilter;
