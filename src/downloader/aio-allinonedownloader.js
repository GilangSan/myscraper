/**
 * AllInOne Downloader 
 * @author Lang
 * @package axios cheerio crypto-js tough-cookie axios-cookiejar-support
 * @function aio(url)
 * Support: x, ig, fb, tt, pint, story, imgur, tumblr, vimeo dll (except yt)
 */

const axios = require('axios')
const cheerio = require('cheerio')
const CryptoJS = require('crypto-js')
const tough = require('tough-cookie');
const { wrapper } = require('axios-cookiejar-support');
const jar = new tough.CookieJar();
const client = wrapper(axios.create({ jar }));

const headers = {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "origin": "https://allinonedownloader.com",
        "referer": "https://allinonedownloader.com/",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
      }

async function getCookie(){
  let cookie = await client.get('https://allinonedownloader.com/in/')
  let json = cookie.config.jar.toJSON()
  let cookies = json.cookies.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
  return cookies
}

async function getHash(url, token){
  var key = CryptoJS.enc.Hex.parse(token);
	var iv = CryptoJS.enc.Hex.parse('afc4e290725a3bf0ac4d3ff826c43c10');
	var encrypted = CryptoJS.AES.encrypt(url,key,{iv,padding:CryptoJS.pad.ZeroPadding});
	var urlhash = encrypted.toString();
	return urlhash
}

async function aio(url) {
  if (!url) return 'Where the url parameter?'
  try {
    let cookie = await getCookie()
    headers['cookie'] = cookie
    let { data } = await axios.get('https://allinonedownloader.com/in/', {headers})
    const $ = cheerio.load(data)
    const token = $('input#token').val()
    const endpoint = $('input#scc').val()
    const urlhash = await getHash(url, token)
    let q = new URLSearchParams({
      url,
      token,
      urlhash
    })
    result = await axios.post(`https://allinonedownloader.com${endpoint}`, q, {
      headers
    })
    return result.data
  } catch (e) {
    return {
      status: false,
      msg: 'Invalid url or error from server.',
      error: e
    }
  }
}
