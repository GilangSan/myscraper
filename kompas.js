/* created by lang
kompas news scraper
package: axios, cheerio
usage: kompas() // get update and popular news
*/

const axios = require('axios')
const cheerio = require('cheerio')

async function kompas() {
    let { data } = await axios.get('https://www.kompas.com/')
    const $ = cheerio.load(data)
    let result = {
        updated: [],
        popular: []
    }

    let title = $('.hlItem').each((i,e) => {
        let title = $(e).find('.hlTitle').text().trim()
        let img = $(e).find('img').attr('src') ? $(e).find('img').attr('src') : 'system cant get the image'
        let url = $(e).find('a').attr('href')

        result.updated.push({
            title,
            img,
            url
        })
    })
    
    $('.mostItem').each((i, e) => {
        let title = $(e).find('h2').text().trim()
        let url = $(e).find('a').attr('href')
        let channel = $(e).find('.mostChannel').text().trim()

        result.popular.push({
            title,
            channel,
            url
        })
        result.popular.splice(5)
    })

    return result
}