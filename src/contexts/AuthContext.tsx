
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

// Define the User type
interface User {
  id: string;
  email: string;
}

// Define the AuthContext type
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

// Create the AuthContext with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider props type
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for existing session on component mount
  useEffect(() => {
    // Check if there's a user in local storage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  // Sign in function
  const signIn = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock authentication - in a real app, this would call an authentication API
      if (email && password) {
        // Simulate auth validation
        if (password.length < 8) {
          throw new Error('Invalid credentials');
        }

        // Create a mock user
        const newUser = {
          id: 'user-' + Date.now(),
          email: email,
        };

        // Store user in state and localStorage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        toast({
          title: 'Success',
          description: 'You are now signed in',
        });
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in';
      toast({
        variant: 'destructive',
        title: 'Error signing in',
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      // Mock registration - in a real app, this would call a registration API
      if (email && password) {
        // Create a mock user
        const newUser = {
          id: 'user-' + Date.now(),
          email: email,
        };

        // Store user in state and localStorage
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));

        toast({
          title: 'Account created',
          description: 'Your account has been created and you are now signed in',
        });
      } else {
        throw new Error('Email and password are required');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create account';
      toast({
        variant: 'destructive',
        title: 'Error creating account',
        description: errorMessage,
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async (): Promise<void> => {
    setLoading(true);
    try {
      // Clear user from state and localStorage
      setUser(null);
      localStorage.removeItem('user');
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully',
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error signing out',
        description: 'Failed to sign out',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
