import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb, Text, Layout, Pencil } from 'lucide-react';
import PresetSelector from './PresetSelector';
import PromptTuningModes from './PromptTuningModes';
import SmartSuggestions from './SmartSuggestions';
import { PromptTemplate } from '../lib/promptTemplates';
import { generatePrompt, suggestFeatures, suggestTechStack } from '../lib/generatePrompt';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface FormData {
  purpose: string;
  audience: string;
  features: string[];
  design: string;
  tech: string;
  enhancementMode: 'minimal' | 'enhanced' | 'advanced';
}

interface PromptFormProps {
  onGeneratePrompt: (prompt: string, data: FormData) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({ onGeneratePrompt }) => {
  const [purpose, setPurpose] = useState('');
  const [audience, setAudience] = useState('');
  const [features, setFeatures] = useState<string[]>(['', '', '']);
  const [design, setDesign] = useState('');
  const [tech, setTech] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isCustomTemplate, setIsCustomTemplate] = useState(false);
  const [enhancementMode, setEnhancementMode] = useState<'minimal' | 'enhanced' | 'advanced'>('enhanced');
  const [featureSuggestions, setFeatureSuggestions] = useState<string[]>([]);
  const [techSuggestions, setTechSuggestions] = useState<string>('');
  const [customFormType, setCustomFormType] = useState<'freeform' | 'guided'>('freeform');
  const [customTitle, setCustomTitle] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [customRequirements, setCustomRequirements] = useState('');
  const [customPreferences, setCustomPreferences] = useState('');
  const { toast } = useToast();

  // Generate smart suggestions when inputs change
  useEffect(() => {
    // Only generate suggestions if we have meaningful input
    if (purpose.trim().length > 3 && audience.trim().length > 3) {
      const suggestions = suggestFeatures(purpose, audience);
      
      // Filter out suggestions that are already in the features array
      const newSuggestions = suggestions.filter(suggestion => 
        !features.some(feature => 
          feature.toLowerCase().includes(suggestion.toLowerCase()) || 
          suggestion.toLowerCase().includes(feature.toLowerCase())
        )
      );
      
      setFeatureSuggestions(newSuggestions.slice(0, 3)); // Limit to 3 suggestions
    } else {
      setFeatureSuggestions([]);
    }
  }, [purpose, audience, features]);

  // Generate tech stack suggestions
  useEffect(() => {
    // Only suggest tech if we have features and purpose
    if (
      purpose.trim().length > 3 && 
      features.filter(f => f.trim() !== '').length > 0 &&
      tech.trim() === '' // Only suggest if user hasn't specified tech
    ) {
      const suggestion = suggestTechStack(purpose, features.filter(f => f.trim() !== ''));
      setTechSuggestions(suggestion);
    } else {
      setTechSuggestions('');
    }
  }, [purpose, features, tech]);

