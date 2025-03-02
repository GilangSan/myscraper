/**
 * Redirect Detective Scraper
 * @author Lang 
 * @package axios, cheerio
 * @function redirectDetective(url)
 * dont delete wm kyah
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function redirectDetective(url) {
    let formData = new FormData()
    formData.append('w', url)
    formData.append('f', false)
    let { data } = await axios.post('https://redirectdetective.com/ld.px', formData, {
        headers: {
            "content-type": "application/x-www-form-urlencoded",
            "origin": "https://redirectdetective.com",
            "referer": "https://redirectdetective.com/",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    const $ = cheerio.load(data)
    let redirectTo = $('.tooltips').last().text().trim()

    return {
        originalUrl: url,
        redirectTo
    }
}
