/**
 * Resep Makanan
 * skreper by lang
 * @package axios, cheerio
 * @class Resep { updated, search, detail }
 */

const axios = require('axios')
const cheerio = require('cheerio')

class Resep {
  baseUrl = 'https://mobile.fatsecret.co.id'
  constructor() {}
  
  async request(path) {
    let { data } = await axios.get(this.baseUrl+path, {
      headers: {
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36"
      }
    })
    return data
  }
  async updated() {
    let html = await this.request(`/Default.aspx?pa=recsh`)
    const $ = cheerio.load(html)
    let result = []
    $('table.list').first().find('tr:has(div.next-link)').each((i, e) => {
      result.push({
        title: $(e).find('a.inner-link').text().trim(),
        description: $(e).find('div.small-text').eq(0).text().trim(),
        image: $(e).find('img').attr('src'),
        url: this.baseUrl+$(e).find('a.inner-link').attr('href')
      })
    })
    return result
  }
  async search(q) {
    if(!q) return 'Masukkan parameter (q).'
    let html = await this.request(`/Default.aspx?pa=rs&recipe=${q}`)
    const $ = cheerio.load(html)
    let result = []
    $('table.list').first().find('tr:has(div)').each((i, e) => {
      result.push({
        title: $(e).find('a.inner-link').text().trim(),
        description: $(e).find('div.small-text').eq(0).text().trim(),
        nutrition: $(e).find('div.small-text').eq(1).text().trim(),
        image: $(e).find('img').attr('src'),
        url: this.baseUrl+$(e).find('a.inner-link').attr('href')
      })
    })
    return result
  }
  async detail(url){
    if(!url) return 'Masukkan parameter (url)'
    let html = await this.request(url.split('fatsecret.co.id')[1])
    const $ = cheerio.load(html)
    let res = {
      title: $('div.page-title > h1').text().trim(),
      image: $('div.recipe-image > img').attr('src'),
      rating: $('div.rating').text().trim(),
      description: $('.recipe-description').text().trim(),
      info: {
        result: $('.recipe-info').find('tr').eq(1).find('td').eq(0).text().trim(),
        timePreparation: $('.recipe-info').find('tr').eq(1).find('td').eq(1).text().trim(),
        timeCooking: $('.recipe-info').find('tr').eq(1).find('td').eq(2).text().trim()
      },
      ingredients: [],
      steps: [],
      nutrition: $('.section:has(h2)').eq(2).find('table').find('td').find('div').eq(0).text().trim() + ' ' + $('.section:has(h2)').eq(2).find('table').find('td').find('div').eq(1).text().trim()
    }
    $('table.recipe-ingredient-list').find('tr').each((i, e) => {
      res.ingredients.push($(e).find('a').text().trim())
    })
    $('div.recipe-steps > table').find('tr').each((i, e) => {
      res.steps.push($(e).find('td').first().text().trim()+' '+$(e).find('td').eq(1).text().trim())
    })
    return res
  }
}

/* Cara penggunaan
(async() => {
  let resep = new Resep()
  //Updated
  let res = await resep.updated()
  //Search
  res = await resep.search('Kentang')
  //Detail
  res = await resep.detail('https://mobile.fatsecret.co.id/resep/49774862-oatmeal-goreng-dan-omelet/Default.aspx')
  console.log(res)
})()
*/
