/**
 * Upscaler image
 * skreper by lang
 * @package axios
 * @function upscaler(url/buffer)
 */

const axios = require('axios')

async function upscaler(image){
  if (!image) return 'Mana parameter image berupa url/buffer'
  if (image.startsWith('http')){
    let img = await axios.get(image, {
      responseType: 'arraybuffer'
    })
    image = img.data
  }
  let blob = new Blob([image])
  let form = new FormData()
  form.append('image', blob)
  form.append('scale', 2)
  let { data } = await axios.post(`https://api2.pixelcut.app/image/upscale/v1`, form, {
    headers: {
      "accept": "application/json",
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryBwsXO54CGlwdkSjT",
      "origin": "https://www.pixelcut.ai",
      "referer": "https://www.pixelcut.ai/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
      "x-client-version": "web",
      "x-locale": "id"
    }
  })
  return data
}

/* Cara Penggunaan
(async () => {
  // bisa pake buffer langsung juga, jadi ambil gambar tinggal quoted.download()
  let res = await upscaler('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-y0sTwYOjHkDj1HOE34Ib-rl8Gg3TQ2c7KA&usqp=CAU')
  console.log(res)
})()
*/
