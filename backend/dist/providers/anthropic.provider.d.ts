import { AIBusinessProfile, AIGenerateResponse } from "../services/ai.service";
export declare class AnthropicProvider implements AIService.AIProviderAdapter {
    private apiKey;
    private model;
    constructor(apiKey: string, model?: string);
    generateContent(profile: AIBusinessProfile, templateSections: string[]): Promise<AIGenerateResponse>;
    rewriteContent(existingContent: string, instruction: string): Promise<{
        success: boolean;
        content: string;
        error?: string;
    }>;
}
