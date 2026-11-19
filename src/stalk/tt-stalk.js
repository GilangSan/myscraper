/**
 * TikTok Stalk from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

let headers = {
    "Content-Type": 'application/json',
    Origin: 'https://tokviewer.net',
    Referer: 'https://tokviewer.net/id',
    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
}

async function ttStalk(username, limit = 10) {
    if (!username) return 'Wheres the username?'
    try {
        let user = await axios.post('https://tokviewer.net/api/check-profile', {
            "username": username
        }, {
            headers
        })
        let video = await axios.post('https://tokviewer.net/api/video', {
            "username": username,
            "offset": 0,
            "limit": limit
        }, {
            headers
        })
        return {
            profile: user.data.data,
            video: video.data.data
        }
    } catch (e) { return e }
}

/* usage
(async () => console.log(await ttStalk('bzrk_killer')))() */