import prisma from "../lib/prisma"

export interface AIBusinessProfile {
  businessName: string
  description: string
  industry: string
  targetAudience: string
  goal: string
  tone: "professional" | "friendly" | "persuasive" | "premium" | "casual"
  services: string[]
  location?: string
  stylePreference?: "modern" | "minimal" | "corporate" | "creative" | "personal"
}

export interface AISectionContent {
  id: string
  type: "hero" | "features" | "about" | "services" | "testimonials" | "pricing" | "cta" | "contact" | "footer"
  title?: string
  subtitle?: string
  content?: string
  items?: AISectionItem[]
  cta?: AICallToAction
  description?: string
}

export interface AISectionItem {
  title: string
  description: string
  label?: string
}

export interface AICallToAction {
  heading: string
  supportingText: string
  buttonLabel: string
  isExternal?: boolean
  href?: string
}

export interface AIStyleSuggestion {
  primaryColor?: string
  secondaryColor?: string
  fontFamily?: "system" | "roboto" | "open-sans" | "monospace"
  sectionSpacing?: "compact" | "normal" | "spacious"
  borderRadius?: "none" | "small" | "medium" | "large"
}

export interface AIGenerationMetadata {
  generationId: string
  templateId: string
  sectionsGenerated: string[]
  generationTime: number
  modelUsed: string
  promptTokens?: number
  completionTokens?: number
}

export interface AIGenerateResponse {
  success: boolean
  profile?: AIBusinessProfile
  sections: AISectionContent[]
  styleSuggestions?: AIStyleSuggestion
  metadata: AIGenerationMetadata
  errors?: string[]
  warnings?: string[]
}

export interface AIProviderAdapter {
  name: string
  generateContent(profile: AIBusinessProfile, templateSections: string[]): Promise<AIGenerateResponse>
  rewriteContent(existingContent: string, instruction: string): Promise<{ success: boolean; content: string; error?: string }>
  validateOutput(output: any): boolean
  generateProductDescription(profile: AIBusinessProfile, productName: string, productType: string): Promise<{ success: boolean; content: string; error?: string }>
  generateSEO(profile: AIBusinessProfile, businessName: string): Promise<{ success: boolean; title: string; description: string; error?: string }>
  generateMarketingCopy(profile: AIBusinessProfile, campaignType: "email" | "social" | "ad"): Promise<{ success: boolean; content: string; error?: string }>
}

/** Template section support mapping */
export type TemplateSectionSupport = Record<string, string[]> // templateId -> supported section types

export class AIService {
  private static provider: AIProviderAdapter | null = null

  static setProvider(provider: AIProviderAdapter) {
    AIService.provider = provider
  }

  static getProvider(): AIProviderAdapter | null {
    return AIService.provider
  }

  /**
   * Initialize the AI provider from environment variables.
   * Should be called at backend startup.
   * Reads AI_PROVIDER, OPENAI_API_KEY, OPENAI_MODEL, etc.
   */
  static async initializeProvider() {
    const providerName = process.env.AI_PROVIDER

    if (!providerName) {
      console.warn("AI_PROVIDER not set in environment variables")
      return
    }

    // Clear any existing provider
    AIService.setProvider(null)

    if (providerName === "openai") {
      const openaiApiKey = process.env.OPENAI_API_KEY
      const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini"

      if (!openaiApiKey || openaiApiKey === "sk-your-openai-key-here") {
        console.warn("OpenAI API key not configured properly")
        return
      }

      try {
        const openaiProvider = new (await import("./providers/openai.provider")).OpenAIProvider(
          openaiApiKey,
          openaiModel
        )
        AIService.setProvider(openaiProvider)
        console.log(`OpenAI provider initialized with model: ${openaiModel}`)
      } catch (error) {
        console.error("Failed to initialize OpenAI provider:", error)
      }
    } else if (providerName === "anthropic") {
      const anthropicApiKey = process.env.ANTHROPIC_API_KEY
      const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307"

      if (!anthropicApiKey || anthropicApiKey === "anthropic-your-key-here") {
        console.warn("Anthropic API key not configured properly")
        return
      }

      try {
        const anthropicProvider = new (await import("./providers/anthropic.provider")).AnthropicProvider(
          anthropicApiKey,
          anthropicModel
        )
        AIService.setProvider(anthropicProvider)
        console.log(`Anthropic provider initialized with model: ${anthropicModel}`)
      } catch (error) {
        console.error("Failed to initialize Anthropic provider:", error)
      }
    } else {
      console.warn(`Unknown AI provider: ${providerName}`)
    }
  }

