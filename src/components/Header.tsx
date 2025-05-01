
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark, LogOut, LogIn } from 'lucide-react';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold">
          PromptPilot
        </Link>
        
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/saved-prompts')}
                className="flex items-center gap-1"
              >
                <Bookmark className="w-4 h-4" />
                <span className="hidden md:inline">Saved Prompts</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-1"
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">Sign In</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
