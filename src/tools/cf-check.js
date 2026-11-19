/**
 * CloudFlare Website Checker
 * Check DNS, Proxy, cname, SSL are use?
 * @author Lang
 * @package axios
 * @function cfCheck(url)
 */
const axios = require('axios')

async function cfCheck(url) {
  let body = new URLSearchParams({
    domain: url
  })
  let { data } = await axios.post('https://checkforcloudflare.selesti.com/api.php', body, {
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "origin": "https://checkforcloudflare.selesti.com",
      "referer": "https://checkforcloudflare.selesti.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  return data
}
