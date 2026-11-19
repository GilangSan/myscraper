/**
 * YT Downloader from lang
 * package: axios, crypto-js
 * usage at bottom
 */

const axios = require('axios')
const CryptoJS = require('crypto-js')

async function info(url) {
    if (!url) return 'Wheres the url'
    try {
        const SHARED_SECRET = "4W5crB-=A/klR]!";
        const ts = Date.now();
        const origin = "http://192.168.251.190:3000";
        const payload = `${ts}|${origin}|${SHARED_SECRET}`;
        const signature = CryptoJS.SHA256(payload).toString();

        let { data } = await axios.post('https://yespotato.com/youtu999', {
            signature,
            ts,
            url
        }, {
            headers: {
                "Content-Type": "application/json",
                origin: "https://yespotato.com",
                referer: "https://yespotato.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        return data
    } catch (e) {return e}
}

async function download(url, quality = '480p') {
    if (!url) return 'Wheres the url'
    try {
        const SHARED_SECRET = "4W5crB-=A/klR]!";
        const ts = Date.now();
        const origin = "http://192.168.251.190:3000";
        const payload = `${ts}|${origin}|${SHARED_SECRET}`;
        const signature = CryptoJS.SHA256(payload).toString();

        let { data } = await axios.post('https://yespotato.com/youtu999', {
            signature,
            ts,
            url
        }, {
            headers: {
                "Content-Type": "application/json",
                origin: "https://yespotato.com",
                referer: "https://yespotato.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        console.log(data)
        const index = data.urls.findIndex(item => item.qualityLabel === quality);
        const audio = data.urls.findIndex(item => item.mimeType === 'audio/mp4; codecs="mp4a.40.2"');
        let videos = data.urls[index]
        let audios = data.urls[audio]
        let resp = await axios.post('https://yespotato.com/download-file', {
            contentLength: videos.contentLength, file_type: 'video', has_audio: 'false', url: videos.url, audioSize: audios.contentLength, audioURL: audios.url
        }, {
            headers: {
                "Content-Type": "application/json",
                origin: "https://yespotato.com",
                referer: "https://yespotato.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        console.time('downloading')
        let dl = await axios.get(`https://yespotato.com/progress/${resp.data.file_name}`)
        let datas = dl.data
        while (datas.status !== 'done') {
            let dls = await axios.get(`https://yespotato.com/progress/${resp.data.file_name}`)
            datas = dls.data
            console.log(datas)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        console.log(datas)
        console.time('encoding')
        let encode = await axios.post('https://yespotato.com/encode', {
            video_url: datas.video_path,
            audio_url: datas.audio_path
        }, {
            headers: {
                "Content-Type": "application/json",
                origin: "https://yespotato.com",
                referer: "https://yespotato.com/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        console.log(encode.data.file_name)
        let encodes = await axios.get(`https://yespotato.com/merge-progress/${encode.data.file_name}`)
        let datad = encodes.data
        console.log(datad)
        while (datad.status !== 'done') {
            let dls = await axios.get(`https://yespotato.com/merge-progress/${encode.data.file_name}`)
            datad = dls.data
            console.log(datad)
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        return {
            download: `http://yespotato.com${datad.outputLink}`
        }
    } catch (e) { return e }
}

/* usage

*IMPORTANT*
u can see the available quality from info, at urls array, qualityLabel!

(async () => {
    let infos = await info('https://youtu.be/DYyFnbbf8d4?si=POAPuzMi7feLLIW_')
    let res = await download('https://youtu.be/DYyFnbbf8d4?si=POAPuzMi7feLLIW_', '720p')
    console.log(res)
})() */