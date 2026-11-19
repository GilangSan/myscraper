/**
 * Youtube Downloader from Lang
 * package: axios, cheerio
 * usage at bottom
 */

const axios = require('axios');
const cheerio = require('cheerio');

class YTDL {
    constructor() {
        this.base = 'https://genyoutube.online',
            this.headers = {
                origin: 'https://genyoutube.online',
                referer: 'https://genyoutube.online/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
    }

    async detail(url) {
        if (!url) throw new Error('Please provide a valid YouTube URL');
        try {
            let { data } = await axios.post(`${this.base}/mates/en/analyze/ajax?retry=undefined&platform=youtube`, new URLSearchParams({ url, ajax: 1, lang: 'en' }), {
                headers: this.headers
            });
            const $ = cheerio.load(data.result);
            const table = $('table tbody tr')
            let audio = {
                quality: $(table).eq(1).find('td').eq(0).text().trim(),
                size: $(table).eq(1).find('td').eq(1).text().trim(),
                download: $(table).eq(1).find('td').eq(2).find('button').attr('onclick')
            }
            let video = []
            table.slice(3).each((i, el) => {
                if ($(el).hasClass('noaudio')) return;
                if (!$(el).find('svg').attr('class')) return;
                video.push({
                    quality: $(el).find('td').eq(0).text().trim(),
                    size: $(el).find('td').eq(1).text().trim(),
                    download: $(el).find('td').eq(2).find('.btn').attr('onclick') ? $(el).find('td').eq(2).find('.btn').attr('onclick') : $(el).find('td').eq(2).find('.btn').attr('href')
                })
            })
            return {
                title: $('#video_title').text().trim(),
                duration: $('.caption p').text().trim(),
                thumbnail: $('.img-thumbnail').attr('src'),
                audio,
                video
            }
        } catch (e) {
            throw new Error('Failed to fetch video details: ' + e.message);
        }
    }

    async download(param) {
        if (!param) throw new Error('Please provide a valid download parameter');
        try {
            let params = param.split('(')[1].split(')')[0].split(',').map(p => p.trim().replace(/'/g, ''));

            let { data } = await axios.post(`${this.base}/mates/en/convert?id=${params[2]}`, new URLSearchParams({
                platform: 'youtube',
                url: params[0],
                title: params[1],
                id: params[2],
                ext: params[3],
                note: params[5],
                format: params[6],
            }), {
                headers: this.headers
            });
            return data
        } catch (e) {
            throw new Error('Failed to download: ' + e.message);
        }
    }
}

/* Example usage:

{
      quality: '1080p60',
      size: '233.51M',
      download: "download('https://www.youtube.com/watch?v=uBtLIB1oRBs?si=TBpObPi-Hnuubl9U','Tricking Dewier Into Fighting The #2 Bedwars Player','5gYav3g6ZzRLYlAcqrXGxV4lCGshlIV51QmXxUPNUTeUbEYH92ehW+4bV8+cy37Q4OAPwxKFOPwWgTuS93pyvFdSiU7L/ndCyxAyBZAwD3k=','mp4',244857294,'1080p60','399')"
}

take the download value and pass it to the download function

(async () => {
    const ytdl = new YTDL();
    const videoDetails = await ytdl.detail("https://youtu.be/uBtLIB1oRBs?si=TBpObPi-Hnuubl9U");
    const urlDownload = await ytdl.download("download('https://www.youtube.com/watch?v=uBtLIB1oRBs?si=TBpObPi-Hnuubl9U','Tricking Dewier Into Fighting The #2 Bedwars Player','5gYav3g6ZzRLYlAcqrXGxV4lCGshlIV51QmXxUPNUTeUbEYH92ehW+4bV8+cy37Q4OAPwxKFOPwWgTuS93pyvFdSiU7L/ndCyxAyBZAwD3k=','mp4',244857294,'1080p60','399')");
    console.log(videoDetails);
}
)() */