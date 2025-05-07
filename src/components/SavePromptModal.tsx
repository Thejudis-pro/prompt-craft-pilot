
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface SavePromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promptData: {
    purpose: string;
    audience: string;
    features: string[];
    design: string;
    tech: string;
    enhancementMode: string;
    generatedPrompt: string;
  };
}

const SavePromptModal: React.FC<SavePromptModalProps> = ({
  open,
  onOpenChange,
  promptData,
}) => {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    // Basic input validation
    if (!name.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your prompt",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Save to localStorage
      const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
      savedPrompts.push({
        id: Date.now().toString(),
        name: name,
        purpose: promptData.purpose,
        audience: promptData.audience,
        features: promptData.features,
        design: promptData.design,
        tech: promptData.tech || null,
        enhancement_mode: promptData.enhancementMode,
        generated_prompt: promptData.generatedPrompt,
        created_at: new Date().toISOString()
      });
      localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
      
      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved successfully",
      });
      
      onOpenChange(false);
      setName(''); // Reset the form
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save prompt",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Handle input change with sanitization
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Limit input length to prevent abuse
    if (e.target.value.length <= 100) {
      setName(e.target.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Prompt</DialogTitle>
          <DialogDescription>
            Give your prompt a name to save it for future reference
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              placeholder="My awesome prompt"
              value={name}
              onChange={handleNameChange}
              maxLength={100}
              aria-label="Prompt name"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              setName('');
              onOpenChange(false);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavePromptModal;
