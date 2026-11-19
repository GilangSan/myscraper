/**
 * Donghua Update Scraper by lang
 * package: axios, cheerio
 * official channel: https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function getDonghuaUpdate() {
    try {
        let { data } = await axios.get('https://anichin.watch/schedule/')
        const $ = cheerio.load(data)
        let result = []
        let sec = $('.postbody')
        sec.find('.schedulepage').each((i, el) => {
            result.push({
                day: $(el).find('h3').text().trim(),
                donghua: []
            })
            $(el).find('.bs').each((j, ev) => {
                result[i].donghua.push({
                    title: $(ev).find('.tt').text().trim(),
                    img: $(ev).find('img').attr('src'),
                    eps: $(ev).find('.bt .sb').text().trim(),
                    time: $(ev).find('.bt .epx').text().trim(),
                })
            })
        })
        return result
    } catch (e) {
        return e
    }
}

(async () => {
    let res = await getDonghuaUpdate()
    console.log(res)
})()