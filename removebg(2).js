/**
 * Remove Background from lang
 * package: axios
 * usage at bottom:)
 */

const axios = require('axios')

async function uploadTemp(image) {
    let form = new FormData()
    let buffer = Buffer.from(image)
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    form.append('file', file)
    let { data } = await axios.post('https://tmpfiles.org/api/v1/upload', form)
    let id = data.data.url.split('http://tmpfiles.org/')[1]
    let dl = 'http://tmpfiles.org/dl/'+id
    return dl
}

async function removeBg(image) {
    if (!image) return 'Wheres the image'
    try {
        let payload = {
            "input_image_link": "",
            "file_name": "image.jpg",
            "origin": "background-replacer",
            "original_image_url": ""
        }
        try{
            new URL(image)
            payload.input_image_link = image
            payload.original_image_url = image
        } catch (e) {
            let url = await uploadTemp(image)
            payload.input_image_link = url
            payload.original_image_url = url
        }
        let { data } = await axios.post('https://prodapi.phot.ai/app/api/v5/user_activity/background-remover', payload, {
            headers: {
                'Content-Type': "application/json",
                'Origin': "https://www.phot.ai",
                'Referer': "https://www.phot.ai/",
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        return data
    } catch (e) { return e }
}

/* usage
(async () => {
    let image = fs.readFileSync('./unnamed.png')
    console.log(await removeBg(image))
})() */