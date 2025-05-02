import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Rate limiting configuration
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Default rate limits for different operations
const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  'prompt_save': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
  'prompt_generation': { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute
  'auth': { maxRequests: 5, windowMs: 60 * 1000 }, // 5 per minute
  'fetch_prompts': { maxRequests: 20, windowMs: 60 * 1000 }, // 20 per minute
  'delete_prompt': { maxRequests: 10, windowMs: 60 * 1000 }, // 10 per minute
};

// Track operation counts
const operationCounts: Record<string, { count: number, resetTime: number }> = {};

// Check if operation is allowed by rate limit
function checkRateLimit(operationType: string): boolean {
  const config = DEFAULT_RATE_LIMITS[operationType] || { maxRequests: 30, windowMs: 60 * 1000 };
  const now = Date.now();
  
  if (!operationCounts[operationType] || operationCounts[operationType].resetTime < now) {
    // First request or reset window
    operationCounts[operationType] = { count: 1, resetTime: now + config.windowMs };
    return true;
  } else if (operationCounts[operationType].count < config.maxRequests) {
    // Increment count
    operationCounts[operationType].count += 1;
    return true;
  }
  
  return false;
}

// Sanitize input to prevent XSS and injection attacks
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/\//g, '&#x2F;');
}

// Secure API wrapper for saving prompts
export async function securePromptSave(promptData: any) {
  // Check rate limit
  if (!checkRateLimit('prompt_save')) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
  // Sanitize text inputs to prevent XSS
  const sanitizedData = {
    ...promptData,
    name: sanitizeInput(promptData.name),
    purpose: sanitizeInput(promptData.purpose),
    audience: sanitizeInput(promptData.audience),
    design: sanitizeInput(promptData.design),
    tech: promptData.tech ? sanitizeInput(promptData.tech) : null,
    generated_prompt: sanitizeInput(promptData.generated_prompt),
  };
  
  // Basic validation
  if (!sanitizedData.name || !sanitizedData.purpose || !sanitizedData.audience) {
    throw new Error("Missing required fields");
  }
  
  // Insert with Supabase
  return supabase.from('saved_prompts').insert(sanitizedData);
}

// Secure API wrapper for fetching prompts
export async function securePromptFetch() {
  // Check rate limit
  if (!checkRateLimit('prompt_fetch')) {
    throw new Error("Rate limit exceeded. Please try again later.");
  }
  
  // Fetch using Supabase
  return supabase
    .from('saved_prompts')
    .select('*')
    .order('created_at', { ascending: false });
}

// Hook for secure API operations with proper error handling
export function useSecureApi() {
  const { toast } = useToast();
  
  const executeSecure = async <T,>(operationType: string, operation: () => Promise<T> | any): Promise<T> => {
    try {
      // Check rate limit
      if (!checkRateLimit(operationType)) {
        toast({
          title: "Too many requests",
          description: "Please slow down and try again later.",
          variant: "destructive",
        });
        throw new Error("Rate limit exceeded");
      }
      
      // Execute the operation - handle both Promise and non-Promise returns
      const result = operation();
      
      // If the result is already a Promise, return it
      if (result instanceof Promise) {
        return result;
      }
      
      // If it's a Supabase query builder (has .then but is not a Promise), convert to Promise
      if (typeof result?.then === 'function') {
        return new Promise<T>((resolve, reject) => {
          result.then(resolve).catch(reject);
        });
      }
      
      // Otherwise, wrap in Promise
      return Promise.resolve(result as T);
      
    } catch (error: any) {
      // Log the error
      console.error(`Error in ${operationType}:`, error);
      
      toast({
        title: "Operation failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      
      return Promise.reject(error);
    }
  };
  
  return { executeSecure };
}
