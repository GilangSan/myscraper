/**
 * Channel Analytics by lang
 * package: axios
 * usage at bottom
 */

const axios = require("axios");

function checkMonetization(sub, view) {
  const subs = parseInt(sub || 0);
  const views = parseInt(view || 0);
  const watchHours = views * 0.1;
  return subs >= 1000 && watchHours >= 4000;
}

async function channelStats(url) {
  if (!url) return { error: "Wheres the url " };
  try {
    let { data: channelid } = await axios.post(`https://api.evano.com/api/youtube/search`, {
        query: url,
        type: 'url'
    }, {
        headers: {
            "Content-Type": "application/json",
            Origin: "https://evano.com",
            Referer: "https://evano.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
        }
    });
    let { data } = await axios.get(`https://api.evano.com/api/youtube/channel/${channelid.channelId}/analytics`, {
        headers: {
            Origin: "https://evano.com",
            Referer: "https://evano.com/",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36"
        }
    })
    data['isMonetized'] = await checkMonetization(data.channel.subscriberCount, data.channel.viewCount)
    return data
  } catch (e) {
    return e;
  }
}

(async () => {
    console.log(await channelStats(`https://www.youtube.com/@ryan`))
})()