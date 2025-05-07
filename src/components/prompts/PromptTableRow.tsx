
import React, { useState } from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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

interface PromptTableRowProps {
  prompt: SavedPrompt;
  onCopy: (prompt: string) => void;
  onDelete: (id: string) => void;
}

const PromptTableRow: React.FC<PromptTableRowProps> = ({ prompt, onCopy, onDelete }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Format date in a readable format
  const formattedDate = prompt.created_at 
    ? format(new Date(prompt.created_at), 'MMM d, yyyy')
    : 'Unknown date';

  return (
    <TableRow key={prompt.id}>
      <TableCell className="font-medium">{prompt.name}</TableCell>
      <TableCell>{prompt.purpose}</TableCell>
      <TableCell>{formattedDate}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Popover open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96 max-h-96 overflow-y-auto">
              <div>
                <h3 className="font-semibold mb-2">{prompt.name}</h3>
                <div className="text-sm text-muted-foreground mb-1">Purpose: {prompt.purpose}</div>
                <div className="text-sm text-muted-foreground mb-1">Audience: {prompt.audience}</div>
                <div className="bg-secondary/30 p-2 rounded-md mt-2">
                  <pre className="text-xs whitespace-pre-wrap">{prompt.generated_prompt}</pre>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onCopy(prompt.generated_prompt)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(prompt.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PromptTableRow;
