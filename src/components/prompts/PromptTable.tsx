
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import PromptTableRow from './PromptTableRow';

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

interface PromptTableProps {
  prompts: SavedPrompt[];
  onCopy: (prompt: string) => void;
  onDelete: (id: string) => void;
}

const PromptTable: React.FC<PromptTableProps> = ({ prompts, onCopy, onDelete }) => {
  return (
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
            <PromptTableRow 
              key={prompt.id} 
              prompt={prompt} 
              onCopy={onCopy} 
              onDelete={onDelete} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PromptTable;
