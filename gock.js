/**
 * Gock Scraper from lang (for generating prompt or smth)
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

class Gock {
    constructor() {
        this.base = 'https://ai.gock.net',
            this.headers = {
                'Content-Type': 'application/json',
                Host: 'ai.gock.net',
                Origin: 'https://ai.gock.net',
                Referer: 'https://ai.gock.net/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        this.endpoint = {
            prompt: '/api/flux',
            review: '/api/review',
            code: '/api/html-generator',
        }
    }

    async prompt(prompt, type = 'flux', model = 'google:gemini-2.5-flash', number = 3) {
        if (!prompt) return 'Wheres the prompt?'
        try {
            let { data } = await axios.post(this.base + this.endpoint.prompt, {
                "description": prompt,
                "options": {
                    "model": model,
                    "numberOfPrompts": number
                },
                "task": type
            }, { headers: this.headers })
            const prompts = Array.from(data.matchAll(/<prompt>([\s\S]*?)<\/prompt>/g), m => m[1].trim());
            return prompts
        } catch (e) { return e }
    }

    async review(prompt, style = 'technical', model = 'google:gemini-2.5-flash', system = '') {
        if (!prompt) return 'Wheres the prompt?'
        try {
            let { data } = await axios.post(this.base + this.endpoint.review, {
                "input": prompt,
                "options": {
                    "model": model,
                    "style": style,
                    "systemPrompt": system
                }
            }, { headers: this.headers })

            return data
        } catch (e) { return e }
    }

    async code(prompt, model = 'google:gemini-2.5-flash') {
        if (!prompt) return 'Wheres the prompt?'
        try {
            let { data } = await axios.post(this.base + this.endpoint.code, {
                "input": prompt,
                "options": {
                    "model": model
                }
            }, { headers: this.headers })

            return data
        } catch (e) { return e }
    }
}

/* Usage And Example!

class: Gock()

model: google:gemini-2.0-flash, google:gemini-2.0-flash-lite, google:gemini-2.5-flash, together:meta-llama/Llama-3.3-70B-Instruct-Turbo-Free

function:

prompt(prompt, type, model, numberOfResults) // generate prompt
type: flux, video // flux for image (default)

review(prompt, style, model, systemPrompt) // for enchance text
style: technical, business, marketing, buzzword

code(prompt, model) // bug sometimes

(async () => {
    let gock = new Gock()
    console.log(await gock.prompt('Bird jumping'))
})()
    */