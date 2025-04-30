
import React, { useState } from 'react';
import Header from '@/components/Header';
import PromptForm from '@/components/PromptForm';
import PromptOutput from '@/components/PromptOutput';

const Index = () => {
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleGeneratePrompt = (prompt: string) => {
    setGeneratedPrompt(prompt);
    
    // Scroll to the output section if on mobile
    if (window.innerWidth < 768) {
      setTimeout(() => {
        document.getElementById('output-section')?.scrollIntoView({ 
          behavior: 'smooth' 
        });
      }, 100);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-2">
            Craft the perfect prompts for AI tools
          </h2>
          <p className="text-muted-foreground">
            Use PromptPilot to generate effective prompts for Lovable, Cursor, Cody, and other AI coding assistants.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="flex flex-col space-y-6">
            <PromptForm onGeneratePrompt={handleGeneratePrompt} />
          </div>
          
          <div id="output-section" className="flex flex-col space-y-6">
            {generatedPrompt ? (
              <PromptOutput prompt={generatedPrompt} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center p-8 border border-dashed border-muted-foreground/20 rounded-lg">
                  <p className="text-muted-foreground">
                    Fill out the form and generate your prompt to see the results here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t border-border/10">
        <div className="container">
          <p className="text-center text-sm text-muted-foreground">
            PromptPilot - Create better prompts for AI coding tools
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
