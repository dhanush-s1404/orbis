"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const client_1 = require("../generated/client");
const prisma = new client_1.PrismaClient();
class AIService {
    static setProvider(provider) {
        AIService.provider = provider;
    }
    static getProvider() {
        return AIService.provider;
    }
    /**
     * Initialize the AI provider from environment variables.
     * Should be called at backend startup.
     * Reads AI_PROVIDER, OPENAI_API_KEY, OPENAI_MODEL, etc.
     */
    static async initializeProvider() {
        const providerName = process.env.AI_PROVIDER;
        if (!providerName) {
            console.warn("AI_PROVIDER not set in environment variables");
            return;
        }
        // Clear any existing provider
        AIService.setProvider(null);
        if (providerName === "openai") {
            const openaiApiKey = process.env.OPENAI_API_KEY;
            const openaiModel = process.env.OPENAI_MODEL || "gpt-4o-mini";
            if (!openaiApiKey || openaiApiKey === "sk-your-openai-key-here") {
                console.warn("OpenAI API key not configured properly");
                return;
            }
            try {
                const openaiProvider = new (await Promise.resolve().then(() => __importStar(require("./providers/openai.provider")))).OpenAIProvider(openaiApiKey, openaiModel);
                AIService.setProvider(openaiProvider);
                console.log(`OpenAI provider initialized with model: ${openaiModel}`);
            }
            catch (error) {
                console.error("Failed to initialize OpenAI provider:", error);
            }
        }
        else if (providerName === "anthropic") {
            const anthropicApiKey = process.env.ANTHROPIC_API_KEY;
            const anthropicModel = process.env.ANTHROPIC_MODEL || "claude-3-haiku-20240307";
            if (!anthropicApiKey || anthropicApiKey === "anthropic-your-key-here") {
                console.warn("Anthropic API key not configured properly");
                return;
            }
            try {
                const anthropicProvider = new (await Promise.resolve().then(() => __importStar(require("./providers/anthropic.provider")))).AnthropicProvider(anthropicApiKey, anthropicModel);
                AIService.setProvider(anthropicProvider);
                console.log(`Anthropic provider initialized with model: ${anthropicModel}`);
            }
            catch (error) {
                console.error("Failed to initialize Anthropic provider:", error);
            }
        }
        else {
            console.warn(`Unknown AI provider: ${providerName}`);
        }
    }
    static async generateWebsiteContent(profile, templateSections) {
        const provider = AIService.provider;
        if (!provider) {
            return {
                success: false,
                errors: ["AI provider not configured. Please contact administrator."],
                metadata: this.defaultMetadata(),
            };
        }
        return provider.generateContent(profile, templateSections);
    }
    static async rewriteSectionContent(existingContent, instruction) {
        const provider = AIService.provider;
        if (!provider) {
            return {
                success: false,
                content: existingContent,
                error: "AI provider not configured",
            };
        }
        return provider.rewriteContent(existingContent, instruction);
    }
    static async validateAIOutput(output) {
        const errors = [];
        if (!output || typeof output !== "object") {
            return { valid: false, errors: ["Invalid AI output format"] };
        }
        // Validate required fields based on section types
        if (output.sections && Array.isArray(output.sections)) {
            for (const section of output.sections) {
                if (!section.type) {
                    errors.push(`Section missing type field`);
                }
                switch (section.type) {
                    case "hero":
                    case "cta":
                        if (!section.cta) {
                            errors.push(`${section.type} section missing CTA`);
                        }
                        break;
                    case "features":
                        if (!section.items || !Array.isArray(section.items)) {
                            errors.push(`features section missing items array`);
                        }
                        break;
                    case "about":
                        if (!section.content) {
                            errors.push(`about section missing content`);
                        }
                        break;
                    case "services":
                        if (!section.items || !Array.isArray(section.items)) {
                            errors.push(`services section missing items array`);
                        }
                        break;
                    case "pricing":
                        if (!section.plans) {
                            errors.push(`pricing section missing plans`);
                        }
                        break;
                }
            }
        }
        return {
            valid: errors.length === 0,
            errors,
        };
    }
    /**
     * Filter AI-generated sections to only include those supported by the template.
     * This ensures AI output is template-aware and doesn't generate unsupported sections.
     */
    static filterSectionsByTemplate(aiSections, supportedSections) {
        const applied = [];
        const rejected = [];
        const filtered = [];
        for (const section of aiSections) {
            const type = section.type;
            if (supportedSections.includes(type)) {
                filtered.push(section);
                applied.push(type);
            }
            else {
                rejected.push(type || "unknown");
            }
        }
        // If no sections match but we have some, default to hero
        if (filtered.length === 0 && aiSections.length > 0) {
            const heroSection = aiSections.find((s) => s.type === "hero");
            if (heroSection) {
                filtered.push(heroSection);
                applied.push("hero");
            }
        }
        return { filtered, applied, rejected };
    }
    /**
     * Get the section types supported by a template.
     * In a full implementation, this would read the Template model's sections field.
     * For now, returns a default set based on common template configurations.
     */
    static getSupportedSectionsForTemplate(templateId) {
        // Default supported sections - template-specific configs would extend this
        const defaultSupport = {
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
        };
        const templateSpecific = defaultSupport[templateId] || defaultSupport["default"];
        return templateSpecific;
    }
    /**
     * Build a restaurant template prompt with section priorities.
     * The AI should generate content prioritizing menu messaging, reservations,
     * location, and food-focused CTAs for restaurant templates.
     */
    static buildRestaurantPrompt(profile) {
        return `Generate content for a restaurant website:
    - Name: ${profile.businessName}
    - Cuisine type: inferred from description
    - Must include: Menu/service messaging, Reservations, Location, Opening information, Food-focused CTAs
    - Tone: ${profile.tone}
    - Format: JSON with sections: hero, about, services, contact`;
    }
    /**
     * Build a portfolio template prompt with section priorities.
     * The AI should generate content prioritizing personal branding,
     * work/project highlights, skills, and contact information.
     */
    static buildPortfolioPrompt(profile) {
        return `Generate content for a portfolio website:
    - Name: ${profile.businessName}
    - Must include: Personal branding, Work/project highlights, Skills, Contact
    - Format: JSON with sections: hero, about, testimonials, cta`;
    }
    /**
     * Build a SaaS template prompt with section priorities.
     * The AI should generate content prioritizing value proposition,
     * product features, benefits, pricing, and conversion-focused CTAs.
     */
    static buildSaaSPrompt(profile) {
        return `Generate content for a SaaS website:
    - Company: ${profile.businessName}
    - Must include: Value proposition, Product features, Benefits, Pricing, Conversion-focused CTAs
    - Format: JSON with sections: hero, features, pricing, cta`;
    }
    /**
     * Build a business template prompt with section priorities.
     * The AI should generate content prioritizing services,
     * trust, professional positioning, and lead generation.
     */
    static buildBusinessPrompt(profile) {
        return `Generate content for a business website:
    - Must include: Services, Trust, Professional positioning, Lead generation
    - Format: JSON with sections: hero, about, services, cta`;
    }
    static defaultMetadata() {
        return {
            generationId: `gen-${Date.now()}-${Math.random().toString(36).slice(2)}`,
            templateId: "",
            sectionsGenerated: [],
            generationTime: 0,
            modelUsed: "none",
        };
    }
}
exports.AIService = AIService;
AIService.provider = null;
exports.default = AIService;
//# sourceMappingURL=ai.service.js.map