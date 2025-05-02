
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bookmark, LogOut, LogIn, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { generateCSRFToken } from '@/lib/csrf';

const Header = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  const handleLogoutClick = () => {
    // Generate CSRF token for logout action
    setCsrfToken(generateCSRFToken());
    setLogoutDialogOpen(true);
  };

  const handleSignOut = async () => {
    // Validate CSRF token
    if (localStorage.getItem('csrf_token') === csrfToken) {
      await signOut();
      navigate('/');
    } else {
      console.error("CSRF token validation failed");
      // Still sign out but log the security event
      await signOut();
      navigate('/');
    }
    setLogoutDialogOpen(false);
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
                onClick={handleLogoutClick}
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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will need to sign in again to access your saved prompts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSignOut}>Sign Out</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Header;
