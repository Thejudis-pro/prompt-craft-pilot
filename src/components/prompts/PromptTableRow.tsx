
import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Copy, Trash } from 'lucide-react';

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
  return (
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
            onClick={() => onCopy(prompt.generated_prompt)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(prompt.id)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PromptTableRow;
