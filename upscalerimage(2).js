/**
 * Upscaler Image from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

async function upscale(image) {
    if (!image) return 'Wheres the image?'
    try {
        let form = new FormData()
        let buffer = ''
        try {
            new URL(image)
            let { data } = await axios.get(image, { responseType: 'arraybuffer' })
            buffer = Buffer.from(data)
        } catch (e) {
            buffer = Buffer.from(image)
        }
        const blob = new Blob([buffer], { type: 'image/png' });
        const file = new File([blob], 'image.png', { type: 'image/png' });
        form.append('image', file)
        form.append('user_id', undefined)
        form.append('is_public', false)
        let { data } = await axios.post('https://picupscaler.com/api/generate/handle', form, {
            headers: {
                "Content-Type": 'multipart/form-data; boundary=----WebKitFormBoundary1jLHymZXTLGQCdNK',
                Origin: 'https://picupscaler.com',
                Referer: 'https://picupscaler.com/',
                "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        })
        return data
    } catch (e) { return e }
}

/* usage
(async () => {
    let image = require('fs').readFileSync('./960x0.webp')
    console.log(await upscale(image)) // bisa url juga
})() */