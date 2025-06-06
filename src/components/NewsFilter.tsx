
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, CalendarIcon, Filter } from "lucide-react";
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
    setTagSelectValue("");
  };

  const handleTagRemove = (tag: string) => {
    onTagsChange(selectedTags.filter(t => t !== tag));
  };

  const hasActiveFilters = selectedTags.length > 0 || selectedDate;

  return (
    <div className="space-y-6">
      {/* Filter Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-cred-gray-400" />
          <span className="text-sm font-medium text-cred-gray-400 uppercase tracking-wider">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClearFilters}
            className="text-cred-gray-500 hover:text-cred-gray-300 hover:bg-cred-surface text-xs font-medium"
          >
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Topic Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cred-gray-300">Topic</label>
          <Select value={tagSelectValue} onValueChange={handleTagSelect}>
            <SelectTrigger className="cred-surface-elevated border-cred-gray-700 text-cred-gray-100 hover:border-cred-gray-600 focus:border-cred-teal h-12">
              <SelectValue placeholder="Select topic" />
            </SelectTrigger>
            <SelectContent className="bg-cred-surface border-cred-gray-700 z-50">
              {availableTags.map((tag) => (
                <SelectItem 
                  key={tag} 
                  value={tag} 
                  disabled={selectedTags.includes(tag)}
                  className="text-cred-gray-100 hover:bg-cred-gray-800 focus:bg-cred-gray-800 disabled:opacity-40"
                >
                  {tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cred-gray-300">Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full cred-surface-elevated border-cred-gray-700 text-cred-gray-100 hover:border-cred-gray-600 focus:border-cred-teal justify-start text-left font-normal h-12"
              >
                <CalendarIcon className="mr-3 h-4 w-4 text-cred-gray-400" />
                {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-cred-surface border-cred-gray-700 z-50" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={onDateChange}
                initialFocus
                className="text-cred-gray-100"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      {/* Active Filters */}
      {(selectedTags.length > 0 || selectedDate) && (
        <div className="space-y-3">
          <span className="text-xs font-medium text-cred-gray-500 uppercase tracking-wider">Active Filters</span>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag}
                className="bg-cred-teal/10 text-cred-teal border border-cred-teal/20 pr-1 hover:bg-cred-teal/20 transition-colors font-medium"
              >
                {tag}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2 text-cred-teal hover:text-cred-teal/70 hover:bg-transparent"
                  onClick={() => handleTagRemove(tag)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </Badge>
            ))}
            {selectedDate && (
              <Badge
                className="bg-cred-purple/10 text-cred-purple border border-cred-purple/20 pr-1 hover:bg-cred-purple/20 transition-colors font-medium"
              >
                {format(selectedDate, "MMM dd, yyyy")}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2 text-cred-purple hover:text-cred-purple/70 hover:bg-transparent"
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
