/**
 * AnimeIndo Scraper
 * @author Lang
 * @package axios, cheerio
 * @function getHome(type, genre?)
 * @function getSearch(q)
 * @function getDetail(url)
 * @function getVideo(epsUrl)
 */
const axios = require("axios");
const cheerio = require("cheerio");

const BASE_URL = "https://animeindo.info";

/**
 * Type List:
 * 0 = home 
 * 1 = ongoing
 * 2 = complete
 * 3 = movie
 * 4 = genre (should fill genre param)
 */
async function getHome(type = 0, genre = 'live-action'){
    let url = BASE_URL
    switch(type){
      case 1:
        url = `${BASE_URL}/ongoing`
      break
      case 2:
        url = `${BASE_URL}/ended`
      break
      case 3:
        url = `${BASE_URL}/archive/movie`
      break
      case 4:
        url = `${BASE_URL}/genre/${genre}`
      break
    }
    let { data } = await axios.get(url)
    let $ = cheerio.load(data);
    let result = []

    $('.excstf').find('article.stylefiv').each((i, e) => {
        let title = $(e).find('h2').text().trim()
        let img = $(e).find('img').attr('src')
        let episodes = $(e).find('span').eq(1).text().trim().split('Ep ')[1] ? $(e).find('span').eq(1).text().trim().split('Ep ')[1] : $(e).find('span').eq(1).text().trim()
        let rating = $(e).find('span').eq(2).text().trim().split('Star : ')[1]
        let url = $(e).find('a.tip').attr('href')
        
        result.push({
          title,
          img,
          episodes,
          rating,
          url
        })
    })
    return result
}

async function getSearch(q){
  let { data } = await axios.get(`${BASE_URL}/search/${q.replace(' ', '-')}`)
    let $ = cheerio.load(data);
    let result = []

    $('.excstf').find('article.stylefiv').each((i, e) => {
        let title = $(e).find('h2').text().trim()
        let img = $(e).find('img').attr('src')
        let episodes = $(e).find('span').eq(1).text().trim().split('Ep ')[1] ? $(e).find('span').eq(1).text().trim().split('Ep ')[1] : $(e).find('span').eq(1).text().trim()
        let rating = $(e).find('span').eq(2).text().trim().split('Star : ')[1]
        let url = $(e).find('a.tip').attr('href')
        
        result.push({
          title,
          img,
          episodes,
          rating,
          url
        })
    })
    return result
}

async function getDetail(url){
  let { data } = await axios.get(url)
    let $ = cheerio.load(data);
    let result = {}
    
    let title = $('h1.entry-title').text().trim()
    let malScore = $('.info-content').find('span').eq(0).text().trim().split(': ')[1]
    let rating = $('.info-content').find('span').eq(1).text().trim().split(': ')[1]
    let aired = $('.info-content').find('span').eq(2).text().trim().split(': ')[1]
    let type = $('.info-content').find('span').eq(3).text().trim().split(': ')[1]
    let genres = []
    $('.genxed').find('a').each((i, e) => {
      genres.push($(e).text().trim())
    })
    let synopsis = $('.entry-content').text().trim()
    let listEpisode = []
    $('.eplister').find('li').each((i, e) => {
      let episode = $(e).find('.epl-num').text().trim()
      let url = $(e).find('a').attr('href')
      listEpisode.push({
        episode,
        url
      })
    })
    
    return {
      title,
      malScore,
      rating,
      aired,
      type,
      genres,
      synopsis,
      listEpisode
    }
}

async function getVideo(url) {
  let { data } = await axios.get(url);
  let $ = cheerio.load(data);
  let title = $('h2[itemprop="partOfSeries"]').text().trim()
  let updated = $('.updated').text().trim()
  let embed = $("iframe").attr("src");

  data = await axios.get(embed);
  $ = cheerio.load(data.data);

  let scriptContent = $("script").eq(2).html()
  let downloadUrl = scriptContent.split('var options = {id:"player", file: "')[1].split('", download: "https://nanifile.com/file/')[0].toString()

  return {
    title,
    updated,
    url: downloadUrl
  }
                                                                          }
