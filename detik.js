/* detikcom scraper made by lang (updated)
package: axios, cheerio
usage:
detik() // get updated and popular news
detikSearch('your query') // searching for news
update:
getDetailDetik('news url') // get news detail
*/

const axios = require("axios")
const cheerio = require("cheerio")

async function detik() {
  let { data } = await axios.get('https://www.detik.com/')
  const $ = cheerio.load(data)
  let result = {
    updated: {},
    recommendations: [],
    popular: []
  }
  
  let title = $("div.headline").find("h2.media__title").text().trim()
  let uploaded = $("div.media__date").find("span").first().text().trim()
  let url = $("div.headline").find("a").attr('href')
  let img = $("div.headline").find("div.media__image").find("img").attr('src')
  
  $(".ph_newsfeed_m").each((i, e) => {
    let recTitle = $(e).find("h3.media__title").text().trim()
    let recUploaded = $(e).find("div.media__date").find("span").text().trim()
    let recUrl = $(e).find("h3.media__title").find("a").attr('href')
    result.recommendations.push({
    title: recTitle,
    url: recUrl,
    uploaded: recUploaded
  })
  })
  $(".cb-mostpop").find("article.list-content__item").each((i, e) => {
    let index = `#${i+1}`
    let popTitle = $(e).find("h3.media__title").text().trim()
    let popUploaded = $(e).find("div.media__date").find("span").text().trim()
    let popUrl = $(e).find("h3.media__title").find("a").attr('href')
    result.popular.push({
    index,
    title: popTitle,
    url: popUrl,
    uploaded: popUploaded
  })
  })
  
  result.updated = {
      title,
      uploaded,
      url,
      img
  }
  
  return result
}

async function detikSearch(q) {
  let { data } = await axios.get(`https://www.detik.com/search/searchall?query=${q}&siteid=2&source_kanal=true`)
  const $ = cheerio.load(data)
  let result = []
  
  $(".list-content").find("article.list-content__item").each((i, e) => {
    let title = $(e).find("h3.media__title").text().trim()
    let uploaded = $(e).find("div.media__date").find("span").text().trim()
    let url = $(e).find("h3.media__title").find("a").attr('href')
    let img = $(e).find(".media__image").find("img").attr("src")
    result.push({
    title,
    url,
    uploaded,
    img
  })
  })
  return result
}

async function getDetailDetik(url) {
  let { data } = await axios.get(url)
  const $ = cheerio.load(data)
  let result = {}
  
  let head = $("article.detail").find("div.detail__header")
  
  const title = $(head).find("h1").text().trim()
  const author = $(head).find("div.detail__author").text().trim()
  const date = $(head).find("div.detail__date").text().trim()
  const img = $("article.detail").find("div.detail__media").find("img").attr('src')
  
  let detail
  $("article.detail").find("div.detail__body-text").find("p:not(.para_caption)").each((i,e) => {
    detail += $(e).text().trim() + '\n'
  })
  
  result = {
    title,
    author,
    date,
    img,
    detail
  }

  return result
}
