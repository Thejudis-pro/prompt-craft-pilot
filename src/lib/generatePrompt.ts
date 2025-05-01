
interface PromptInputs {
  purpose: string;
  audience: string;
  features: string[];
  design: string;
  tech?: string;
  enhancementMode: 'minimal' | 'enhanced' | 'advanced';
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
  } else if (enhancementMode === 'enhanced') {
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
  } else {
    // Advanced mode - create a highly detailed prompt with expert insights and AI-enhanced suggestions
    let prompt = `# Comprehensive Project Specification: Advanced ${purpose}\n\n`;
    
    // Add project context and vision
    prompt += `## Project Vision\n`;
    prompt += `Create a cutting-edge ${purpose} that delivers exceptional value to ${audience} through intuitive design and powerful functionality. This solution should stand out in the market by prioritizing user experience, performance, and innovation.\n\n`;
    
    // Detailed audience analysis
    prompt += `## Target Audience Analysis\n`;
    prompt += `The primary users will be ${audience}, who typically require:\n`;
    prompt += `- Intuitive interfaces that respect their technical proficiency\n`;
    prompt += `- Solutions to specific pain points in their workflow/daily activities\n`;
    prompt += `- Reliable performance across their preferred devices and contexts\n`;
    prompt += `- Trust signals and clear value propositions\n\n`;
    
    // Enhanced features with rationale and implementation details
    prompt += `## Feature Specification\n`;
    prompt += `Implement these core features with attention to both functionality and user experience:\n\n`;
    
    // Transform basic features into detailed requirements
    const advancedFeatures = features
      .filter(feature => feature.trim() !== '')
      .map(feature => {
        return `### ${feature.trim()}\n` +
               `- **Rationale**: Essential for user satisfaction and product completeness\n` +
               `- **Implementation Priority**: High\n` +
               `- **Success Criteria**: Users can efficiently complete their goals with minimal friction\n` +
               `- **Technical Considerations**: Ensure performance optimization and data integrity\n`;
      })
      .join('\n');
    
    prompt += advancedFeatures + '\n';
    
    // Architecture and technology recommendations
    prompt += `## Technical Architecture\n\n`;
    
    if (tech && tech.trim() !== '') {
      prompt += `### Primary Technology Stack\n`;
      prompt += `Implement using ${tech} with these architectural principles:\n`;
      prompt += `- Component-based architecture for maximum reusability and maintenance\n`;
      prompt += `- Clear separation of concerns (data, presentation, business logic)\n`;
      prompt += `- Optimized state management to minimize rerenders and data fetching\n`;
      prompt += `- Comprehensive error handling and graceful degradation\n\n`;
    } else {
      prompt += `### Recommended Technology Stack\n`;
      prompt += `Based on the requirements, consider these technologies:\n`;
      prompt += `- **Frontend**: Modern React with TypeScript and Tailwind CSS for rapid, type-safe development\n`;
      prompt += `- **Backend**: Node.js with Express or Next.js API routes for JavaScript consistency\n`;
      prompt += `- **Database**: SQL or NoSQL based on data structure requirements (MongoDB for flexible schemas, PostgreSQL for relational data)\n`;
      prompt += `- **State Management**: React Query for server state, Context API or Zustand for client state\n\n`;
    }
    
    // Advanced design system recommendations
    prompt += `## Design System Specification\n`;
    prompt += `${advancedDesignLanguage(design)}\n\n`;
    
    // Quality assurance and testing strategy
    prompt += `## Quality Assurance\n`;
    prompt += `- Implement comprehensive test coverage (unit, integration, and E2E)\n`;
    prompt += `- Ensure cross-browser and cross-device compatibility\n`;
    prompt += `- Validate accessibility compliance to WCAG 2.1 AA standards\n`;
    prompt += `- Perform security assessment for common vulnerabilities\n\n`;
    
    // Implementation roadmap
    prompt += `## Implementation Roadmap\n`;
    prompt += `1. **Core Infrastructure**: Setup project architecture and essential dependencies\n`;
    prompt += `2. **MVP Features**: Implement critical user journey features\n`;
    prompt += `3. **Refinement**: Enhance UX/UI based on heuristic evaluation\n`;
    prompt += `4. **Extended Functionality**: Add secondary features and optimizations\n`;
    prompt += `5. **Launch Preparation**: Final testing, documentation, and deployment preparation\n\n`;
    
    // Final instruction with elevated expectations
    prompt += `Please develop this application with exceptional attention to detail. The implementation should reflect best-in-class development practices, emphasizing code quality, performance, and user experience excellence.`;
    
    return prompt;
  }
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

