
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSecureApi } from '@/lib/secure-api';
import { generateCSRFToken, validateCSRFToken } from '@/lib/csrf';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { executeSecure } = useSecureApi();
  
  // CSRF and delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null);
  const [csrfToken, setCsrfToken] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchPrompts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fixed: Properly typing the supabase response
        const response = await executeSecure<{ data: SavedPrompt[] | null, error: Error | null }>('fetch_prompts', () => {
          return supabase
            .from('saved_prompts')
            .select('*')
            .order('created_at', { ascending: false });
        });

        if (response.error) throw response.error;
        setPrompts(response.data || []);
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
  }, [user, navigate, toast, executeSecure]);

  const confirmDelete = (id: string) => {
    setPromptToDelete(id);
    setCsrfToken(generateCSRFToken());
    setDeleteDialogOpen(true);
  };
  
  const handleDelete = async () => {
    if (!promptToDelete) return;
    
    // Validate CSRF token
    if (!validateCSRFToken(csrfToken)) {
      toast({
        title: "Security error",
        description: "Invalid request token. Please try again.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      return;
    }
    
    try {
      // Fixed: Properly typing the supabase response
      const response = await executeSecure<{ error: Error | null }>('delete_prompt', () => {
        return supabase
          .from('saved_prompts')
          .delete()
          .eq('id', promptToDelete);
      });

      if (response.error) throw response.error;
      
      setPrompts(prompts.filter(prompt => prompt.id !== promptToDelete));
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
