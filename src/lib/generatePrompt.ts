
interface PromptInputs {
  purpose: string;
  audience: string;
  features: string[];
  design: string;
  tech?: string;
  enhancementMode: 'minimal' | 'enhanced';
}

export function generatePrompt(inputs: PromptInputs): string {
  const { purpose, audience, features, design, tech, enhancementMode } = inputs;
  
  // Format features as bullet points
  const formattedFeatures = features
    .filter(feature => feature.trim() !== '')
    .map(feature => `- ${feature.trim()}`)
    .join('\n');
  
  if (enhancementMode === 'minimal') {
    // Create a basic prompt with only user-provided information
    let prompt = `Build ${purpose} for ${audience}.\n\n`;
    prompt += `Features:\n${formattedFeatures}\n\n`;
    prompt += `Design: ${design}\n`;
    
    if (tech && tech.trim() !== '') {
      prompt += `Technology: ${tech}`;
    }
    
    return prompt;
  }
  
  // Enhanced mode - create a more sophisticated prompt with specific sections and enhanced language
  let prompt = `# Project Brief: ${purpose}\n\n`;
  
  // Expand on the target audience with more context
  prompt += `## Target Audience\n`;
  prompt += `The primary users will be ${audience}. The application should be designed with their specific needs and technical proficiency in mind.\n\n`;
  
  // Add context to the features section
  prompt += `## Core Features\nThe application should implement these essential functionalities:\n${formattedFeatures}\n\n`;
  
  // Enhance design section with more specifics and translate vague terms
  prompt += `## Design Specifications\n${translateDesignLanguage(design)}\n\n`;
  
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

// Function to translate vague design terms into specific guidance
function translateDesignLanguage(designInput: string): string {
  const lowerDesign = designInput.toLowerCase();
  
  // Basic translations for common design terms
  if (lowerDesign.includes('modern')) {
    return `The visual aesthetic should follow modern principles with clean lines, ample whitespace, and minimalist UI elements. Use a contemporary color palette with subtle shadows and smooth transitions. Ensure the UI is intuitive, accessible, and provides clear visual hierarchy.`;
  } else if (lowerDesign.includes('fun') || lowerDesign.includes('playful')) {
    return `Create a playful interface with vibrant colors (consider using #FEC6A1, #E5DEFF, #FFDEE2), rounded corners, and animated interactions. Use a friendly sans-serif font like Poppins or Quicksand. Incorporate subtle micro-animations to enhance user engagement while maintaining usability.`;
  } else if (lowerDesign.includes('professional') || lowerDesign.includes('corporate')) {
    return `Implement a professional aesthetic using a restrained color palette (navy blues, charcoal grays, with strategic accent colors). Utilize a clean grid layout with consistent spacing and alignment. Typography should be conservative (consider Helvetica, Inter or similar sans-serif fonts) with clear hierarchy and adequate contrast.`;
  } else if (lowerDesign.includes('minimal') || lowerDesign.includes('clean')) {
    return `Design with a minimalist approach focusing on essential elements only. Use generous whitespace, limited color palette (2-3 colors maximum), and restrained typography. Ensure visual balance through careful alignment and consistent UI patterns.`;
  } else {
    // For custom or undefined design descriptions, enhance what the user provided
    return `The visual aesthetic should follow ${designInput} principles. Ensure the UI is intuitive, accessible, and provides clear visual hierarchy. The user experience should be seamless across all interactions.`;
  }
}

// Function to suggest features based on project type and audience
export function suggestFeatures(purpose: string, audience: string): string[] {
  const purposeLower = purpose.toLowerCase();
  const audienceLower = audience.toLowerCase();
  
  const suggestions: string[] = [];
  
  // Suggestions based on purpose
  if (purposeLower.includes('ecommerce') || purposeLower.includes('shop') || purposeLower.includes('store')) {
    suggestions.push('Product catalog with filtering and search', 'Shopping cart and checkout flow', 'Order tracking system');
  } else if (purposeLower.includes('blog') || purposeLower.includes('content')) {
    suggestions.push('Content management system', 'Categorization and tagging', 'Comment section');
  } else if (purposeLower.includes('dashboard') || purposeLower.includes('analytics')) {
    suggestions.push('Data visualization components', 'Customizable widgets', 'Export functionality');
  } else if (purposeLower.includes('booking') || purposeLower.includes('reservation')) {
    suggestions.push('Calendar integration', 'Availability management', 'Notification system');
  } else if (purposeLower.includes('portfolio')) {
    suggestions.push('Project showcase gallery', 'Contact form', 'About/Bio section');
  } else if (purposeLower.includes('social') || purposeLower.includes('community')) {
    suggestions.push('User profiles', 'Friend/connection system', 'Activity feed');
  }
  
  // Suggestions based on audience
  if (audienceLower.includes('business') || audienceLower.includes('professional')) {
    suggestions.push('Team collaboration tools', 'Role-based access control');
  } else if (audienceLower.includes('creator') || audienceLower.includes('artist')) {
    suggestions.push('Media upload capability', 'Portfolio organization');
  } else if (audienceLower.includes('student') || audienceLower.includes('education')) {
    suggestions.push('Learning progress tracking', 'Resource library');
  } else if (audienceLower.includes('customer') || audienceLower.includes('client')) {
    suggestions.push('Customer support chat', 'Feedback collection system');
  }
  
  return suggestions;
}

// Function to suggest tech stack based on project requirements
export function suggestTechStack(purpose: string, features: string[]): string {
  const purposeLower = purpose.toLowerCase();
  const featuresText = features.join(' ').toLowerCase();
  
  // Check for indicators of project complexity and needs
  const needsRealtime = featuresText.includes('chat') || featuresText.includes('notification') || 
                         featuresText.includes('real-time') || featuresText.includes('live');
                         
  const needsDataVisualization = featuresText.includes('chart') || featuresText.includes('dashboard') || 
                                featuresText.includes('analytics') || featuresText.includes('graph');
                                
  const isContentFocused = purposeLower.includes('blog') || purposeLower.includes('cms') || 
                           purposeLower.includes('content');
                           
  const isMobileApp = purposeLower.includes('mobile') || purposeLower.includes('ios') || 
                     purposeLower.includes('android');
  
  // Generate suggestions based on indicators
  if (isMobileApp) {
    return 'React Native with Expo for cross-platform mobile development';
  } else if (needsRealtime) {
    return 'Next.js with Supabase for real-time features and authentication';
  } else if (needsDataVisualization) {
    return 'React with D3.js or Recharts for data visualization';
  } else if (isContentFocused) {
    return 'Next.js with a headless CMS like Sanity or Contentful';
  } else {
    return 'React with Tailwind CSS for rapid UI development';
  }
}
