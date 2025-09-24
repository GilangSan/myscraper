const axios = require('axios');
const https = require('https');

// available sizes
const size = ['1216x832', '1152x896', '1344x768', '1563x640', '832x1216', '896x1152', '768x1344', '640x1536', '1024x1024']

class Zonerai {
    constructor() {
        this.baseUrl = 'https://api.zonerai.com'
        this.headers = {
            'Content-Type': 'multipart/form-data',
            Origin: 'https://zonerai.com',
            Referer: 'https://zonerai.com/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
            'X-Client-Platform': 'web',
        }
    }

    async text2img(prompt, image = false, size = '1216x832', upscale = 0){
        if (!prompt) {
            throw new Error('Prompt is required');
        }
        try{
            let formData = new FormData();
            if (image) {
                const blob = new Blob([image], { type: 'image/jpeg' });
                const file = new File([blob], "image.jpg", { type: 'image/jpeg' });
                formData.append('Image', file);
            }
            formData.append('Prompt', prompt);
            formData.append('Size', size);
            formData.append('Upscale', upscale);
            formData.append('Language', 'eng_Latn')
            formData.append('Batch_Index', 0);
            let { data } = await axios.post(`${this.baseUrl}/zoner-ai/txt2img`, formData, {
                headers: {
                    ...this.headers,
                },
                responseType: "arraybuffer",
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            return data;
        } catch (error) {
            console.error('Error generating image:', error);
        }
    }

    async img2txt(buffer){
        if (!buffer) {
            throw new Error('Image buffer is required');
        }
        try {
            let formData = new FormData();
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            const file = new File([blob], "image.jpg", { type: 'image/jpeg' });
            formData.append('Image', file);
            formData.append('Language', 'eng_Latn');
            let { data } = await axios.post(`${this.baseUrl}/zoner-ai/img2txt`, formData, {
                headers: {
                    ...this.headers,
                },
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            });
            return data;
        } catch (error) {
            console.error('Error extracting text from image:', error);
        }
    }
}

(async () => {
    const zonerai = new Zonerai();
    let buffer = await zonerai.text2img('A beautiful sunset over the mountains')
    require('fs').writeFileSync('sunset.png', buffer);
    console.log(await zonerai.img2txt(buffer));
})()