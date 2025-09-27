/**
 * LiveChart.me Anime update weekly from lang
 * package: axios, cheerio
 * official channel: https://www.whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function getUpdate() {
    try {
        let { data } = await axios.get('https://www.livechart.me/schedule')
        const $ = cheerio.load(data)
        const lc = $('.lc-timetable')
        let result = []
        lc.find('.lc-placeholder').remove()
        lc.find('.lc-timetable-day').each((i, el) => {
            result.push({
                day: $(el).find('.lc-timetable-day__heading').text().trim(),
                anime: []
            })
            $(el).find('.hidden').remove()
            $(el).find('.lc-timetable-timeslot').each((j, anime) => {
                const title = $(anime).find('.lc-tt-anime-title').text().trim()
                const time = $(anime).find('.lc-time').text().trim()
                const eps = $(anime).find('.lc-tt-release-label').text().trim()
                result[i].anime.push({ title, time, eps })
            })
        })
        return result
    } catch (e) { return e }
}

(async () => {
    let update = await getUpdate()
    console.log(update)
})()