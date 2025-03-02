/* created by lang gabut abiez
scrape buat masak masak doang(resep)
require package: axios, cheerio
usage ada dibawah
*/

const axios = require('axios')
const cheerio = require('cheerio')

const baseUrl = 'https://cookpad.com'

async function resep(q){
  let { data } = await axios.get(`${baseUrl}/id/cari/${q}`)
  const $ = cheerio.load(data)
  let result = []
  
  $("ul#search-recipes-list > li").each((i, e) => {
    const title = $(e).find("h2.text-cookpad-12 > a.block-link__main").text().trim()
    const time = $(e).find("li.inline > span.mise-icon-text").first().text().trim()
    const url = baseUrl + $(e).find("a.block-link__main").attr("href")
    const ingredients = $(e).find("div[data-ingredients-highlighter-target='ingredients']").text().trim()
    const creator = $(e).find("span.break-all").text().trim()
    const creatorImage = $(e).find("picture > .rounded-full").attr("src")
    
    result.push({
      title,
      time,
      url,
      ingredients,
      creator,
      creatorImage
    })
  })
  const res = result.filter(item => item.creatorImage !== undefined);
  
  return res
}

/* usage:
resep('your keyword here')
*/
