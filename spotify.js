/* created by lang
*spotify search and down scraper*
package: axios
usage:
spotify('query serach' atau 'url tracks') // get info or search
spodl('url tracks') // audio music
dont delte wm hehe*/

const axios = require('axios')

async function spotify(url) {
    let { data } = await axios.post(`https://spotify-down.com/api/metadata?link=${url}`,
    {
        headers:{
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Origin": "https://spotify-down.com",
            "Referer": "https://spotify-down.com/",
            "Sec-Ch-Ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        }
    })

    return data
}

async function spodl(url, title, artist) {
    let info = await axios.post(`https://spotify-down.com/api/metadata?link=${url}`,
        {
            headers:{
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
                "Origin": "https://spotify-down.com",
                "Referer": "https://spotify-down.com/",
                "Sec-Ch-Ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            }
        })

    let { data } = await axios.get(`https://spotify-down.com/api/download?link=${url}&n=${info.data.data.title}&a=${info.data.data.artists}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Origin": "https://spotify-down.com",
            "Referer": "https://spotify-down.com/",
            "Sec-Ch-Ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        }
    })

    return data
}