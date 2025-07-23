/**
 * ALL IN ONE Downloader form lang
 * package: axios, cheerio
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function getToken(){
    try{
        let { data } = await axios.get('https://getfvid.online/')
        const $ = cheerio.load(data)
        return $('#token').val()
    } catch (e) {return e}
}

async function aio(url){
    if(!url) return 'Wheres the url?'
    try{
        const token = await getToken()
    let form = new FormData()
    form.append('url', url)
    form.append('token', token)
    let { data } = await axios.post('https://getfvid.online/wp-json/aio-dl/video-data/', form, {
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            origin: 'https://getfvid.online',
            referer: 'https://getfvid.online/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
    })
    return data
    } catch(e) {return e}
}

/* usage
(async () => {
    console.log(await aio('https://www.facebook.com/share/p/1CWzvgc8cb/'))
})() */