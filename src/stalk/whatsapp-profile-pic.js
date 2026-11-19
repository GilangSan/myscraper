/**
 * Whatsapp PP Scraper by lang
 * packages: bycf, axios
 * official channel: https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const { shannz: cf } = require('bycf')
const axios = require('axios')

async function getProfilePic(number) {
    if (!number) return { error: 'Number is required' }
    try {
        const token = await cf.turnstileMin(
            "https://snaplytics.io/whatsapp-dp-download/",
            "0x4AAAAAAARDrbTmtHfqWe9y",
            null
        );
        let { data } = await axios.post(`https://waapi.snaplytics.io/wa-dp/?phone=${encodeURIComponent(number)}`, {
            cftoken: token
        }, {
            headers: {
                'content-type': 'application/json',
                origin: 'https://snaplytics.io',
                referer: 'https://snaplytics.io/',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
            }
        })
        return data
    } catch (error) {
        return { error }
    }
}

(async () => {
    let res = await getProfilePic('62123456789')
    console.log(res)
})()