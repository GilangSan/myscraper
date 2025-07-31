/**
 * Text-to-Speech (TTS) using Crikk.com
 * package: axios, cheerio
 * usage at bottom
 */

const axios = require('axios');
const cheerio = require('cheerio');

const availableVoices = [
    'en-US-AndrewMultilingualNeural',
    'en-US-AvaMultilingualNeural',
    'en-US-BrianMultilingualNeural',
    'en-US-EmmaMultilingualNeural',
    'fr-FR-RemyMultilingualNeural',
    'fr-FR-VivienneMultilingualNeural',
    'de-DE-FlorianMultilingualNeural',
    'de-DE-SeraphinaMultilingualNeural',
    'it-IT-GiuseppeMultilingualNeural',
    'pt-BR-ThalitaMultilingualNeural',
    'id-ID-ArdiNeural',
    'id-ID-GadisNeural'
]

async function getToken() {
    let res = await axios.get('https://crikk.com/text-to-speech');
    const $ = cheerio.load(res.data);
    const token = $('input[name=_token]').val();
    return {
        cookie: res.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; '),
        token
    }
}

async function tts(text, language = 'Indonesia', voice = 'en-US-AndrewMultilingualNeural') {
    if (!text) return 'Please provide text for TTS.'
    try {
        let { token, cookie } = await getToken();
        let form = new URLSearchParams();
        form.append('text', text);
        form.append('language', language);
        form.append('voice', voice);
        form.append('_token', token);
        let { data } = await axios.post('https://crikk.com/app/generate-audio-frontend', form, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
                origin: 'https://crikk.com',
                referer: 'https://crikk.com/text-to-speech',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'x-csrf-token': 'P33VfbSjpWXTGPU34fyqatxQGRLjVs9OtQyUBRuG',
                cookie
            }
        })
        const buffer = Buffer.from(
            data.audio.split('base64,')[1],  // only use encoded data after "base64,"
            'base64'
        )
        return buffer
    } catch (e) {
        return e
    }
}

/*
usage

voice available above, sebenernya masih banyak, tapi bs check sendiri di https://crikk.com/text-to-speech
*/
(async () => {
    let audio = await tts('Halo siapa namamu?', 'Indonesia', availableVoices[10])
    require('fs').writeFileSync('./tts.mp3', audio);
})()