/**
 * Facebook Downloader
 * @author Lang
 * @package axios, cheerio
 * @function fbdl(url)
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function fbdl(url) {
    let form = new URLSearchParams({
        codehap_link: url,
        codehap: true
    })
    let {data} = await axios.post('https://fadown.com/result.php', form, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
            "Origin": "https://fadown.com",
            "Referer": "https://fadown.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            cookie: `codehap_domain=fadown.com`
        }
    })
    const $ = cheerio.load(data)
    let result = {
        image: [],
        video: []
    }
    $('.row .col-sm-6').has('img').each((i,e) => {
        let url = $(e).find('a').attr('href')
        result.image.push(url)
    })
    $('.row .col-sm-6').has('video').each((i,e) => {
        let url = $(e).find('a').attr('href')
        result.video.push(url)
    })
    return result
}
