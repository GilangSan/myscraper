/* created by lang
image to prompt scraper
package: axios
usage: imageToPrompt(imageBuffer)
dont delete wm hehe */

const axios = require('axios')
const fs = require('fs')

async function imageToPrompt(buffer){
  let image64 = `data:image/jpeg;base64,${buffer.toString('base64')}`
  let { data } = await axios.post('https://www.chat-mentor.com/api/ai/image-to-text/', {
    imageUrl: image64,
    prompt: "Generate a text prompt for this image, focusing on visual elements, style, and key features."
  }, {
    headers: {
      "content-type": "application/json",
      "origin": "https://www.chat-mentor.com",
      "referer": "https://www.chat-mentor.com/features/image-to-prompt/",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  return data
}
