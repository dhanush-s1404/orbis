export interface AIBusinessProfile {
    businessName: string;
    description: string;
    industry: string;
    targetAudience: string;
    goal: string;
    tone: "professional" | "friendly" | "persuasive" | "premium" | "casual";
    services: string[];
    location?: string;
    stylePreference?: "modern" | "minimal" | "corporate" | "creative" | "personal";
}
export interface AISectionContent {
    id: string;
    type: "hero" | "features" | "about" | "services" | "testimonials" | "pricing" | "cta" | "contact" | "footer";
    title?: string;
    subtitle?: string;
    content?: string;
    items?: AISectionItem[];
    cta?: AICallToAction;
    description?: string;
}
export interface AISectionItem {
    title: string;
    description: string;
    label?: string;
}
export interface AICallToAction {
    heading: string;
    supportingText: string;
    buttonLabel: string;
    isExternal?: boolean;
    href?: string;
}
export interface AIStyleSuggestion {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: "system" | "roboto" | "open-sans" | "monospace";
    sectionSpacing?: "compact" | "normal" | "spacious";
    borderRadius?: "none" | "small" | "medium" | "large";
}
export interface AIGenerationMetadata {
    generationId: string;
    templateId: string;
    sectionsGenerated: string[];
    generationTime: number;
    modelUsed: string;
    promptTokens?: number;
    completionTokens?: number;
}
export interface AIGenerateResponse {
    success: boolean;
    profile?: AIBusinessProfile;
    sections: AISectionContent[];
    styleSuggestions?: AIStyleSuggestion;
    metadata: AIGenerationMetadata;
    errors?: string[];
    warnings?: string[];
}
export interface AIProviderAdapter {
    name: string;
    generateContent(profile: AIBusinessProfile, templateSections: string[]): Promise<AIGenerateResponse>;
    rewriteContent(existingContent: string, instruction: string): Promise<{
        success: boolean;
        content: string;
        error?: string;
    }>;
    validateOutput(output: any): boolean;
}
/** Template section support mapping */
export type TemplateSectionSupport = Record<string, string[]>;
export declare class AIService {
    private static provider;
    static setProvider(provider: AIProviderAdapter): void;
    static getProvider(): AIProviderAdapter | null;
    /**
     * Initialize the AI provider from environment variables.
     * Should be called at backend startup.
     * Reads AI_PROVIDER, OPENAI_API_KEY, OPENAI_MODEL, etc.
     */
    static initializeProvider(): Promise<void>;
    static generateWebsiteContent(profile: AIBusinessProfile, templateSections: string[]): Promise<AIGenerateResponse>;
    static rewriteSectionContent(existingContent: string, instruction: string): Promise<{
        success: boolean;
        content: string;
        error?: string;
    }>;
    static validateAIOutput(output: any): Promise<{
        valid: boolean;
        errors: string[];
    }>;
    /**
     * Filter AI-generated sections to only include those supported by the template.
     * This ensures AI output is template-aware and doesn't generate unsupported sections.
     */
    static filterSectionsByTemplate(aiSections: AISectionContent[], supportedSections: string[]): {
        filtered: AISectionContent[];
        applied: string[];
        rejected: string[];
    };
    /**
     * Get the section types supported by a template.
     * In a full implementation, this would read the Template model's sections field.
     * For now, returns a default set based on common template configurations.
     */
    static getSupportedSectionsForTemplate(templateId: string): string[];
    /**
     * Build a restaurant template prompt with section priorities.
     * The AI should generate content prioritizing menu messaging, reservations,
     * location, and food-focused CTAs for restaurant templates.
     */
    static buildRestaurantPrompt(profile: AIBusinessProfile): string;
    /**
     * Build a portfolio template prompt with section priorities.
     * The AI should generate content prioritizing personal branding,
     * work/project highlights, skills, and contact information.
     */
    static buildPortfolioPrompt(profile: AIBusinessProfile): string;
    /**
     * Build a SaaS template prompt with section priorities.
     * The AI should generate content prioritizing value proposition,
     * product features, benefits, pricing, and conversion-focused CTAs.
     */
    static buildSaaSPrompt(profile: AIBusinessProfile): string;
    /**
     * Build a business template prompt with section priorities.
     * The AI should generate content prioritizing services,
     * trust, professional positioning, and lead generation.
     */
    static buildBusinessPrompt(profile: AIBusinessProfile): string;
    private static defaultMetadata;
}
export default AIService;
