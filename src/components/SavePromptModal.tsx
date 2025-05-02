
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
import { useAuth } from '@/contexts/AuthContext';
import { securePromptSave, sanitizeInput } from '@/lib/secure-api';

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
  const { user } = useAuth();

  // Rate limiting
  const [lastSaveAttempt, setLastSaveAttempt] = useState(0);
  const SAVE_COOLDOWN_MS = 2000; // 2 seconds between save attempts

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

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save prompts",
        variant: "destructive",
      });
      return;
    }

    // Apply rate limiting
    const now = Date.now();
    if (now - lastSaveAttempt < SAVE_COOLDOWN_MS) {
      toast({
        title: "Too many requests",
        description: "Please wait before trying again",
        variant: "destructive",
      });
      return;
    }
    setLastSaveAttempt(now);

    setIsSaving(true);

    try {
      // Use the secure API wrapper
      const { error } = await securePromptSave({
        user_id: user.id,
        name: name,
        purpose: promptData.purpose,
        audience: promptData.audience,
        features: promptData.features,
        design: promptData.design,
        tech: promptData.tech || '',
        enhancement_mode: promptData.enhancementMode,
        generated_prompt: promptData.generatedPrompt,
      });

      if (error) throw error;

      toast({
        title: "Prompt saved",
        description: "Your prompt has been saved successfully",
      });
      onOpenChange(false);
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
            Give your prompt a name to save it to your account
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
