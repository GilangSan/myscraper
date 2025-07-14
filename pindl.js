/**
 * Pinterest Down from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

async function pindl(url){
    if(!url) return 'Wheres the url?'
    try{
        new URL(url)
        try{
            let { data } = await axios.post('https://ssspin.app/api/get-metadata', {
                url
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Origin": "https://ssspin.app",
                    "Referer": "https://ssspin.app/",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
                }
            })
            return data.apiResponse.data
        } catch (e) {return e}
    } catch (e) {return 'Url salah'}
}

// usage
//(async () => console.log(await pindl('https://pin.it/6aJhqjqrE')))()