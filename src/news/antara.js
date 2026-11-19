/**
 * Antara News Scraper
 * @author Lang
 * @class antaraNews
 * @function home()
 * @function search(q,page?)
 * @function detail(url)
 * 
 * const antara = new antaraNews()
 * return antara.search(q, page?)
 */

const axios = require("axios");
const cheerio = require("cheerio");

class antaraNews {
  constructor() {
    this.BASE_URL = "https://www.antaranews.com";
  }

  async request(url) {
    let { data } = await axios.get(url, {
      headers: {
        referer: "https://www.google.com/",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(data);
    return $;
  }

  async home() {
    const $ = await this.request(this.BASE_URL);
    let result = {
      updated: [],
      popular: [],
    };
    $('.popular__section-news').find(".col-md-6").each((i, e) => {
        let title = $(e).find(".card__post__title").text().trim();
        let uploaded = $(e).find('.list-inline-item').text().trim()
        let url = $(e).find(".card__post__title").find('a').attr('href')
        let img = $(e).find('img').attr('data-src')
        result.updated.push({
          title,
          uploaded,
          url,
          img
        });
      });
      $('.wrapper__list__article').find('.mb-3').each((i,e) => {
        let title = $(e).find(".card__post__title").text().trim();
        let uploaded = $(e).find('.list-inline-item').text().trim()
        let url = $(e).find(".card__post__title").find('a').attr('href')
        let img = $(e).find('img').attr('data-src')
        result.popular.push({
          title,
          uploaded,
          url,
          img
        });
      })
    return result;
  }

  async search(q, page=1) {
    const $ = await this.request(this.BASE_URL+'/search?q=pertamina&page='+page)
    let result = []
    $('.wrapper__list__article').first().find('.card__post').each((i,e) => {
        let title = $(e).find('h2.h5').text().trim()
        let uploaded = $(e).find('.list-inline-item').text().trim()
        let url = $(e).find('h2.h5').find('a').attr('href')
        let img = $(e).find('img').attr('data-src')
        let description = $(e).find('p').text().trim()
        result.push({
            title,
            uploaded,
            url,
            img,
            description
        })
    })
    return result
  }

  async detail(url) {
    const $ = await this.request(url)
    let title = $('.wrap__article-detail-title').text().trim()
    let img = $('img.img-fluid').attr('src')
    let date = $('.wrap__article-detail-info').find('.list-inline-item').eq(0).text().trim()
    let readDuration = $('.wrap__article-detail-info').find('.list-inline-item').eq(1).text().trim()
    let tags = []
    $('.blog-tags').find('a').each((i,e) => {
        let tag = $(e).text().trim()
        let url = $(e).attr('href')
        tags.push({
            tag,
            url
        })
    })
    let content = ''
    let para = $('.wrap__article-detail-content')
    para.find('span, p.text-muted, script, br, ins').remove()
    $(para).find('p').not('script').each((i,e) => {
        content += $(e).text().trim() + '\n'
    })
    return {
        title,
        img,
        date,
        readDuration,
        tags,
        content
    }
  }
}