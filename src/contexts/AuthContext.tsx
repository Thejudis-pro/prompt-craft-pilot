import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

// Define types for security related actions and events
type SecurityEventType = 'login_success' | 'login_failed' | 'signup_success' | 'signup_failed' | 'logout';

interface SecurityEvent {
  type: SecurityEventType;
  timestamp: Date;
  metadata?: Record<string, any>;
}

type AuthContextType = {
  user: User | null;
  session: Session | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a secure log of security events
const logSecurityEvent = (event: SecurityEvent): void => {
  const existingLogs = JSON.parse(localStorage.getItem('security_logs') || '[]');
  // Keep only the last 50 events to prevent storage overflow
  const updatedLogs = [...existingLogs, event].slice(-50);
  localStorage.setItem('security_logs', JSON.stringify(updatedLogs));
  
  // Log to console in development environment only
  if (import.meta.env.DEV) {
    console.info('Security event:', event);
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        
        // Log auth events
        if (event === 'SIGNED_IN') {
          logSecurityEvent({
            type: 'login_success',
            timestamp: new Date(),
            metadata: { userId: currentSession?.user?.id }
          });
        } else if (event === 'SIGNED_OUT') {
          logSecurityEvent({
            type: 'logout',
            timestamp: new Date()
          });
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Implement secure session timeout
  useEffect(() => {
    if (session) {
      // Auto logout after 30 minutes of inactivity
      let inactivityTimer: number;
      
      const resetInactivityTimer = () => {
        window.clearTimeout(inactivityTimer);
        inactivityTimer = window.setTimeout(async () => {
          toast({
            title: "Session expired",
            description: "You've been logged out due to inactivity",
          });
          await supabase.auth.signOut();
        }, 30 * 60 * 1000); // 30 minutes
      };
      
      // Initial timer setup
      resetInactivityTimer();
      
      // Reset timer on user activity
      const activityEvents = ['mousedown', 'keypress', 'scroll', 'touchstart'];
      activityEvents.forEach(event => {
        window.addEventListener(event, resetInactivityTimer);
      });
      
      return () => {
        window.clearTimeout(inactivityTimer);
        activityEvents.forEach(event => {
          window.removeEventListener(event, resetInactivityTimer);
        });
      };
    }
  }, [session, toast]);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        logSecurityEvent({
          type: 'signup_failed',
          timestamp: new Date(),
          metadata: { email, error: error.message }
        });
        throw error;
      }
      
      logSecurityEvent({
        type: 'signup_success',
        timestamp: new Date(),
        metadata: { email }
      });
      
      toast({
        title: "Account created",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        logSecurityEvent({
          type: 'login_failed',
          timestamp: new Date(),
          metadata: { email, error: error.message }
        });
        throw error;
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    user,
    session,
    signUp,
    signIn,
    signOut,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
