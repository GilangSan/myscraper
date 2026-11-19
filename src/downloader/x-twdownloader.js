// require axios!
// twiter/x downloader dri lang nub

const axios = require('axios')

async function x (url) {
  let res = await axios.post(`https://bk.twdownloader.com/`, {
    'videoUrl': url
  }, {
  headers: {
    accept: "*/*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7",
    "content-type": "application/json",
    origin: "https://twdownloader.com",
    referer: "https://twdownloader.com/",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
  }})
  return res.data
}

/*
usage:
x('url twiternya')

get media:
result.media[1].url
*/
