import * as vscode from 'vscode';
import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Type definitions for OpenRouter API response
interface OpenRouterMessage {
    role: string;
    content: string;
}

interface OpenRouterChoice {
    message: OpenRouterMessage;
    finish_reason: string;
}

interface OpenRouterResponse {
    id: string;
    choices: OpenRouterChoice[];
    model: string;
}

let statusBarItem: vscode.StatusBarItem;
let debounceTimer: NodeJS.Timeout | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('TEMPO extension activated');

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(sparkle) TEMPO Running"; 
    statusBarItem.tooltip = "TEMPO Active";
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);

    const supportedLanguages = [
        'javascript', 'typescript', 'python', 'java', 'go', 
        'rust', 'cpp', 'c', 'csharp', 'php', 'ruby', 
        'swift', 'kotlin', 'scala', 'html', 'css', 'json'
    ];

    const provider = vscode.languages.registerInlineCompletionItemProvider(
        supportedLanguages.map(lang => ({ language: lang })),
        new AICompletionProvider(statusBarItem)
    );

    context.subscriptions.push(provider);

    const toggleCommand = vscode.commands.registerCommand('tempo.toggle', () => {
        const config = vscode.workspace.getConfiguration('tempo');
        const enabled = config.get<boolean>('enabled');
        config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
        vscode.window.showInformationMessage(`TEMPO ${!enabled ? 'enabled' : 'disabled'}`);
    });

    context.subscriptions.push(toggleCommand);
}

export function deactivate() {
    if (statusBarItem) {
        statusBarItem.dispose();
    }
    if (debounceTimer) {
        clearTimeout(debounceTimer);
    }
}

class AICompletionProvider implements vscode.InlineCompletionItemProvider {
    private cache: Map<string, { completion: string, timestamp: number }> = new Map();
    private readonly CACHE_TTL = 5000; 
    
    constructor(private statusBarItem: vscode.StatusBarItem) {}

    async provideInlineCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.InlineCompletionContext,
        token: vscode.CancellationToken
    ): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList> {
        
        const config = vscode.workspace.getConfiguration('tempo');
        const enabled = config.get<boolean>('enabled') !== false;
        
        if (!enabled) {
            return [];
        }

        const apiKey = config.get<string>('openRouterApiKey');
        const model = config.get<string>('model') || 'anthropic/claude-3.5-sonnet';
        const maxTokens = config.get<number>('maxTokens') || 150;

        if (!apiKey) {
            this.statusBarItem.text = "$(alert) No API Key";
            return [];
        }

        const linePrefix = document.lineAt(position).text.substring(0, position.character);
        if (linePrefix.trim().length === 0) {
            return [];
        }

        const startLine = Math.max(0, position.line - 30);
        const endLine = Math.min(document.lineCount - 1, position.line + 10);
        const precedingText = document.getText(new vscode.Range(startLine, 0, position.line, position.character));
        const followingText = document.getText(new vscode.Range(position.line, position.character, endLine, document.lineAt(endLine).text.length));

        const language = document.languageId;

        const cacheKey = `${language}:${precedingText.slice(-200)}:${followingText.slice(0, 100)}`;
        
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
            const item = new vscode.InlineCompletionItem(cached.completion);
            item.range = new vscode.Range(position, position);
            return [item];
        }

        try {
            this.statusBarItem.text = "$(loading~spin) Generating...";
            
            const completion = await this.getCompletion(
                precedingText,
                followingText,
                language,
                apiKey,
                model,
                maxTokens,
                token
            );

            this.statusBarItem.text = "$(sparkle) AI Ready";

            if (completion && completion.trim().length > 0) {
                this.cache.set(cacheKey, { completion, timestamp: Date.now() });
                
                if (this.cache.size > 50) {
                    const firstKey = this.cache.keys().next().value;
                    if (firstKey !== undefined) {
                        this.cache.delete(firstKey);
                    }
                }

                const item = new vscode.InlineCompletionItem(completion);
                item.range = new vscode.Range(position, position);
                return [item];
            }
        } catch (error: any) {
            console.error('Error getting completion:', error);
            this.statusBarItem.text = "$(error) AI Error";
            setTimeout(() => {
                this.statusBarItem.text = "$(sparkle) AI Ready";
            }, 3000);
        }

        return [];
    }

    private async getCompletion(
        precedingText: string,
        followingText: string,
        language: string,
        apiKey: string,
        model: string,
        maxTokens: number,
        token: vscode.CancellationToken
    ): Promise<string> {
        
        const prompt = this.buildPrompt(precedingText, followingText, language);
        const controller = new AbortController();
        
        const cancelListener = token.onCancellationRequested(() => {
            controller.abort();
        });

        try {
            const httpReferer = process.env.HTTP_REFERER_URL || 'https://github.com/yourusername/tempo-vscode';

            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': httpReferer,
                    'X-Title': 'VS Code TEMPO'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [
                        {
                            role: 'system',
                            content: `You are an expert ${language} code completion assistant. Complete the code naturally at the cursor position. Provide only raw code without explanations, markdown, or code fences. Match the existing code style and indentation.`
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: maxTokens,
                    temperature: 0.2,
                    top_p: 0.95,
                    stream: false
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`OpenRouter API error: ${response.statusText} - ${errorText}`);
            }

            const data = await response.json() as OpenRouterResponse;
            let completion = data.choices[0]?.message?.content || '';

            completion = this.cleanCompletion(completion, precedingText);

            return completion;
        } finally {
            cancelListener.dispose();
        }
    }

    private buildPrompt(precedingText: string, followingText: string, language: string): string {
        const hasFollowingCode = followingText.trim().length > 0;
        
        let prompt = `Complete this ${language} code at the <CURSOR> position:\n\n`;
        prompt += `${precedingText}<CURSOR>`;
        
        if (hasFollowingCode) {
            prompt += `${followingText}\n\n`;
            prompt += `Provide only the code that belongs at <CURSOR>. `;
        } else {
            prompt += `\n\nComplete the current statement or block. `;
        }
        
        prompt += `Output raw code only, no explanations.`;
        
        return prompt;
    }

    private cleanCompletion(text: string, precedingText: string): string {
        text = text.replace(/```[\w]*\n?/g, '');
        text = text.replace(/```/g, '');
        text = text.replace(/^(Here's the completion|The completion is|Here is|This completes)[:\s]*/i, '');
        text = text.trim();
        
        if (precedingText.endsWith(' ') || precedingText.endsWith('\t')) {
            // Keep as is
        } else {
            text = text.trimStart();
        }
        
        return text;
    }
}