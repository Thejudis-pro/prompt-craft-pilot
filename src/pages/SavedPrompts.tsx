
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import PromptTable from '@/components/prompts/PromptTable';
import DeletePromptDialog from '@/components/prompts/DeletePromptDialog';
import PromptsErrorState from '@/components/prompts/PromptsErrorState';
import PromptsEmptyState from '@/components/prompts/PromptsEmptyState';
import { useSavedPrompts } from '@/hooks/useSavedPrompts';

const SavedPrompts = () => {
  const navigate = useNavigate();
  const {
    prompts,
    loading,
    error,
    deleteDialogOpen,
    setDeleteDialogOpen,
    confirmDelete,
    handleDelete,
    handleCopy,
    refreshPrompts,
  } = useSavedPrompts();

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
              <PromptsErrorState error={error} onRetry={refreshPrompts} />
            ) : prompts.length === 0 ? (
              <PromptsEmptyState />
            ) : (
              <PromptTable 
                prompts={prompts} 
                onCopy={handleCopy} 
                onDelete={confirmDelete}
              />
            )}
          </CardContent>
        </Card>
      </main>
      
      <DeletePromptDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default SavedPrompts;