  useEffect(() => {
    if (isCustomTemplate) {
      // When switching to custom, update the custom prompt based on the selected tab type
      if (customFormType === 'guided') {
        generateGuidedCustomPrompt();
      }
    }
  }, [customTitle, customContext, customRequirements, customPreferences, customFormType]);

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    if (features.length < 5) {
      setFeatures([...features, '']);
    }
  };

  const handleRemoveFeature = (index: number) => {
    if (features.length > 1) {
      const newFeatures = features.filter((_, i) => i !== index);
      setFeatures(newFeatures);
    }
  };

  const generateGuidedCustomPrompt = () => {
    let generatedPrompt = '';
    
    if (customTitle.trim()) {
      generatedPrompt += `${customTitle.trim()}\n\n`;
    }
    
    if (customContext.trim()) {
      generatedPrompt += `Context: ${customContext.trim()}\n\n`;
    }
    
    if (customRequirements.trim()) {
      generatedPrompt += `Requirements:\n${customRequirements.trim()}\n\n`;
    }
    
    if (customPreferences.trim()) {
      generatedPrompt += `Preferences:\n${customPreferences.trim()}\n\n`;
    }
    
    setCustomPrompt(generatedPrompt.trim());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For custom template, just use the custom prompt text
    if (isCustomTemplate) {
      if (!customPrompt.trim()) {
        toast({
          title: "Empty prompt",
          description: "Please enter your custom prompt",
          variant: "destructive",
        });
        return;
      }
      
      const formData: FormData = {
        purpose: customTitle || "Custom prompt",
        audience: "Custom",
        features: ["Custom"],
        design: "Custom",
        tech: "",
        enhancementMode
      };
      
      onGeneratePrompt(customPrompt, formData);
      return;
    }
    
    // Validate form
    if (!purpose.trim() || !audience.trim() || !design.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Filter out empty features before generating the prompt
    const filteredFeatures = features.filter(feature => feature.trim() !== '');
    
    if (filteredFeatures.length === 0) {
      toast({
        title: "Missing features",
        description: "Please add at least one feature",
        variant: "destructive",
      });
      return;
    }
    
    const formData: FormData = {
      purpose,
      audience,
      features: filteredFeatures,
      design,
      tech,
      enhancementMode
    };
    
    try {
      const prompt = generatePrompt(formData);
      onGeneratePrompt(prompt, formData);
    } catch (error) {
      console.error("Error generating prompt:", error);
      toast({
        title: "Error",
        description: "There was a problem generating your prompt",
        variant: "destructive",
      });
    }
  };

  const handleSelectPreset = (template: PromptTemplate) => {
    // Check if custom template is selected
    if (template.id === "custom") {
      setIsCustomTemplate(true);
      setCustomPrompt("");
      setCustomTitle("");
      setCustomContext("");
      setCustomRequirements("");
      setCustomPreferences("");
      return;
    }
    
    // Reset custom template flag if another template is selected
    setIsCustomTemplate(false);
    
    // Extract information from template to prefill form
    const purposeMatch = template.template.match(/\[main purpose\]/);
    const audienceMatch = template.template.match(/\[target audience\]/);
    const designMatch = template.template.match(/\[design preference\]/);
    
    // Set form values based on template type
    switch(template.id) {
      case "saas":
        setPurpose("a SaaS application");
        setAudience("business professionals and teams");
        setFeatures(["User authentication and accounts", "Dashboard with analytics", "Subscription management"]);
        setDesign("modern and professional");
        setTech("React and Node.js");
        break;
      case "portfolio":
        setPurpose("a personal portfolio website");
        setAudience("potential employers and clients");
        setFeatures(["Project showcase", "About me section", "Contact form"]);
        setDesign("clean and visually appealing");
        setTech("React with Tailwind CSS");
        break;
      case "ecommerce":
        setPurpose("an e-commerce platform");
        setAudience("online shoppers");
        setFeatures(["Product catalog", "Shopping cart", "Secure checkout"]);
        setDesign("user-friendly and conversion-focused");
        setTech("React, Next.js, and a headless CMS");
        break;
      case "dashboard":
        setPurpose("an analytics dashboard");
        setAudience("data analysts and business managers");
        setFeatures(["Data visualization", "Customizable widgets", "Report generation"]);
        setDesign("clean and information-focused");
        setTech("React with D3.js or Recharts");
        break;
      case "mobile":
        setPurpose("a mobile application");
        setAudience("smartphone users");
        setFeatures(["Responsive mobile UI", "Offline capabilities", "Push notifications"]);
        setDesign("mobile-first and touch-friendly");
        setTech("React Native or Flutter");
        break;
      default:
        // Generic values if no specific template is matched
        setPurpose("a new application");
        setAudience("end users");
        setFeatures(["Feature one", "Feature two", "Feature three"]);
        setDesign("modern and clean");
        setTech("");
    }
  };

  const handleSelectSuggestion = (suggestion: string) => {
    // Find an empty feature slot or replace the last one
    const emptyIndex = features.findIndex(feature => feature.trim() === '');
    if (emptyIndex !== -1) {
      const newFeatures = [...features];
      newFeatures[emptyIndex] = suggestion;
      setFeatures(newFeatures);
    } else if (features.length < 5) {
      setFeatures([...features, suggestion]);
    } else {
      const newFeatures = [...features];
      newFeatures[features.length - 1] = suggestion;
      setFeatures(newFeatures);
    }
  };

  const handleSelectTechSuggestion = () => {
    if (techSuggestions) {
      setTech(techSuggestions);
      setTechSuggestions('');
    }
  };

  return (
    <Card className="glass-card w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6 text-center">
          <PresetSelector onSelectPreset={handleSelectPreset} />
          
          <PromptTuningModes value={enhancementMode} onChange={setEnhancementMode} />
          
          {isCustomTemplate ? (
            <div className="space-y-4">
              <Tabs value={customFormType} onValueChange={(v) => setCustomFormType(v as 'freeform' | 'guided')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="freeform" className="flex items-center gap-2">
                    <Text className="h-4 w-4" />
                    Freeform
                  </TabsTrigger>
                  <TabsTrigger value="guided" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" />
                    Guided
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="freeform" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Your Custom Prompt
                    </label>
                    <Textarea 
                      placeholder="Write your custom prompt here... Be as specific as possible about what you want to create." 
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-[250px]"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="guided" className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title / Subject
                    </label>
                    <Input 
                      placeholder="What are you trying to build or accomplish?" 
                      value={customTitle}
                      onChange={(e) => setCustomTitle(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Context
                    </label>
                    <Textarea 
                      placeholder="Background information, current situation, or constraints..." 
                      value={customContext}
                      onChange={(e) => setCustomContext(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Requirements
                    </label>
                    <Textarea 
                      placeholder="Specific needs, must-haves, or key functionalities..." 
                      value={customRequirements}
                      onChange={(e) => setCustomRequirements(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferences
                    </label>
                    <Textarea 
                      placeholder="Design preferences, style, tone, or specific technologies..." 
                      value={customPreferences}
                      onChange={(e) => setCustomPreferences(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                  
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Preview:</p>
                    <div className="bg-background/30 p-3 rounded-md text-left text-sm">
                      <pre className="whitespace-pre-wrap">{customPrompt}</pre>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Project Purpose
                </label>
                <Input 
                  placeholder="What are you building?" 
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  required
                  className={purpose ? "" : "placeholder:text-muted-foreground/50"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Target Audience
                </label>
                <Input 
                  placeholder="Who will use your application?" 
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  required
                  className={audience ? "" : "placeholder:text-muted-foreground/50"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Core Features (3-5)
                </label>
                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Feature ${index + 1}`}
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        required={index < 3}
                        className={feature ? "" : "placeholder:text-muted-foreground/50"}
                      />
                      {index >= 3 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleRemoveFeature(index)}
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                  {features.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddFeature}
                      className="w-full"
                    >
                      Add Feature
                    </Button>
                  )}
                  
                  <SmartSuggestions 
                    suggestions={featureSuggestions} 
                    onSelectSuggestion={handleSelectSuggestion} 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Style or Design Preferences
                </label>
                <Textarea 
                  placeholder="Describe your desired look and feel" 
                  value={design}
                  onChange={(e) => setDesign(e.target.value)}
                  required
                  className={`min-h-[80px] ${design ? "" : "placeholder:text-muted-foreground/50"}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tech Stack or AI Tool (Optional)
                </label>
                <Input 
                  placeholder="E.g., React, Next.js, or specific AI tools" 
                  value={tech}
                  onChange={(e) => setTech(e.target.value)}
                  className={tech ? "" : "placeholder:text-muted-foreground/50"}
                />
                {techSuggestions && (
                  <div className="mt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleSelectTechSuggestion}
                      className="text-xs py-1 px-2 h-auto bg-white/5 hover:bg-white/10 flex gap-1 items-center"
                    >
                      <Lightbulb className="h-3 w-3" />
                      <span>Suggested: {techSuggestions}</span>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full text-white py-5 hover:bg-primary/90"
          >
            Generate Prompt
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromptForm;
