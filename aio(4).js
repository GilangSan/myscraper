/** All in one down from lang
    package: axios
    usage at bottom
*/

const axios = require('axios');

async function aio(url) {
    if (!url) throw new Error('No URL provided');
    try {
        let { data } = await axios.post('https://tera.backend.live/allinone', { url }, {
            headers: {
                Host: 'tera.backend.live',
                'User-Agent': 'okhttp/5.0.0-alpha.10',
                'x-api-key': 'pxrAEVHPV2S0yczPyv9bE9n8JryVwJAw'
            }
        })
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

(async () => {
    let result = await aio('https://www.instagram.com/p/DNpmAqzPwd7/?utm_source=ig_web_copy_link');
    console.log(result);

})()
