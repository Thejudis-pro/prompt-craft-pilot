
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import PresetSelector from './PresetSelector';
import { PromptTemplate } from '../lib/promptTemplates';
import { generatePrompt } from '../lib/generatePrompt';

interface PromptFormProps {
  onGeneratePrompt: (prompt: string) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGeneratePrompt }) => {
  const [purpose, setPurpose] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState<string[]>(['', '', '']);
  const [design, setDesign] = useState('');
  const [tech, setTech] = useState('');

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    if (features.length < 5) {
      setFeatures([...features, '']);
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = generatePrompt({
      purpose,
      audience,
      features,
      design,
      tech
    });
    onGeneratePrompt(prompt);
  };

  const handleSelectPreset = (template: PromptTemplate) => {
    setPurpose('Build a new application');
    setAudience('Developers and designers');
    setFeatures(['Feature one', 'Feature two', 'Feature three']);
    setDesign('Modern, clean interface');
    setTech('React, Tailwind CSS');
  };

  return (
    <Card className="glass-card w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <PresetSelector onSelectPreset={handleSelectPreset} />
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Project Purpose
              </label>
              <Input 
                placeholder="What are you building?" 
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
                className={purpose ? "" : "placeholder:text-muted-foreground/50"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Audience
              </label>
              <Input 
                placeholder="Who will use your application?" 
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                required
                className={audience ? "" : "placeholder:text-muted-foreground/50"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Core Features (3-5)
              </label>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Feature ${index + 1}`}
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      required={index < 3}
                      className={feature ? "" : "placeholder:text-muted-foreground/50"}
                    />
                    {index >= 3 && (
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                ))}
                {features.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddFeature}
                    className="w-full"
                  >
                    Add Feature
                  </Button>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Style or Design Preferences
              </label>
              <Textarea 
                placeholder="Describe your desired look and feel" 
                value={design}
                onChange={(e) => setDesign(e.target.value)}
                required
                className={`min-h-[80px] ${design ? "" : "placeholder:text-muted-foreground/50"}`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Tech Stack or AI Tool (Optional)
              </label>
              <Input 
                placeholder="E.g., React, Next.js, or specific AI tools" 
                value={tech}
                onChange={(e) => setTech(e.target.value)}
                className={tech ? "" : "placeholder:text-muted-foreground/50"}
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Generate Prompt
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptForm;
