
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSecureApi } from '@/lib/secure-api';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash, Copy, ArrowLeft, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateCSRFToken } from '@/lib/csrf';

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

const SavedPrompts = () => {
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
        const { data, error } = await executeSecure('fetch_prompts', () => 
          supabase
            .from('saved_prompts')
            .select('*')
            .order('created_at', { ascending: false })
        );

        if (error) throw error;
        setPrompts(data || []);
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
    if (localStorage.getItem('csrf_token') !== csrfToken) {
      toast({
        title: "Security error",
        description: "Invalid request token. Please try again.",
        variant: "destructive",
      });
      setDeleteDialogOpen(false);
      return;
    }
    
    try {
      const { error } = await executeSecure('delete_prompt', () => 
        supabase
          .from('saved_prompts')
          .delete()
          .eq('id', promptToDelete)
      );

      if (error) throw error;
      
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Saved Prompts</CardTitle>
              <CardDescription>Your previously saved prompts</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">Loading your prompts...</div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
                <p className="text-destructive mt-2">{error}</p>
                <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
              </div>
            ) : prompts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You haven't saved any prompts yet</p>
                <Button onClick={() => navigate('/')}>Create a Prompt</Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prompts.map((prompt) => (
                      <TableRow key={prompt.id}>
                        <TableCell className="font-medium">
                          {/* Escape any HTML to prevent XSS */}
                          {prompt.name.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </TableCell>
                        <TableCell>
                          {prompt.purpose.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
                        </TableCell>
                        <TableCell>
                          {new Date(prompt.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCopy(prompt.generated_prompt)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => confirmDelete(prompt.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              prompt from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SavedPrompts;
