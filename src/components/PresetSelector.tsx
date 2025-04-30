
import React from 'react';
import { promptTemplates, PromptTemplate } from '../lib/promptTemplates';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface PresetSelectorProps {
  onSelectPreset: (template: PromptTemplate) => void;
}

const PresetSelector: React.FC<PresetSelectorProps> = ({ onSelectPreset }) => {
  const handleSelectChange = (value: string) => {
    const selectedTemplate = promptTemplates.find(template => template.id === value);
    if (selectedTemplate) {
      onSelectPreset(selectedTemplate);
    }
  };

  return (
    <div className="w-full mb-6">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          Start with a template
        </label>
        <Select onValueChange={handleSelectChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a template" />
          </SelectTrigger>
          <SelectContent>
            {promptTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex flex-col">
                  <span>{template.name}</span>
                  <span className="text-xs text-muted-foreground">{template.description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default PresetSelector;
