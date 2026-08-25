import PrismaClient from "@prisma/client"
import { Prisma } from "@prisma/client"

const prisma = new PrismaClient()

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