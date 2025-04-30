
import React from 'react';
import { LayoutDashboard } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-primary/20 p-2 rounded-md">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">PromptPilot</h1>
            <p className="text-xs text-muted-foreground">
              Craft perfect prompts for AI coding tools
            </p>
          </div>
        </div>
        <div>
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </header>
  );
};

export default Header;
