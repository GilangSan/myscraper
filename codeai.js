/**
 * CodeAI - AI Code Generator from Lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios');

async function codeAI(prompt, model = 'gpt-4o') {
    if (!prompt) return 'Where is the prompt?';
    try {
        let { data } = await axios.post('https://ai-code-generator-refact2.toolzflow.app/api/chat/public', {
            "response_format": {
                "type": "json_schema",
                "json_schema": {
                    "name": "code_response",
                    "strict": true,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "code": {
                                "type": "string"
                            }
                        },
                        "required": [
                            "code"
                        ],
                        "additionalProperties": false
                    }
                }
            },
            "chatSettings": {
                "model": model,
                "temperature": 0.3,
                "contextLength": 16385,
                "includeProfileContext": false,
                "includeWorkspaceInstructions": false,
                "embeddingsProvider": "openai"
            },
            "messages": [
                {
                    "role": "system",
                    "content": "You are an expert in generating code snippets based on user input. Your task is to create clear and concise code."
                },
                {
                    "role": "user",
                    "content": `${prompt}. Provide only the generated code without explanations.`
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://ai-code-generator-refact2.toolzflow.app',
                'Referer': 'https://ai-code-generator-refact2.toolzflow.app/?__show_banner=false',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            }
        })
        return data
    } catch (e) {
        return e;
    }
}

/* usage

available models: gpt-4o, gpt-4o-mini, claude-3-5-sonnet

(async () => {
    console.log(await codeAI('write a landing page with html and css', 'claude-3-5-sonnet'));
})(); */