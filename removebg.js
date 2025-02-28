/**
 * Created By Lang
 * Remove Background Scraper
 * @package axios
 * @function removebg(imageBuffer)
 * @returns {arrayBuffer}
 */

const axios = require('axios')

let headers = {
      "authority": "photoaid.com",
      "content-type": "text/plain;charset=UTF-8",
      "origin": "https://photoaid.com",
      "referer": "https://photoaid.com/en/tools/remove-background?srsltid=AfmBOoqBUTLrKXKSJLLo54PXv0RCH-53_H_OeNu8hhlmIhoV-b0CN5j8",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }

async function removebg(image){
  let base64 = image.toString('base64')
  let { data } = await axios.post('https://photoaid.com/en/tools/api/tools/upload', {
    "base64": base64,
    "reqURL": "/remove-background/upload"
  }, {
    headers
  })
  
  let result = await axios.post('https://photoaid.com/en/tools/api/tools/result', {
      "request_id": data.request_id,
      "reqURL": "/remove-background/result"
    }, {
      headers
    })
  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  while(result.data.result == null){
    await delay(2000)
    result = await axios.post('https://photoaid.com/en/tools/api/tools/result', {
      "request_id": data.request_id,
      "reqURL": "/remove-background/result"
    }, {
      headers
    })
  }
    
  return result.data
}
