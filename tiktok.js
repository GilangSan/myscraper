// ya referer juga boleh la

const axios = require("axios")

const tiktokRegex = /^(https?:\/\/)?(www\.)?(tiktok\.com|vt\.tiktok\.com|m\.tiktok\.com)\//

async function ttdl (url) {
    if (!tiktokRegex.test(url)) return 'Invalid URL'
    const res = await axios.post(`https://tikmate.netlify.app/api/download`, {
        "url": url,
        }, {
        headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/37.0.2062.94 Chrome/37.0.2062.94 Safari/537.36",
        "Referer": "https://tikmate.netlify.app/",
        "Origin": "https://tikmate.netlify.app/"
                 }}
                                )
    return res.data.data
    }

module.exports = { ttdl }
