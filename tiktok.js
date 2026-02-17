/**
 * Tiktok Download
 * @author lang
 * @function tiktok(url: string)
 */

const axios = require('axios')

async function getCsrf() {
    const res = await (await axios.get('https://snapixels.com/api/download/get_csrf_token', {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
        }
    })).data
    return res.token
}

async function tiktok(url) {
    if (!url) return 'url parameter is required!'
    const token = await getCsrf()
    const res = await (await axios.post('https://snapixels.com/api/download/fetch', {
        url,
        "csrf_token_tiktok": token
    }, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            cookie: `csrf_cookie_tiktok=${token}; site_lang=en`,
            origin: "https://snapixels.com",
            referer: "https://snapixels.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
        }
    })).data
    return res
}

// example
(async () => {
    console.log(await tiktok('https://www.tiktok.com/@febryansydney/video/7606265077242547476?is_from_webapp=1&sender_device=pc'))
})()