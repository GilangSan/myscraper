/**
 * OCR skreper from lang
 * package: axios
 * usage at the bottom!
 */

const axios = require('axios')

async function ocr(image) {
    if (!image) return 'Where the image?'
    try {
        let form = new FormData()
        try {
            new URL(image)
            form.append('url', image)
        } catch (e) {
            let buffer = Buffer.from(image)
            const blob = new Blob([buffer], { type: 'image/jpeg' });
            const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
            form.append('file', file)
            form.append('url', '')
        }
        form.append('language', 'eng')
        form.append('isOverlayRequired', true)
        form.append('FileType', '.Auto')
        form.append('IsCreateSearchablePDF', false)
        form.append('isSearchablePdfHideTextLayer', true)
        form.append('detectOrientation', false)
        form.append('isTable', false)
        form.append('scale', true)
        form.append('OCREngine', 1)
        form.append('detectCheckbox', false)
        form.append('checkboxTemplate', 0)
        let { data } = await axios.post('https://api8.ocr.space/parse/image', form, {
            headers: {
                "Apikey": "donotstealthiskey_ip1",
                "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundaryJ7nATbJ6yEZIs129",
                "Origin": "https://ocr.space",
                "Referer": "https://ocr.space/",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
            }
        })
        return data
    } catch(e) { return 'Error. ', e }
}

/* usage
(async () => {
    let image = fs.readFileSync('./unnamed.png') // bisa url juga..
    console.log(await ocr(image))
})() */