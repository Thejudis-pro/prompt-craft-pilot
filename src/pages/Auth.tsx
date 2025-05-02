
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { generateCSRFToken } from '@/lib/csrf';
import { useToast } from '@/hooks/use-toast';

// Enhanced password requirements
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
  csrfToken: z.string(),
});

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<Date | null>(null);
  const { toast } = useToast();

  // Generate CSRF token on component mount
  const [csrfToken, setCsrfToken] = useState('');
  
  useEffect(() => {
    setCsrfToken(generateCSRFToken());
  }, []);

  useEffect(() => {
    if (user) {
      navigate('/');
    }

    // Check lockout status
    const storedLockout = localStorage.getItem('auth_lockout');
    if (storedLockout) {
      const lockoutTime = new Date(storedLockout);
      if (lockoutTime > new Date()) {
        setLockoutUntil(lockoutTime);
      } else {
        // Lockout expired
        localStorage.removeItem('auth_lockout');
        setLoginAttempts(0);
      }
    }
  }, [user, navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      csrfToken: csrfToken,
    },
  });

  // Update the form values when CSRF token changes
  useEffect(() => {
    form.setValue('csrfToken', csrfToken);
  }, [csrfToken, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // Check if account is locked
    if (lockoutUntil && lockoutUntil > new Date()) {
      const minutesLeft = Math.ceil((lockoutUntil.getTime() - new Date().getTime()) / (60 * 1000));
      toast({
        variant: "destructive",
        title: "Account temporarily locked",
        description: `Too many failed attempts. Try again in ${minutesLeft} minutes.`
      });
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === "login") {
        await signIn(data.email, data.password);
        // Reset attempts on success
        setLoginAttempts(0);
        localStorage.removeItem('auth_lockout');
      } else {
        await signUp(data.email, data.password);
      }
    } catch (error) {
      console.error("Authentication error:", error);
      
      if (activeTab === "login") {
        // Increase login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Implement account lockout after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutTime = new Date();
          lockoutTime.setMinutes(lockoutTime.getMinutes() + 15); // 15 minute lockout
          setLockoutUntil(lockoutTime);
          localStorage.setItem('auth_lockout', lockoutTime.toISOString());
          
          toast({
            variant: "destructive",
            title: "Account temporarily locked",
            description: "Too many failed attempts. Try again in 15 minutes."
          });
        }
      }
    } finally {
      setIsLoading(false);
      // Generate a new CSRF token for the next attempt
      setCsrfToken(generateCSRFToken());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="glass-card w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle className="text-center">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lockoutUntil && lockoutUntil > new Date() ? (
            <div className="text-center p-4">
              <p className="text-destructive font-medium">Account temporarily locked</p>
              <p className="text-muted-foreground">
                Too many failed login attempts. Please try again later.
              </p>
            </div>
          ) : (
            <Tabs 
              value={activeTab} 
              onValueChange={(value) => setActiveTab(value as "login" | "signup")}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="signup">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="your.email@example.com" {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} autoComplete="new-password" />
                          </FormControl>
                          <FormMessage className="text-sm">
                            Password must be at least 8 characters with uppercase, lowercase, number, and special character
                          </FormMessage>
                        </FormItem>
                      )}
                    />
                    <input type="hidden" name="csrfToken" value={csrfToken} />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
