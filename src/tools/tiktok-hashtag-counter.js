/**
 * Tiktok Hashtag Counter by lang
 * package: axios, cheerio
 * official channel: https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function getHashtagCount(hashtag) {
    if (!hashtag) return 'Wheres the hashtag?'
    try {
        let { data } = await axios.get(`https://tiktokhashtags.com/hashtag/` + encodeURIComponent(hashtag))
        const $ = cheerio.load(data)
        let trendingSec = $('#tranding')
        let posts = $('.shortcode-html').find('.col-lg-4').eq(0).find('.g-font-size-26').text().trim()
        let views = $('.shortcode-html').find('.col-lg-4').eq(1).find('.g-font-size-26').text().trim()
        let viewsPerPost = $('.shortcode-html').find('.col-lg-4').eq(2).find('.g-font-size-26').text().trim()
        let mostPopular = $('p1').text().trim()
        let trending = []
        trendingSec.find('table tbody tr').each((i, el) => {
            trending.push({
                hashtag: $(el).find('td').eq(1).text().trim().replace('#', ''),
                posts: $(el).find('td').eq(2).text().trim(),
                views: $(el).find('td').eq(3).text().trim(),
                postsPerView: $(el).find('td').eq(4).text().trim()
            })
        })
        return {
            posts,
            views,
            viewsPerPost,
            mostPopular,
            trending
        }
    } catch (e) { return e }
}

(async () => {
    console.log(await getHashtagCount('viral'))
})()