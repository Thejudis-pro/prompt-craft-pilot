
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Clipboard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PromptOutputProps {
  prompt: string;
}

const PromptOutput: React.FC<PromptOutputProps> = ({ prompt }) => {
  const [editedPrompt, setEditedPrompt] = useState(prompt);
  const { toast } = useToast();

  // Update edited prompt when the input prompt changes
  React.useEffect(() => {
    setEditedPrompt(prompt);
  }, [prompt]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedPrompt);
    toast({
      title: "Copied to clipboard",
      description: "Your prompt is ready to use!",
    });
  };

  const handleDownload = () => {
    const blob = new Blob([editedPrompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded prompt",
      description: "Your prompt has been saved as a markdown file.",
    });
  };

  if (!prompt) {
    return null;
  }

  return (
    <Card className="glass-card w-full">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Generated Prompt</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline" 
                size="sm" 
                onClick={handleCopyToClipboard}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleDownload}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          <div className="bg-secondary/50 rounded-md p-4 overflow-x-auto">
            <pre className="whitespace-pre-wrap text-sm">{prompt}</pre>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Edit Prompt
            </label>
            <Textarea
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptOutput;