  static async generateWebsiteContent(
    profile: AIBusinessProfile,
    templateSections: string[]
  ): Promise<AIGenerateResponse> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        errors: ["AI provider not configured. Please contact administrator."],
        metadata: this.defaultMetadata(),
      }
    }

    return provider.generateContent(profile, templateSections)
  }

  static async rewriteSectionContent(
    existingContent: string,
    instruction: string
  ): Promise<{ success: boolean; content: string; error?: string }> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        content: existingContent,
        error: "AI provider not configured",
      }
    }

    return provider.rewriteContent(existingContent, instruction)
  }

  static async validateAIOutput(output: any): Promise<{ valid: boolean; errors: string[] }> {
    const errors: string[] = []

    if (!output || typeof output !== "object") {
      return { valid: false, errors: ["Invalid AI output format"] }
    }

    // Validate required fields based on section types
    if (output.sections && Array.isArray(output.sections)) {
      for (const section of output.sections) {
        if (!section.type) {
          errors.push(`Section missing type field`)
        }

        switch (section.type) {
          case "hero":
          case "cta":
            if (!section.cta) {
              errors.push(`${section.type} section missing CTA`)
            }
            break
          case "features":
            if (!section.items || !Array.isArray(section.items)) {
              errors.push(`features section missing items array`)
            }
            break
          case "about":
            if (!section.content) {
              errors.push(`about section missing content`)
            }
            break
          case "services":
            if (!section.items || !Array.isArray(section.items)) {
              errors.push(`services section missing items array`)
            }
            break
          case "pricing":
            if (!section.plans) {
              errors.push(`pricing section missing plans`)
            }
            break
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    }
  }

  /**
   * Filter AI-generated sections to only include those supported by the template.
   * This ensures AI output is template-aware and doesn't generate unsupported sections.
   */
  static filterSectionsByTemplate(
    aiSections: AISectionContent[],
    supportedSections: string[]
  ): { filtered: AISectionContent[]; applied: string[]; rejected: string[] } {
    const applied: string[] = []
    const rejected: string[] = []
    const filtered: AISectionContent[] = []

    for (const section of aiSections) {
      const type = section.type
      if (supportedSections.includes(type)) {
        filtered.push(section)
        applied.push(type)
      } else {
        rejected.push(type || "unknown")
      }
    }

    // If no sections match but we have some, default to hero
    if (filtered.length === 0 && aiSections.length > 0) {
      const heroSection = aiSections.find((s) => s.type === "hero")
      if (heroSection) {
        filtered.push(heroSection)
        applied.push("hero")
      }
    }

    return { filtered, applied, rejected }
  }

  /**
   * Get the section types supported by a template.
   * In a full implementation, this would read the Template model's sections field.
   * For now, returns a default set based on common template configurations.
   */
  static getSupportedSectionsForTemplate(templateId: string): string[] {
    // Default supported sections - template-specific configs would extend this
    const defaultSupport: Record<string, string[]> = {
      // Template A: Full-featured template
      "template-a": ["hero", "features", "about", "services", "cta", "footer"],
      // Template B: Marketing-focused template
      "template-b": ["hero", "pricing", "testimonials", "contact"],
      // Template C: Portfolio template
      "template-c": ["hero", "about", "testimonials", "cta"],
      // Template D: Minimal template
      "template-d": ["hero", "cta"],
      // Fallback: all supported sections
      "default": [
        "hero", "features", "about", "services", 
        "testimonials", "pricing", "cta", "contact", "footer"
      ],
    }

    const templateSpecific = defaultSupport[templateId] || defaultSupport["default"]
    return templateSpecific
  }

  /**
   * Generate product description using AI.
   * Cost: 2 AI credits per generation.
   */
  static async generateProductDescription(
    profile: AIBusinessProfile,
    productName: string,
    productType: string
  ): Promise<{ success: boolean; content: string; error?: string }> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        content: "",
        error: "AI provider not configured",
      }
    }

    const prompt = `Generate a compelling product description for an ORBIS website builder platform.

Product Name: ${productName}
Product Type: ${productType}
Business: ${profile.businessName}
Industry: ${profile.industry}
Target Audience: ${profile.targetAudience}
Goal: ${profile.goal}
Tone: ${profile.tone}

Write a product description that:
- Highlights key benefits and features
- Uses the specified tone of voice
- Includes a call-to-action
- Is concise and persuasive (max 200 words)
- Focuses on solving customer problems
- Includes relevant keywords for SEO

Return only the description text, no headings or formatting.`
    
    try {
      const response = await provider.generateContent(profile, [])
      if (response.success && response.sections && response.sections.length > 0) {
        const description = response.sections[0]?.content || ""
        return { success: true, content: description }
      }
      return { success: false, content: "", error: "Empty response from AI" }
    } catch (err) {
      return { success: false, content: "", error: "AI generation failed" }
    }
  }

  /**
   * Generate SEO title and description using AI.
   * Cost: 1 AI credit per generation.
   */
  static async generateSEO(
    profile: AIBusinessProfile,
    businessName: string
  ): Promise<{ success: boolean; title: string; description: string; error?: string }> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        title: "",
        description: "",
        error: "AI provider not configured",
      }
    }

    const prompt = `Generate SEO optimized title and meta description for an ORBIS website builder platform.

Business Name: ${businessName}
Industry: ${profile.industry}
Target Audience: ${profile.targetAudience}
Goal: ${profile.goal}
Tone: ${profile.tone}

Generate:
1. SEO Title: Max 60 characters, compelling, includes primary keyword
2. SEO Description: Max 160 characters, summarizes the business value, includes secondary keyword

Return as JSON: {"title": "...", "description": "..."}`
    
    try {
      const response = await provider.generateContent(profile, [])
      if (response.success && response.sections && response.sections.length > 0) {
        const section = response.sections[0]
        // Try to parse the content as JSON with title and description
        try {
          const parsed = JSON.parse(section.content || "{}")
          return {
            success: true,
            title: parsed.title || `${businessName} - ORBIS`,
            description: parsed.description || `${businessName} provides AI-powered website building and e-commerce solutions.`,
          }
        } catch {
          return {
            success: true,
            title: `${businessName} - ORBIS`,
            description: `${businessName} provides AI-powered website building and e-commerce solutions.`,
          }
        }
      }
      return {
        success: false,
        title: `${businessName} - ORBIS`,
        description: `${businessName} provides AI-powered website building and e-commerce solutions.`,
      }
    } catch (err) {
      return { success: false, title: "", description: "", error: "AI generation failed" }
    }
  }

  /**
   * Generate marketing copy using AI.
   * Cost: 1 AI credit per generation.
   */
  static async generateMarketingCopy(
    profile: AIBusinessProfile,
    campaignType: "email" | "social" | "ad"
  ): Promise<{ success: boolean; content: string; error?: string }> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        content: "",
        error: "AI provider not configured",
      }
    }

    const typeLabels: Record<"email" | "social" | "ad", string> = {
      email: "Email Campaign",
      social: "Social Media Post",
      ad: "Facebook/Google Ad",
    }

    const prompt = `Generate marketing copy for an ORBIS website builder platform.

Business: ${profile.businessName}
Industry: ${profile.industry}
Tone: ${profile.tone}
Campaign Type: ${typeLabels[campaignType]}

Write compelling ${typeLabels[campaignType].toLowerCase()} that:
- Highlights the key value proposition
- Includes a clear call-to-action
- Uses the specified tone of voice
- Is concise and action-oriented
- Focuses on converting the target audience

Return only the copy text, no headings or formatting.`
    
    try {
      const response = await provider.generateContent(profile, [])
      if (response.success && response.sections && response.sections.length > 0) {
        return { success: true, content: response.sections[0].content || "" }
      }
      return { success: false, content: "", error: "Empty response from AI" }
    } catch (err) {
      return { success: false, content: "", error: "AI generation failed" }
    }
  }

  /**
   * Generate product tags using AI.
   * Cost: 1 AI credit per generation.
   */
  static async generateProductTags(
    profile: AIBusinessProfile,
    productName: string,
    productDescription: string
  ): Promise<{ success: boolean; tags: string[]; error?: string }> {
    const provider = AIService.provider
    if (!provider) {
      return {
        success: false,
        tags: [],
        error: "AI provider not configured",
      }
    }

    const prompt = `Generate 5-7 relevant product tags for an ORBIS product.

Product Name: ${productName}
Product Description: ${productDescription}
Industry: ${profile.industry}
Target Audience: ${profile.targetAudience}

Write 5-7 short tags (1-3 words each) that:
- Are relevant to the product and industry
- Include keywords for search and discovery
- Mix of descriptive and benefit-focused tags
- Are separated by commas only, no hashtags

Return as a comma-separated string: "tag1, tag2, tag3, tag4, tag5, tag6, tag7"`
    
    try {
      const response = await provider.generateContent(profile, [])
      if (response.success && response.sections && response.sections.length > 0) {
        const tagsString = response.sections[0].content || ""
        const tags = tagsString
          .split(",")
          .map((tag: string) => tag.trim())
          .filter((tag: string) => tag.length > 0)
        return { success: true, tags }
      }
      return { success: false, tags: [], error: "Empty response from AI" }
    } catch (err) {
      return { success: false, tags: [], error: "AI generation failed" }
    }
  }

  /**
   * Check AI credits before expensive operations.
   */
  static canAfford(actionCost: number, userCredits: number): { canAfford: boolean; remaining: number; message: string } {
    const remaining = userCredits - actionCost
    if (remaining >= 0) {
      return { canAfford: true, remaining, message: `This action costs ${actionCost} credits. You have ${userCredits} credits remaining.` }
    }
    return { canAfford: false, remaining: 0, message: `Insufficient credits. This action costs ${actionCost} credits. You have ${remaining.abs()} credits.` }
  }

  private static defaultMetadata(): AIGenerationMetadata {
    return {
      generationId: `gen-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      templateId: "",
      sectionsGenerated: [],
      generationTime: 0,
      modelUsed: "none",
    }
  }
}

/**
 * Build a portfolio template prompt with section priorities.
   * The AI should generate content prioritizing personal branding,
   * work/project highlights, skills, and contact information.
   */
  static buildPortfolioPrompt(profile: AIBusinessProfile): string {
    return `Generate content for a portfolio website:
    - Name: ${profile.businessName}
    - Must include: Personal branding, Work/project highlights, Skills, Contact
    - Format: JSON with sections: hero, about, testimonials, cta`
  }

  /**
   * Build a SaaS template prompt with section priorities.
   * The AI should generate content prioritizing value proposition,
   * product features, benefits, pricing, and conversion-focused CTAs.
   */
  static buildSaaSPrompt(profile: AIBusinessProfile): string {
    return `Generate content for a SaaS website:
    - Company: ${profile.businessName}
    - Must include: Value proposition, Product features, Benefits, Pricing, Conversion-focused CTAs
    - Format: JSON with sections: hero, features, pricing, cta`
  }

  /**
   * Build a business template prompt with section priorities.
   * The AI should generate content prioritizing services,
   * trust, professional positioning, and lead generation.
   */
  static buildBusinessPrompt(profile: AIBusinessProfile): string {
    return `Generate content for a business website:
    - Must include: Services, Trust, Professional positioning, Lead generation
    - Format: JSON with sections: hero, about, services, cta`
  }

  private static defaultMetadata(): AIGenerationMetadata {
    return {
      generationId: `gen-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      templateId: "",
      sectionsGenerated: [],
      generationTime: 0,
      modelUsed: "none",
    }
}
  }

export default AIService