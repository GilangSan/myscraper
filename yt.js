/* created by lang
youtube dl scraper
package: axios, cheerio
usage:
getInfo('url') // get video info
mp4 ('url') // get video media
mp3 ('url') // get audio media
dont delete the wm hehe*/

const axios = require('axios')
const cheerio = require('cheerio')

async function getInfo(url){
    let { data } = await axios.get(`https://api.flvto.top/@api/search/YouTube/${url}`, {
        headers: {
            "Referer": "https://ytshortsdown.com/",
            "Origin": "https://ytshortsdown.com",
            "Content-Type": "application/json",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    return data.items[0]
}

async function mp3(url) {
    const id = url.split('v=')[1]
    let { data } = await axios.post('https://es.flvto.top/converter', {
        "id": id,
        "fileType": "mp3"
    },
    {
        headers: {
            "Referer": `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
            "Origin": "https://es.flvto.top",
            "Content-Type": "application/json",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    for (let i = 99; i > data.progress;) {
        await delay(2000)
        let result = await axios.post('https://es.flvto.top/converter', {
            "id": id,
            "fileType": "mp3"
        },
        {
            headers: {
                "Referer": `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
                "Origin": "https://es.flvto.top",
                "Content-Type": "application/json",
                "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
            }
        })
        data = result.data
    }
    return data
}

async function mp4(url) {
    const id = url.split('v=')[1]
    let { data } = await axios.post('https://es.flvto.top/converter', {
        "id": id,
        "fileType": "mp4"
    },
    {
        headers: {
            "Referer": `https://es.flvto.top/widget?url=https://www.youtube.com/watch?v=${id}`,
            "Origin": "https://es.flvto.top",
            "Content-Type": "application/json",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    return {
        title: data.title,
        result: data.formats[0],
    }
}