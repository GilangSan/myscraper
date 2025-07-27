/**
 * Prompt Enhancer from Lang
 * package: axios, crypto
 * usage at bottom
 */

const axios = require('axios')
const crypto = require('crypto');

const KEY = "kR9p2sL7mZ3xA1bC5vN8qE4dF6gH2jK3";
const IV = "a1B2c3D4e5F6g7H8";

function decryptData(encryptedBase64) {
    try {
        const keyBuffer = Buffer.from(KEY).slice(0, 32);
        const ivBuffer = Buffer.from(IV).slice(0, 16);
        const decipher = crypto.createDecipheriv('aes-256-cbc', keyBuffer, ivBuffer);
        let decrypted = decipher.update(encryptedBase64, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        try {
            return JSON.parse(decrypted);
        } catch {
            return decrypted;
        }
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Failed to decrypt data');
    }
}

async function getToken(){
    try {
        let res = await axios.get('https://prompthancer.com/api/token', {
            headers: {
                "Content-Type": "application/json",
                Referer: "https://prompthancer.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }})

        return {
            data: res.data,
            cookie: res.headers['set-cookie'] ? res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ') : ''
        }
    } catch (e) {
        return e;
    }   
}

async function promptEnhancer(prompt, type = 'basic') {
    if (!prompt) return 'Where is the prompt?';
    try {
        let endpoint = type == 'basic' ? 'https://prompthancer.com/api/enhancebasic' : 'https://prompthancer.com/api/enhancemid';
        let tokenResponse = await getToken();
        if (tokenResponse instanceof Error) {
            return `Error fetching token: ${tokenResponse.message}`;
        }
        let { data } = await axios.post(endpoint, {
            "originalPrompt": prompt,
    }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${tokenResponse.data.token}`,
                'Cookie': tokenResponse.cookie,
                'Origin': 'https://prompthancer.com',
                'Referer': 'https://prompthancer.com/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
    }})
    return data
    } catch (e) {
        return e;
    }
}

(async () => {
    // Example usage
    // Available types: 'basic', 'mid'
    const prompt = "a website landing page";
    const enhancedPrompt = await promptEnhancer(prompt, 'mid');
    console.log(decryptData(enhancedPrompt.data));
})()