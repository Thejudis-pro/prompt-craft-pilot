
interface PromptInputs {
  purpose: string;
  audience: string;
  features: string[];
  design: string;
  tech?: string;
}

export function generatePrompt(inputs: PromptInputs): string {
  const { purpose, audience, features, design, tech } = inputs;
  
  // Format features as bullet points
  const formattedFeatures = features
    .filter(feature => feature.trim() !== '')
    .map(feature => `- ${feature.trim()}`)
    .join('\n');
  
  // Build the prompt with sections
  let prompt = `# Project Brief: ${purpose}\n\n`;
  prompt += `## Target Audience\n${audience}\n\n`;
  prompt += `## Core Features\n${formattedFeatures}\n\n`;
  prompt += `## Design Preferences\n${design}\n\n`;
  
  // Add tech stack if provided
  if (tech && tech.trim() !== '') {
    prompt += `## Technology Stack\n${tech}\n\n`;
  }
  
  // Add final instruction
  prompt += `Create a web application with these specifications. Focus on clean code, responsive design, and intuitive user experience.`;
  
  return prompt;
}
