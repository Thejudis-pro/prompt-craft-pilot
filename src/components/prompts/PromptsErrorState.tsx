
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromptsErrorStateProps {
  error: string;
  onRetry: () => void;
}

const PromptsErrorState: React.FC<PromptsErrorStateProps> = ({ error, onRetry }) => {
  return (
    <div className="text-center py-8">
      <AlertCircle className="mx-auto h-8 w-8 text-destructive" />
      <p className="text-destructive mt-2">{error}</p>
      <Button onClick={onRetry} className="mt-4">Retry</Button>
    </div>
  );
};

export default PromptsErrorState;
