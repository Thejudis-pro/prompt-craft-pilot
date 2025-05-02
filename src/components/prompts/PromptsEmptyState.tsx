
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const PromptsEmptyState: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-8">
      <p className="text-muted-foreground mb-4">You haven't saved any prompts yet</p>
      <Button onClick={() => navigate('/')}>Create a Prompt</Button>
    </div>
  );
};

export default PromptsEmptyState;
