/* created by lang
lyric scraper
package: axios, cheerio
usage:
lyricSearch('your query')
getLyric('lyric url')
thanks to azlyrics!
*/

const axios = require('axios')
const cheerio = require('cheerio')

async function lyricSearch(q) {
    let { data } = await axios.get(`https://search.azlyrics.com/search.php?q=${q}&x=7a094730a47745dab31ea23ea43136cc56f080d9bd4f47363b5872c9b7e2db4e`)
    const $ = cheerio.load(data)
    let result = []

    $('table').first().find('td.visitedlyr').each((i,e) => {
        let title = $(e).find('a').text().trim().split(`${i+1}. `)[1]
        let url = $(e).find('a').attr('href')

        result.push({
            title,
            url
        })
    })
    return result
}


async function getLyric(url) {
    let { data } = await axios.get(url)
    const $ = cheerio.load(data)

    let title = $('div.col-xs-12').find('b').eq(1).text().trim()
    let writer = $('div.smt').eq(2).text().split(':')[1].trim()
    let lyric = $('div.col-xs-12').find('div:has(br)').first().text().trim()

    let result = {
        title,
        writer,
        lyric
    }

    return result
}