/**
 * Wallpaper Scraper from lang
 * paxkage: axios, cheerio
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

class Wallpaper {
    constructor() {
        this.base = 'https://4kwallpapers.com'
        this.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
    }

    async main(type = 'home') {
        try {
            let url = this.base
            switch (type) {
                case 'popular':
                    url += '/most-popular-4k-wallpapers/'
                    break
                case 'featured':
                    url += '/best-4k-wallpapers/'
                    break
                case 'random':
                    url += '/random-wallpapers/'
                    break
                case 'collection':
                    url += '/collections-packs/'
                    break
            }
            let { data } = await axios.get(url, {
                headers: this.headers
            })
            const $ = cheerio.load(data)
            let res = []
            $('div#pics-list .wallpapers__item').each((i, e) => {
                res.push({
                    thumbnail: $(e).find('img').attr('src'),
                    title: $(e).find('.title2').text().trim(),
                    keywords: $(e).find('meta').attr('content'),
                    url: $(e).find('a').attr('href')
                })
            })
            return res
        } catch (e) { return e }
    }

    async search(q) {
        if (!q) return 'Wheres the query'
        try {
            let { data } = await axios.get(`${this.base}/search/?text=${q}`, {
                headers: this.headers
            })
            const $ = cheerio.load(data)
            let res = []
            $('div#pics-list .wallpapers__item').each((i, e) => {
                res.push({
                    thumbnail: $(e).find('img').attr('src'),
                    title: $(e).find('.title2').text().trim(),
                    keywords: $(e).find('meta').attr('content'),
                    url: $(e).find('a').attr('href')
                })
            })
            return res
        } catch (e) { return e }
    }

    async download(url) {
        if (!url) return 'Wheres the url?'
        try {
            let { data } = await axios.get(url, {
                headers: this.headers
            })
            const $ = cheerio.load(data)
            const main = $('#main-pic')
            const right = $('.pic-right div')
            const list = $('#res-list')
            let res = {
                title: $('.main-id .selected').text().trim(),
                keywords: $(main).find('meta[itemprop="keywords"]').attr('content'),
                thumbnail: $(main).find('img').attr('src'),
                category: [],
                tags: [],
                image: {
                    desktop: [],
                    mobile: [],
                    tablet: []
                }
            }
            $(right).find('.tags').first().find('a').each((i, e) => res.category.push($(e).text().trim()))
            $(right).find('.tags').eq(1).find('a').each((i, e) => res.tags.push($(e).text().trim()))
            $(list).find('span').eq(0).find('a').each((i, e) => {
                $(e).find('a span').remove()
                res.image.desktop.push({
                    res: $(e).text().trim(),
                    url: this.base + $(e).attr('href')
                })
            })
            $(list).find('span').eq(1).find('a').each((i, e) => {
                $(e).find('a span').remove()
                res.image.mobile.push({
                    res: $(e).text().trim(),
                    url: this.base + $(e).attr('href')
                })
            })
            $(list).find('span').eq(2).find('a').each((i, e) => {
                $(e).find('a span').remove()
                res.image.tablet.push({
                    res: $(e).text().trim(),
                    url: this.base + $(e).attr('href')
                })
            })
            return res
        } catch (e) { return e }
    }
}

/** usage
(async () => {
    let wpp = new Wallpaper()
    let res = await wpp.main('popular') // popular, featured, random, collection or leave it blank
    // let res = await wpp.download('https://4kwallpapers.com/cars/nissan-skyline-gt-r-14666.html')
    console.log(res)
})() */