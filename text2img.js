
/* created by lang
text2img scraper
package: axios
usage: text2img(prompt, size) // if error, try again!
return: buffer (not url)
dont delete wm*/

const axios = require('axios')

let size = [
    512,
    768,
    1024,
    1200
]

async function text2img (prompt, size = 512) {
    let { data } = await axios.post('https://ftvwohriusaknrzfogjh.supabase.co/functions/v1/generate-image', {
        "prompt": prompt+", professional photograph, raw photo, unedited photography, photorealistic, 8k uhd, high quality dslr photo, sharp focus, detailed, crystal clear, natural lighting",
        "width": size,
        "height": size
      }, {
        headers: {
            "authority": "ftvwohriusaknrzfogjh.supabase.co",
            "Content-Type": "application/json",
            "Origin": "https://aiimagegenerator.site",
            "Referer": "https://aiimagegenerator.site/",
            "priority": "u=0, i",
            "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "none",
            "sec-fetch-user": "?1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
            "Apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs",
            "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0dndvaHJpdXNha25yemZvZ2poIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzNDc1NDMsImV4cCI6MjA0OTkyMzU0M30.JXPW9daK9AEov4sOt83qOgvx43-hE6QYfdO0h-nUHSs"
        }
    })

    let base64 = data.image.replace(/^data:image\/[a-zA-Z]+;base64,/, '')
                      .replace(/-/g, '+') 
                      .replace(/_/g, '/')
    if (data.status == 500) return {
        success: false,
        msg: 'Try again!'
    } 
    return {
        success: true,
        image: base64
    }
}
