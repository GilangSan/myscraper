/* created by lang
image upscaler scraper
package: axios
usage: upscale(buffer) // image buffer
dont delete this wm bruh*/

const axios = require('axios')

function randomNumber() {
  let randomNumber = Math.floor(Math.random() * 1000000)
  let randomNumberString = randomNumber.toString();
  while (randomNumberString.length < 6) {
    randomNumberString = "0" + randomNumberString;
  }
  return randomNumberString;
}

async function upscale(buffer) {
  const blob = new Blob([buffer], { type: 'image/png' });
  let filename = randomNumber()+'.png'
  let formData = new FormData()
  formData.append('image', {})
  formData.append('image', blob, filename)
  let { data } = await axios.post('https://api.imggen.ai/guest-upload', formData, {
    headers: {
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundarycoUsybCSHQLPDQn7",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  let result = await axios.post('https://api.imggen.ai/guest-upscale-image', {
    image: {"url":"https://api.imggen.ai"+data.image.url,
    "name":data.image.name,
    "original_name":data.image.original_name,
    "folder_name":data.image.folder_name,
    "extname":data.image.extname
    }
  }, {
    headers: {
      "content-type": "application/json",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  
  return {
    success: true,
    status: 200,
    message: result.data.message,
    result: `https://api.imggen.ai${result.data.upscaled_image}`
  }
}
