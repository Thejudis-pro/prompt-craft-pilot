
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
  
  // Create a more sophisticated prompt with specific sections and enhanced language
  let prompt = `# Project Brief: ${purpose}\n\n`;
  
  // Expand on the target audience with more context
  prompt += `## Target Audience\n`;
  prompt += `The primary users will be ${audience}. The application should be designed with their specific needs and technical proficiency in mind.\n\n`;
  
  // Add context to the features section
  prompt += `## Core Features\nThe application should implement these essential functionalities:\n${formattedFeatures}\n\n`;
  
  // Enhance design section with more specifics
  prompt += `## Design Specifications\nThe visual aesthetic should follow ${design} principles. Ensure the UI is intuitive, accessible, and provides clear visual hierarchy. The user experience should be seamless across all interactions.\n\n`;
  
  // Add tech stack with recommendations if provided
  if (tech && tech.trim() !== '') {
    prompt += `## Technology Implementation\nDevelop using ${tech} as the primary technology stack. Ensure best practices for this stack are followed, including proper architecture, code organization, and performance optimization.\n\n`;
  } else {
    prompt += `## Technology Recommendations\nSelect technologies that enable rapid development without sacrificing performance or scalability. Consider modern frameworks that facilitate responsive design and efficient state management.\n\n`;
  }
  
  // Add delivery expectations
  prompt += `## Development Guidelines\n`;
  prompt += `- Focus on clean, maintainable code architecture\n`;
  prompt += `- Ensure responsive behavior across all device sizes\n`;
  prompt += `- Implement appropriate error handling and user feedback\n`;
  prompt += `- Consider performance optimization from the beginning\n`;
  prompt += `- Follow accessibility best practices\n\n`;
  
  // Final instruction with timeline suggestion
  prompt += `Please develop this application with attention to these specifications. The implementation should prioritize user experience while maintaining code quality and performance.`;
  
  return prompt;
}
