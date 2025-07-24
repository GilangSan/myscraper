/**
 * Poster Maker AI from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

async function createPoster(prompt, text = '', type = 'custom', style = 'minimal') {
    if (!prompt) return 'Wheres the prompt?'
    try {
        let { data } = await axios.post('https://app.signpanda.me/seo_tools/ai_poster_generator', {
            "prompt": prompt,
            "poster_type": type,
            "style": style,
            "overlay_text": text
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Host': 'app.signpanda.me',
                'Origin': 'https://www.appointo.me',
                'Referer': 'https://www.appointo.me/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        })
        return data
    } catch (e) { return e }
}

/* usage

available type : event, movie, motivational, sale, festival, birthday, custom
available style : minimal, bold, vintage, realistic, cartoon

(async () => {
    console.log(await createPoster('a tools that helps you making script', 'Lang Tools', 'sale', 'realistic'))
})() */