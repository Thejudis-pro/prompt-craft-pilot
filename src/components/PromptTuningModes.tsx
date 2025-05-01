
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Sliders, Zap } from 'lucide-react';

interface PromptTuningModesProps {
  value: 'minimal' | 'enhanced';
  onChange: (value: 'minimal' | 'enhanced') => void;
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
          if (value) onChange(value as 'minimal' | 'enhanced');
        }}
        className="justify-start border rounded-md p-1 bg-white/5 backdrop-blur-sm"
      >
        <ToggleGroupItem value="minimal" className="flex items-center gap-1 text-xs data-[state=on]:bg-primary/20">
          <Zap className="h-3 w-3" />
          <span>Minimal</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="enhanced" className="flex items-center gap-1 text-xs data-[state=on]:bg-primary/20">
          <Sliders className="h-3 w-3" />
          <span>Enhanced</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <p className="text-xs text-white/60 mt-1">
        {value === 'minimal' 
          ? 'Outputs only what you entered without modifications.'
          : 'Enhances your input with structure and best practices.'}
      </p>
    </div>
  );
};

export default PromptTuningModes;
