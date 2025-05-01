
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sliders, Zap, Plus } from 'lucide-react';

interface PromptTuningModesProps {
  value: 'minimal' | 'enhanced' | 'advanced';
  onChange: (value: 'minimal' | 'enhanced' | 'advanced') => void;
}

const PromptTuningModes: React.FC<PromptTuningModesProps> = ({ value, onChange }) => {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium mb-2">
        Prompt Tuning Mode
      </label>
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(value) => {
          if (value) onChange(value as 'minimal' | 'enhanced' | 'advanced');
        }}
        className="justify-start border rounded-md p-1 bg-white/15 backdrop-blur-sm"
      >
        <ToggleGroupItem value="minimal" className="flex items-center gap-1 text-xs data-[state=on]:bg-primary/50">
          <Zap className="h-3 w-3" />
          <span>Minimal</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="enhanced" className="flex items-center gap-1 text-xs data-[state=on]:bg-primary/50">
          <Sliders className="h-3 w-3" />
          <span>Enhanced</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="advanced" className="flex items-center gap-1 text-xs data-[state=on]:bg-primary/50">
          <Plus className="h-3 w-3" />
          <span>Advanced</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="text-xs text-white/80 mt-1">
        {value === 'minimal' 
          ? 'Outputs only what you entered without modifications.'
          : value === 'enhanced'
            ? 'Enhances your input with structure and best practices.'
            : 'Completely reframes your input with AI enhancements and expert additions.'}
      </p>
    </div>
  );
};

export default PromptTuningModes;
