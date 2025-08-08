/**
 * YT Summarizer from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

const availableGenres = ["general", "review", "educational", "news", "gaming", "howto", "commentary", "travel", "cooking"]
const availableOptimization = ["standard", "aggressive"]
const availableSummary = ["standard", "concise", "detailed"]

async function youtubeSummarizer(url, genre = 'general', optimization = 'standard', summary = 'standard', prompt = '') {
    if(!availableGenres.includes(genre)) return 'available genres: '+availableGenres
    if(!availableOptimization.includes(optimization)) return 'available optimization: '+availableOptimization
    if(!availableSummary.includes(summary)) return 'available summary: '+availableSummary
    if (!url) return 'Wheres the url'
    try {
        let { data } = await axios.post('https://ytsummary.shadowlab.live/summarize', {
            "url_or_id": url,
            "genre": genre,
            "optimization_level": optimization,
            "summary_length": summary,
            "custom_prompt": prompt
        }, {
            headers: {
                origin: 'https://youtubesummary.pro',
                referer: 'https://youtubesummary.pro/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
                'x-api-key': '7WKwQuLBrDs6jQUGf2m9MJiC8NWuPn11'
            }
        })
        return data
    } catch (e) {
        return e
    }
}

/* usage
you can see the vailable params on the top
(async () => console.log(await youtubeSummarizer('https://youtu.be/7gMwkCTbHMs?si=W4ZmL9Qnn0F9mu3k', 'gaming', 'standard', 'standard', 'how player aiming')))() */