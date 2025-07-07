/**
 * Instagram skrep from lang
 * package: axios and cheerio
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function ig(url) {
    if(!url) return 'Wheres the url?'
    try{
        let form = new URLSearchParams({
            url,
            lang: 'en'
        })
        let { data } = await axios.post('https://api.instasave.website/media', form, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Referer": "https://instasave.website/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        const $ = cheerio.load(data)
        let result = []
        $('section > div > div').each((i, e) => {
            result.push({
                thumbnail: $(e).find('img').attr('src').replace(/\\"/g, ''),
                download: $(e).find('a').attr('href').replace(/\\"/g, '')
            })
        })
        return result
    } catch (e) { return 'error'}
}

/* usage
(async () => {
    console.log(await ig('https://www.instagram.com/reel/DLo-s0TyPkj/?utm_source=ig_web_copy_link'))
})()*/
