/**
 * Search&Info Club Bola 
 * @author Lang 
 * @package axios, cheerio
 * @function searchClub(query)
 * @function infoClub(url)
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function searchClub (q){
  let { data } = await axios.get(`https://live.lapangbola.com/teams?q=${q}`)
  const $ = cheerio.load(data)
  let result = []
  $('.panel-body').find('.col-lg-3').each((i, e) => {
    result.push({
      name: $(e).find('h5').text().trim(),
      logo: $(e).find('.avatar').find('img').attr('src'),
      stadion: $(e).find('span').text().trim(),
      url: 'https://live.lapangbola.com'+$(e).find('.panel-body').find('a').attr('href')
    })
  })
  return result
}

async function infoClub(url){
  let { data } = await axios.get(url)
  const $ = cheerio.load(data)
  let matchHistory = []
  $('#match-history').find('tr').each((i, e) => {
    matchHistory.push({
      date: $(e).find('.color-primary').text().trim(),
      versus: `${$(e).find('.team-short-name').first().text().trim()} vs ${$(e).find('.team-short-name').last().text().trim()}`,
      score: $(e).find('a:has(.label)').text().trim(),
      tournament: $(e).find('a:not(:has(.label))').text().trim()
    })
  })
  let players = []
  $('#players-list').find('tbody').find('tr').each((i, e) => {
    players.push({
      name: $(e).find('.color-primary').text().trim(),
      number: $(e).find('td').eq(1).text().trim(),
      position: $(e).find('td').last().text().trim(),
    })
  })
  return {
    name: $('.profile-header-title').find('h1').text().trim(),
    logo: $('.profile-user').find('.avatar').find('img').attr('src'),
    stadion: $('.profile-header-title').find('p').text().trim(),
    play: $('.widget-four').find('.col-xl-3').eq(0).find('p').text().trim(),
    win: $('.widget-four').find('.col-xl-3').eq(1).find('p').text().trim(),
    draw: $('.widget-four').find('.col-xl-3').eq(2).find('p').text().trim(),
    lose: $('.widget-four').find('.col-xl-3').eq(3).find('p').text().trim(),
    players,
    matchHistory
  }
}
