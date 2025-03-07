/**
 * Image Youtube Scraper (jelek)
 * @author Lang
 * @package axios, cheerio
 * @function imageYoutube(url)
 * Bodoamatlah scrape jelek bgt
 */

const axios = require('axios')
const cheerio = require('cheerio')

const headers = {
      "origin": "https://imageyoutube.com",
      "referer": "https://imageyoutube.com/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36",
      "cookie": "PHPSESSID=0b4cac8471afa8ee60b7ba699f593df7; _ga=GA1.1.1179067305.1741341370; userytl_country=Indonesia; _ga_696N165D1S=GS1.1.1741341369.1.1.1741342908.0.0.0"
    }

async function getToken(){
  let { data } = await axios.get('https://imageyoutube.com/', {
    headers
  })
  const $ = cheerio.load(data)
  let usertimezone = $('input#usertimezone').attr('value')
  let csrf_token = $('input[name="csrf_token"]').attr('value')
  let device = $('input#device').attr('value')
  let mcountry = $('input[name="mcountry"]').attr('value')
  return {
    usertimezone: "Asia/Jakarta",
    csrf_token,
    device: "mobile",
    mcountry
  }
}

async function imageYoutube(url){
  let token = await getToken()
  let form = {
    v: url,
    usertimezone: "Asia/Jakarta",
    csrf_token: token.csrf_token,
    device: "mobile",
    mcountry: token.mcountry
  }
  let forms = new URLSearchParams(form).toString()
  let { data } = await axios.post('https://imageyoutube.com/imgyt', forms, {
    headers: {
      ...headers,
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8"
    }
  })
  const $ = cheerio.load(data)
  let title = $('p.vbaslik').text().trim()
  let preview = $('img.aspimg').attr('src')
  let uploaded24Format = $('span[style="color: #008000;"]').eq(0).text().trim()
  let uploadedAmericanFormat = $('span[style="color: #008000;"]').eq(1).text().trim()
  let timezone = $('span[style="color: orange;"]').first().text().trim()
  let elapsed = $('span.mgreen').first().text().trim().split(': ')[1]
  let moreInfo = $('pre#typewriter').text().trim()
  let category = $('span[style="color: #008000;"]').eq(2).text().trim()
  let duration = $('span[style="color:#008000;"]').text().trim()
  let views = $('span[style="color: #008000;"]').eq(3).text().trim()
  let like = $('span[style="color: #008000;"]').eq(4).text().trim().split(' -')[0]
  let dislike = $('span[style="color: #008000;"]').eq(4).text().trim().split('- ')[1]
  let subtitle = $('a[rel="noreferrer noopener"]').attr('href')
  let description = $('span[style="color: #008000;"]').last().text().trim()
  let watermark = $('a[rel="nofollow noreferrer noopener"]').attr('href')
  let thumbnail = $('a[rel="nofollow noreferrer noopener"]').eq(3).attr('href')
  let frameStart = $('a[rel="nofollow noreferrer noopener"]').eq(2).attr('href')
  let frameMiddle = $('a[rel="nofollow noreferrer noopener"]').eq(3).attr('href')
  let frameEnd = $('a[rel="nofollow noreferrer noopener"][class="ayz"]').eq(4).attr('href')
  let channelTitle = $('div[style="color: #0000ff; font-size:18px;"]').find('a').text().trim()
  let channelUrl = $('div[style="color: #0000ff; font-size:18px;"]').find('a').attr('href')
  let channelLocation = $('span[style="color: #185e24;"]').eq(0).text().trim()
  let channelCreationDate = $('span[style="color: #185e24;"]').eq(1).text().trim()
  let channelSubs = $('font[color="green"]').eq(1).text().trim()
  let channelVideos = $('span[style="color: green;"]').text().trim()
  let channelDescription = $('span[style="color: #185e24;"]').last().text().trim()
  let channelImage = $('a[rel="nofollow noreferrer noopener"][class="ayz"]').eq(5).attr('href')
  let channelBanner = $('a[rel="nofollow noreferrer noopener"][class="ayz"]').eq(16).attr('href')
  
  return {
    title,
    preview,
    upload: {
      timezone,
      "24Format": uploaded24Format,
      americanFormat: uploadedAmericanFormat,
      elapsed,
      moreInfo
    },
    category,
    duration,
    views,
    like,
    dislike,
    subtitle,
    description,
    watermark,
    thumbnail,
    frame: {
      1: frameStart,
      2: frameMiddle,
      3: frameEnd
    },
    channel: {
      title: channelTitle,
      url: channelUrl,
      location: channelLocation,
      subscribers: channelSubs,
      description: channelDescription,
      videoCount: channelVideos,
      image: channelImage,
      banner: channelBanner
    }
  }
}
