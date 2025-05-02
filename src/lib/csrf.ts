
// Simple CSRF protection utility
import { v4 as uuidv4 } from 'uuid';

// Generate a CSRF token
export function generateCSRFToken(): string {
  const token = uuidv4();
  localStorage.setItem('csrf_token', token);
  return token;
}

// Validate a CSRF token
export function validateCSRFToken(token: string): boolean {
  const storedToken = localStorage.getItem('csrf_token');
  
  // One-time use: remove the token after validation
  if (storedToken) {
    localStorage.removeItem('csrf_token');
  }
  
  return token === storedToken;
}