// Advanced design language function for the 'advanced' mode
function advancedDesignLanguage(designInput: string): string {
  const lowerDesign = designInput.toLowerCase();
  
  // Expanded translations with detailed design system recommendations
  if (lowerDesign.includes('modern')) {
    return `Implement a comprehensive design system with these specifications:
    
- **Color Palette**: 
  - Primary: #3B82F6 (blue-500)
  - Secondary: #10B981 (emerald-500)
  - Neutrals: #F9FAFB to #1F2937 (gray-50 to gray-800)
  - Accents: #8B5CF6 (violet-500) for highlights
  
- **Typography**:
  - Primary Font: Inter (sans-serif) for clean readability
  - Headings: 700 weight, -0.025em letter-spacing
  - Body: 400 weight, 16px base size, 1.5 line-height
  - Type Scale: 1.25 ratio (major third)
  
- **Component Design**:
  - Rounded corners: 0.375rem (6px)
  - Shadow system: 3 levels (sm, md, lg) with subtle elevation
  - State indicators: Subtle transitions (150ms ease-in-out)
  - Iconography: Consistent weight (1.5px stroke) and style

- **Layout System**:
  - 8px grid system
  - Responsive breakpoints: mobile (< 640px), tablet (< 1024px), desktop (≥ 1024px)
  - Container-based layout with max-width constraint
  - Card-based content organization with consistent padding (16px/24px)`;
  } else if (lowerDesign.includes('fun') || lowerDesign.includes('playful')) {
    return `Implement a vibrant, engaging design system with these specifications:
    
- **Color Palette**: 
  - Primary: #FF6B6B (bright coral)
  - Secondary: #4ECDC4 (turquoise)
  - Accent: #FFD166 (mellow yellow)
  - Supporting: #6B76FF (periwinkle), #FF9BD2 (pink)
  - Neutrals: Warm whites and soft grays
  
- **Typography**:
  - Primary Font: Poppins for friendly, open letterforms
  - Headings: 600 weight with slightly increased tracking
  - Body: 400 weight, 16px base size, 1.6 line-height
  - Accent Font: Possibly handwritten style for emphasis elements
  
- **Component Design**:
  - Generous rounded corners (10px+)
  - Playful drop shadows with subtle colored offsets
  - Micro-animations on interactive elements (hover, click)
  - Custom illustrated icons with consistent playful style
  - Gradient accents for emphasis areas

- **Layout Elements**:
  - Asymmetrical layouts with intentional imbalance
  - Overlapping elements to create depth
  - Organic shapes as decorative elements
  - Animation-rich transitions between states
  - Bold section dividers`;
  } else if (lowerDesign.includes('professional') || lowerDesign.includes('corporate')) {
    return `Implement a sophisticated professional design system with these specifications:
    
- **Color Palette**: 
  - Primary: #0F172A (slate-900)
  - Secondary: #334155 (slate-700)
  - Accent: #0EA5E9 (sky-500) used sparingly
  - Alert Colors: Standard semantic colors for error, warning, success
  - Charts/Data: Carefully selected distinguishable hues
  
- **Typography**:
  - Primary Font: Inter or SF Pro Display
  - Headings: 600 weight, tight tracking, reduced line height (1.2)
  - Body: 400 weight, 16px base size, 1.5 line height
  - Supporting Text: 14px with 400 weight for captions/labels
  
- **Component Design**:
  - Subdued corners (4px radius)
  - Subtle shadow hierarchy (3-4 levels maximum)
  - Conservative animation (quick, purposeful transitions)
  - Monochromatic iconography with consistent weight
  - Clear boundaries between interactive regions

- **Layout System**:
  - Strong grid adherence with visible alignment
  - Information density appropriate to user expertise
  - Strategic use of whitespace to group related information
  - Clear visual hierarchy emphasizing key actions/information
  - Consistent navigation patterns across all sections`;
  } else if (lowerDesign.includes('minimal') || lowerDesign.includes('clean')) {
    return `Implement a refined minimalist design system with these specifications:
    
- **Color Palette**: 
  - Primary: #000000 (pure black)
  - Secondary: #FFFFFF (pure white)
  - Accent: Single distinctive color used sparingly (#FF0000 or #3B82F6)
  - No more than 3-4 colors total including neutrals
  
- **Typography**:
  - Single typeface family (SF Pro, Inter, or Helvetica Neue)
  - Limited weight variation (perhaps only Regular and Bold)
  - Consistent type scale with golden ratio (1.618)
  - Generous line height (1.5-1.8) for optimal readability
  
- **Component Design**:
  - Minimal or no corner radius
  - No shadows or very subtle elevation indicators
  - Thin dividing lines (1px) when necessary
  - Button styling through minimal indicators
  - Strategic negative space as a design element

- **Layout System**:
  - Strict grid with obvious alignment
  - Dramatic whitespace use (more than conventional UIs)
  - Content-focused presentation with minimal decoration
  - Careful typographic hierarchy substituting for visual elements
  - Hidden functionality that appears only when needed`;
  } else {
    // For custom design descriptions, provide comprehensive enhancement
    return `Develop a distinctive design system that embodies "${designInput}" with these technical specifications:

- **Custom Color Palette**: Carefully selected colors that reflect the essence of ${designInput}, with proper contrast ratios for accessibility (minimum 4.5:1 for normal text)

- **Typography System**: 
  - Select fonts that enhance the ${designInput} aesthetic
  - Implement responsive type scaling (fluid typography)
  - Ensure consistent vertical rhythm throughout
  - Maintain proper hierarchy through weight, size, and spacing

- **Component Library**:
  - Develop consistent interactive elements with distinctive ${designInput} styling
  - Create unified form controls with clear focus and error states
  - Design card and container components with appropriate depth and emphasis
  - Implement subtle animations that enhance rather than distract

- **Layout Framework**:
  - Responsive grid system with appropriate breakpoints
  - Consistent spacing system using relative units
  - Intentional content organization prioritizing user goals
  - Strategic use of negative space to improve comprehension`;
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
