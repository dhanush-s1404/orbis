import OpenAI from "openai"
import {
  AIService,
  AIBusinessProfile,
  AISectionContent,
  AIGenerateResponse,
} from "../services/ai.service"

export class OpenAIProvider implements AIService.AIProviderAdapter {
  private client: OpenAI
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = "gpt-4o-mini") {
    this.apiKey = apiKey
    this.model = model
    this.client = new OpenAI({ apiKey })
  }

  async generateContent(
    profile: AIBusinessProfile,
    templateSections: string[]
  ): Promise<AIGenerateResponse> {
    // Build template-aware system prompt
    const systemPrompt = this.buildSystemPrompt(profile, templateSections)

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: this.buildUserPrompt(profile) },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    })

    const rawContent = response.choices[0].message.content

    if (!rawContent) {
      return {
        success: false,
        errors: ["Empty response from OpenAI provider"],
        metadata: {
          generationId: `gen-${Date.now()}`,
          templateId: "",
          sectionsGenerated: [],
          generationTime: 0,
          modelUsed: this.model,
        },
      }
    }

    try {
      const parsed = JSON.parse(rawContent)

      // Validate and normalize the response
      const validation = AIService.validateAIOutput(parsed)

      if (!validation.valid) {
        // Return with warnings but don't fail completely
        return {
          success: true,
          sections: parsed.sections || [],
          metadata: {
            generationId: `gen-${Date.now()}`,
            templateId: "",
            sectionsGenerated: (parsed.sections || []).map((s: any) => s.type || "unknown"),
            generationTime: 0,
            modelUsed: this.model,
            promptTokens: response.usage?.prompt_tokens,
            completionTokens: response.usage?.completion_tokens,
          },
          warnings: validation.errors,
        }
      }

      return {
        success: true,
        sections: parsed.sections || [],
        styleSuggestions: parsed.styleSuggestions,
        metadata: {
          generationId: `gen-${Date.now()}`,
          templateId: "",
          sectionsGenerated: (parsed.sections || []).map((s: any) => s.type || "unknown"),
          generationTime: 0,
          modelUsed: this.model,
          promptTokens: response.usage?.prompt_tokens,
          completionTokens: response.usage?.completion_tokens,
        },
        errors: validation.errors,
      }
    } catch (e) {
      // If JSON parsing fails, try to extract usable content
      return {
        success: false,
        errors: [`Failed to parse OpenAI response: ${(e as Error).message}`],
        metadata: {
          generationId: `gen-${Date.now()}`,
          templateId: "",
          sectionsGenerated: [],
          generationTime: 0,
          modelUsed: this.model,
        },
      }
    }
  }

  async rewriteContent(
    existingContent: string,
    instruction: string
  ): Promise<{ success: boolean; content: string; error?: string }> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        {
          role: "system",
          content:
            "You are an ORBIS website builder AI. Rewrite the given content according to the instruction. Return only the rewritten text, no explanations, no JSON, no additional commentary.",
        },
        {
          role: "user",
          content: `Existing content: "${existingContent}". Instruction: "${instruction}"`,
        },
      ],
      temperature: 0.3,
    })

    const rewritten = response.choices[0].message.content

    if (!rewritten) {
      return { success: false, content: existingContent, error: "Empty response from OpenAI" }
    }

    return { success: true, content: rewritten.trim() }
  }

  private buildSystemPrompt(
    profile: AIBusinessProfile,
    templateSections: string[]
  ): string {
    const sectionDescriptions = {
      hero:
        "Hero section with title, subtitle, primary CTA, secondary CTA, background styling",
      features:
        "Features section with feature titles, descriptions, and relevant labels",
      about:
        "About section with business story, mission statement, supporting description",
      services:
        "Services section with service names and descriptions",
      testimonials:
        "Testimonials section with customer names, roles, and content",
      pricing:
        "Pricing section with plan names, prices, and feature lists",
      cta:
        "CTA section with heading, supporting text, and button label",
      contact:
        "Contact section with contact information, form fields, or address",
      footer:
        "Footer section with copyright, navigation links, and social links",
    }

    const supportedSections = templateSections
      .filter((s) => sectionDescriptions[s])
      .join(", ")

    return `You are an ORBIS website builder AI. Generate structured website content.

    Template supports these sections: ${supportedSections}.

    Generate ONE section only based on the user's business profile. Return VALID JSON ONLY with this exact structure:

    {
      "type": "SECTION_TYPE",
      "title": "Section title",
      "subtitle": "Section subtitle",
      "content": "Section content description",
      "cta": {
        "heading": "CTA heading",
        "supportingText": "Supporting text",
        "buttonLabel": "Button label"
      } if applicable,
      "items": [
        {
          "title": "Item title",
          "description": "Item description",
          "label": "Optional label"
        }
      ] if applicable,
      "description": "Description field if applicable"
    }

    RULES:
    1. Return ONLY the JSON object, no surrounding text, no explanations
    2. Choose EXACTLY ONE section type from the supported list above
    3. All string values must be realistic, customer-ready content
    4. Use the business profile information to customize the content
    5. If the section has a CTA, include the cta object with heading, supportingText, and buttonLabel
    6. If the section has items (like features), include the items array
    7. Do not include any reasoning, apologies, or meta-text
    8. The JSON must be valid and parseable
    9. Match the section type exactly: "hero", "features", "about", "services", "testimonials", "pricing", "cta", "contact", or "footer"
    10. Do not generate sections not in the supported list
    }`

    // Include business profile context
    const profileContext = `
    Business Name: ${profile.businessName}
    Industry: ${profile.industry}
    Description: ${profile.description}
    Target Audience: ${profile.targetAudience}
    Goal: ${profile.goal}
    Tone: ${profile.tone}
    Services: ${profile.services.join(", ")}
    ${profile.location ? `Location: ${profile.location}` : ""}
    ${profile.stylePreference ? `Style Preference: ${profile.stylePreference}` : ""}
    `.trim()

    return `${systemPrompt}

    ${profileContext}
    `.trim()
  }

  private buildUserPrompt(profile: AIBusinessProfile): string {
    return `Generate website content for the ORBIS builder platform. Use the business profile above to create content. Return only the JSON object as specified in the system prompt.`
  }
}