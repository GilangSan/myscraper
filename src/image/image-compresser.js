/**
 * Image Compresser from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

const generateRandomId = (length = 6) => {
  return Math.random().toString(36).substring(2, length + 2);
};

async function compress(image, sizeInKb = 100){
    if (!image) return 'Wheres the image?'
        try {
            let form = new FormData()
            let buffer = ''
            try {
                new URL(image)
                let { data } = await axios.get(image, { responseType: 'arraybuffer' })
                buffer = Buffer.from(data)
            } catch (e) {
                buffer = Buffer.from(image)
            }
            const id  = generateRandomId()+'.png'
            const blob = new Blob([buffer], { type: 'image/png' });
            const file = new File([blob], id, { type: 'image/png' });
            form.append('myFile[]', file)
            form.append('kbsize', sizeInKb)
            form.append('dpis', '{}')
            let { data } = await axios.post('https://imback.pi7.org/compressimage', form, {
                headers: {
                    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryCpxLLOm2C2xsxYmI',
                    Host: 'imback.pi7.org',
                    Origin: 'https://image.pi7.org',
                    Referer: 'https://image.pi7.org',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
                }
            })
            let url = 'https://imback.pi7.org/downloadimage/uploadimg/'+data.images[0].filename.split('img/')[1]
            return {
                url,
                size: data.images[0].size
            }
        } catch (e){
            return e
        }
}

// fcking usage..
(async () => {
    let image = require('fs').readFileSync('./pfp.png') // can be url tho
    console.log(await compress(image, 30))
})()