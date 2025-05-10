/**
 * Tiktok Downloader MP3/Slide
 * krieted bai lang
 * 
 * @package axios, cheerio
 * @function tiktok(url)
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function tiktok(url) {
  let form = new URLSearchParams()
  form.append('q', url)
  let { data } = await axios.post(`https://tiksave.io/api/ajaxSearch`, form, {
  form.append('lang', 'id')
    headers: {
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'origin': 'https://tiksave.io',
      'referer': 'https://tiksave.io/id/download-tiktok-mp3',
      'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
    }
  })
  const $ = cheerio.load(data.data)
  let title = $('.tik-left').find('.content').text().trim()
  let thumbnail = $('.tik-left').find('img').attr('src')
  let video = $('.dl-action').find('p').first().find('a').attr('href')
  let audio = $('.dl-action').find('p').last().find('a').attr('href')
  let slide = []
  $('ul.download-box').find('li').each((i, e) => {
    slide.push($(e).find('img').attr('src'))
  })
  return {
    title,
    thumbnail,
    video,
    audio,
    slide
  }
}
