/* created by lang
igstalk scraper
package: axios, cheerio
usage: igStalk('username')
dont delete wm hehe*/

const axios = require('axios')
const cheerio = require('cheerio')

async function igStalk(username) {
    let { data } = await axios.get(`https://greatfon.io/v/${username}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "priority": "u=0, i",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "upgrade-insecure-requests": 1,
            "authority": "greatfon.io",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
        }
    })
    const $ = cheerio.load(data)

    let name = $('div.items-top').find('h2').text().trim()
    let profileImg = $('figure').find('img').attr('src')
    let bio = $('div.items-top').find('div.text-sm').text().trim()
    let postValue= $('div.stats').find('.stat').eq(0).find('.stat-value').text().trim()
    let followers = $('div.stats').find('.stat').eq(1).find('.stat-value').text().trim()
    let following = $('div.stats').find('.stat').eq(2).find('.stat-value').text().trim()
    let post = []

    $('div.items-center:has(.card)').find('.card').each((i, e) => {
        let description = $(e).find('p').html().replace(/<br\s*\/?>/g, '\n').trim()
        let image = $(e).find('img').attr('src')

        post.push({
            description,
            image
        })
    })

    return {
        username,
        profileImg,
        name,
        bio,
        postValue,
        followers,
        following,
        post
    }
}
