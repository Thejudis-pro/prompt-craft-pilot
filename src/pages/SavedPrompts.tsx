
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
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
import { Trash, Copy, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';

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
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const fetchPrompts = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_prompts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrompts(data || []);
      } catch (error: any) {
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
  }, [user, navigate, toast]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('saved_prompts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPrompts(prompts.filter(prompt => prompt.id !== id));
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
                        <TableCell className="font-medium">{prompt.name}</TableCell>
                        <TableCell>{prompt.purpose}</TableCell>
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
                              onClick={() => handleDelete(prompt.id)}
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
    </div>
  );
};

export default SavedPrompts;
