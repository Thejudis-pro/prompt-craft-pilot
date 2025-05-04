
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface SavedPrompt {
  id: string;
  name: string;
  purpose: string;
  audience: string;
  features: string[];
  design: string;
  tech: string | null;
  enhancement_mode: string;
  generated_prompt: string;
  created_at: string;
}

export function useSavedPrompts() {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Local state for dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Get prompts from localStorage
        const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
        setPrompts(savedPrompts);
      } catch (error: any) {
        console.error("Error fetching prompts:", error);
        setError(error.message || "Failed to load saved prompts");
        toast({
          title: "Error",
          description: error.message || "Failed to load saved prompts",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [toast]);

  const confirmDelete = (id: string) => {
    setPromptToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!promptToDelete) return;
    
    try {
      // Delete from localStorage
      const savedPrompts = JSON.parse(localStorage.getItem('savedPrompts') || '[]');
      const updatedPrompts = savedPrompts.filter((prompt: SavedPrompt) => prompt.id !== promptToDelete);
      localStorage.setItem('savedPrompts', JSON.stringify(updatedPrompts));
      
      setPrompts(updatedPrompts);
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete prompt",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setPromptToDelete(null);
    }
  };

  const handleCopy = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast({
        title: "Copied to clipboard",
        description: "Prompt copied to clipboard successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy prompt to clipboard",
        variant: "destructive",
      });
    }
  };

  return {
    prompts,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    handleDelete,
    handleCopy,
    refreshPrompts: () => window.location.reload(),
  };
}
