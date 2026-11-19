/**
 * Image Generation from Lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios');

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function handle(prompt, width = 1024, height = 1024) {
    let { data } = await axios.post('https://aiimagegenerator.online/api/generate-image/', {
        prompt,
        width,
        height,
        steps: 4
    }, {
        headers: {
            'Content-Type': 'application/json',
            Origin: 'https://aiimagegenerator.online',
            Referer: 'https://aiimagegenerator.online/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
    })
    return data
}

async function generate(prompt, width = 1024, height = 1024, maxRetries = 5) {
    if (!prompt) return 'Please provide a prompt for image generation.'

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const data = await handle(prompt, width, height)
            return data
        } catch (e) {
            const status = e.response?.status

            if (status === 502) {
                console.warn(`Attempt ${attempt} failed with 502. Retrying...`)
                await delay(1000 * attempt)
            } else {
                console.error('Non-retryable error:', e.message)
                throw e
            }
        }
    }

    throw new Error('Failed after maximum retry attempts.')
}

// usage example

(async () => {
    const prompt = 'a bird sitting on a tree branch'
    const imageData = await generate(prompt)
    console.log(imageData)
})();
