
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react';

interface SmartSuggestionsProps {
  suggestions: string[];
  onSelectSuggestion: (suggestion: string) => void;
}

const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({ 
  suggestions, 
  onSelectSuggestion
}) => {
  if (!suggestions.length) return null;
  
  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-1 text-xs text-white/70">
        <Lightbulb className="h-3 w-3" />
        <span>Suggestions:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm"
            className="text-xs py-1 px-2 h-auto bg-white/5 hover:bg-white/10"
            onClick={() => onSelectSuggestion(suggestion)}
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SmartSuggestions;
