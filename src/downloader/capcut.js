/**
 * Capcut Down Scraper
 * @author Lang
 * @package axios
 * @function capcut(url)
 */
const axios = require('axios')

async function capcut(url){
  let { data } = await axios.post('https://3bic.com/api/download', {
    url
  }, {
    headers: {
      "content-type": "application/json",
      "origin": "https://3bic.com",
      "referer": "https://3bic.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  data.originalVideoUrl = 'https://3bic.com'+data.originalVideoUrl
  return data
}
