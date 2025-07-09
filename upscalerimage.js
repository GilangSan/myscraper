/**
 * ImageUpscaler from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

function generateId(length = 11) {
    let id = '';
    while (id.length < length) {
        id += Math.random().toString(36).slice(2);
    }
    return id.slice(0, length);
}

function parseEventStream(rawText) {
  const lines = rawText.split('\n');
  const results = [];

  for (const line of lines) {
    if (line.startsWith('data: ')) {
      const jsonPart = line.slice(6); // Remove "data: "
      try {
        const data = JSON.parse(jsonPart);
        if (data.msg === 'process_completed') {
          results.push(data);
        }
      } catch (err) {
        console.error('JSON parse error:', err);
      }
    }
  }

  return results;
}

async function upscale(image) {
    if (!image) return 'Where the image?'
    let buffer = Buffer.from(image)
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
    let form = new FormData()
    form.append('files', file)

    let { data } = await axios.post(`https://gokaygokay-aurasr-v2.hf.space/upload?upload_id=${generateId()}`, form, {
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary1z2yRAkO3HI171Oa",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
        }
    })
    let hash = generateId()
    let send = await axios.post(`https://gokaygokay-aurasr-v2.hf.space/queue/join?__theme=system`, {
        "data": [
            {
                "path": data[0],
                "url": `https://gokaygokay-aurasr-v2.hf.space/file=${data[0]}`,
                "orig_name": "image.jpg",
                "size": buffer.length,
                "mime_type": "image/jpeg",
                "meta": {
                    "_type": "gradio.FileData"
                }
            }
        ],
        "event_data": null,
        "fn_index": 0,
        "trigger_id": 5,
        "session_hash": hash
    }, {
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
        }
    })
    let res = await axios.get(`https://gokaygokay-aurasr-v2.hf.space/queue/data?session_hash=${hash}`, {
        headers: {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
        }
    })
    return parseEventStream(res.data)
}

/* usage
(async () => {
    let image = fs.readFileSync('./960x0.webp') // bisa url juga..
    let res = await upscale(image)
    console.log(res[0].output.data[0][1].url)
})()
*/
