import { AIBusinessProfile, AIGenerateResponse } from "../services/ai.service";
export declare class OpenAIProvider implements AIService.AIProviderAdapter {
    private client;
    private apiKey;
    private model;
    constructor(apiKey: string, model?: string);
    generateContent(profile: AIBusinessProfile, templateSections: string[]): Promise<AIGenerateResponse>;
    rewriteContent(existingContent: string, instruction: string): Promise<{
        success: boolean;
        content: string;
        error?: string;
    }>;
    private buildSystemPrompt;
    private buildUserPrompt;
}
