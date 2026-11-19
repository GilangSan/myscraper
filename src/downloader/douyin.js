/**
 * Douyin Downloader
 * @author Lang
 * @package axios
 * @function douyin(url)
 */

const axios = require('axios')

async function douyin(url){
  if (!url) return 'Url ny mana kocak?'
  try{
    let form = new URLSearchParams({
      'url': url
    })
    let { data } = await axios.post(`https://savedouyin.net/proxy.php`, form, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=UTF-8',
        'origin': 'https://savedouyin.net',
        'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
      }
    })
    let mp4req = await axios.get(data.api.mediaItems[0].mediaUrl)
    let mp3req = await axios.get(data.api.mediaItems[1].mediaUrl)
    
    return {
      info: data.api,
      media: {
        video: mp4req.data.fileUrl,
        audio: mp3req.data.fileUrl
      }
    }
  } catch (e) {
    return e
  }
}

/**
(async () => {
  let g = await douyin('https://v.douyin.com/mAhqPXH9Dk8/')
  console.log(g)
  })()*/
