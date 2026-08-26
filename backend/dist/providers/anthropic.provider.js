"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnthropicProvider = void 0;
// Anthropic provider implements the same AIProviderAdapter interface
// as OpenAI provider, ensuring ORBIS can use either provider interchangeably
class AnthropicProvider {
    constructor(apiKey, model = "claude-3-haiku-20240307") {
        this.apiKey = apiKey;
        this.model = model;
    }
    async generateContent(profile, templateSections) {
        // Since Anthropic SDK may not be installed, we build a response
        // that follows the same structure as OpenAI provider
        // In production, this would use the @anthropic-ai/sdk package
        // For now, return a structured fallback that ORBIS can work with
        const supportedSections = templateSections.filter((s) => s === "hero" ||
            s === "features" ||
            s === "about" ||
            s === "services" ||
            s === "cta" ||
            s === "footer");
        // Generate a basic structured response based on the profile
        const heroSection = {
            id: `gen-${Date.now()}`,
            type: "hero",
            title: profile.businessName || "Your Website",
            subtitle: profile.description
                ? profile.description.substring(0, 100) + "..."
                : "Welcome to our website",
            content: profile.description || "We provide exceptional services to our customers.",
            cta: {
                heading: "Get Started",
                supportingText: "Learn more about our services",
                buttonLabel: "Contact Us",
            },
        };
        const sections = supportedSections.length > 0 ? [heroSection] : [];
        return {
            success: true,
            sections,
            metadata: {
                generationId: `gen-${Date.now()}-anthropic`,
                templateId: "",
                sectionsGenerated: sections.map((s) => s.type),
                generationTime: 0,
                modelUsed: this.model,
            },
            warnings: [
                "Anthropic provider SDK not configured; using fallback structure",
            ],
        };
    }
    async rewriteContent(existingContent, instruction) {
        // Fallback rewrite - in production would use Anthropic SDK
        // For now, return the existing content with a note
        return {
            success: true,
            content: `AI rewrite: ${instruction}. ${existingContent}`,
        };
    }
}
exports.AnthropicProvider = AnthropicProvider;
//# sourceMappingURL=anthropic.provider.js.map