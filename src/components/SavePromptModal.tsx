
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

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

  const handleSave = async () => {
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

    setIsSaving(true);

    try {
      const { error } = await supabase.from('saved_prompts').insert({
        user_id: user.id,
        name,
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
              onChange={(e) => setName(e.target.value)}
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
