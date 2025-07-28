/** Vocal Remover from lang
 * package: axios, crypto
 * usage at bottom
 */

const axios = require('axios');
const crypto = require('crypto');

async function uploadTemp(image) {
    let form = new FormData()
    let buffer = Buffer.from(image)
    const blob = new Blob([buffer], { type: 'audio/mp3' });
    const file = new File([blob], 'audio.mp3', { type: 'audio/mp3' });
    form.append('file', file)
    let { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form)
    let id = data.data.url.split('http://tmpfiles.org/')[1]
    let dl = 'http://tmpfiles.org/dl/' + id
    return dl
}

async function vocalRemover(audio) {
    if (!audio) return 'Where is the audio?';
    try {
        new URL(audio);
    } catch (e) {
        audio = await uploadTemp(audio);
    }
    try {
        const uniqueId = crypto.randomBytes(16).toString('hex');
        let { data } = await axios.post('https://api.songgenerator.io/api/v1/vocal-removal/custom/file-create', {
            "fileUrl": audio
        }, {
            headers: {
                'Content-Type': 'application/json',
                Origin: 'https://songgenerator.io',
                Referer: 'https://songgenerator.io/',
                Uniqueid: uniqueId,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        })
        let uuid = data.data.uuid;
        let res = await axios.get(`https://api.songgenerator.io/api/v1/vocal-removal/custom/detail?uuid=${uuid}`, {
            headers: {
                Origin: 'https://songgenerator.io',
                Referer: 'https://songgenerator.io/',
                Uniqueid: uniqueId,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            }
        });
        while (res.data.data.status !== 'SUCCESS') {
            await new Promise(resolve => setTimeout(resolve, 3000));
            res = await axios.get(`https://api.songgenerator.io/api/v1/vocal-removal/custom/detail?uuid=${uuid}`, {
                headers: {
                    Origin: 'https://songgenerator.io',
                    Referer: 'https://songgenerator.io/',
                    Uniqueid: uniqueId,
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                }
            });
        }
        return JSON.parse(res.data.data.fileLink);
        } catch (e) {
            return e
        }
    }

(async () => {
        // Example usage
        const audioUrl = require('fs').readFileSync('./exanple-1.mp3'); // Replace with your audio file path or URL
        const result = await vocalRemover(audioUrl);
        console.log(result);
})()