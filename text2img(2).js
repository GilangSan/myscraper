/**
 * IMG2TEXT Scraper from lang
 * package: axios
 * usage dibawah.
 */

const axios = require('axios')

async function text2img(prompt) {
    if (!prompt) return 'Where the prompt?'
    let ip = (Math.floor(Math.random() * 255) + 1)+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))+"."+(Math.floor(Math.random() * 255))
    let { data } = await axios.post('https://internal.users.n8n.cloud/webhook/ai_image_generator', {
        "prompt": prompt
    }, {
        headers: {
            "Content-Type": "application/json",
            "Origin": "https://n8n.io",
            "Referer": "https://n8n.io/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
            "X-Client-Ip": ip
        }
    })

    return data
}

/* usage
(async () => {
    console.log(await text2img('sunset in paradise'))
})()
    */
