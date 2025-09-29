/**
 * Love Tsonit Scraper by lang
 * package: axios, cheerio, axios-cookiejar-support, tough-cookie
 * official channel: https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');

const jar = new CookieJar();
const client = wrapper(axios.create({ jar, withCredentials: true }));

class Lovetsonit {
    constructor() {
        this.baseUrl = 'https://love.tsonit.com'
        this.header = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36'
        }
    }

    async getToken() {
        try {
            let { data: tokenHTML } = await client.get(this.baseUrl, { headers: this.header })
            const $ = cheerio.load(tokenHTML)
            const tokenInput = $('input[name="_token"]').attr('value')
            return tokenInput
        } catch (e) { return e }
    }

    async upload(image) {
        if (!image) return 'Wheres the image?'
        try {
            let form = new FormData()
            let buffer = ''
            try {
                new URL(image)
                let { data } = await axios.get(image, { responseType: 'arraybuffer' })
                buffer = Buffer.from(data)
            } catch (e) {
                buffer = Buffer.from(image)
            }
            const blob = new Blob([buffer], { type: 'image/png' });
            const file = new File([blob], 'image.png', { type: 'image/png' });
            form.append('photos[]', file)
            let tokenInput = await this.getToken()
            let { data } = await client.post(`${this.baseUrl}/media/upload`, form, { headers: {
                ...this.header,
                'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryywxbqZy8BLPlYOzN',
                'X-CSRF-TOKEN': tokenInput,
            } })
            return JSON.parse(data.split('\n')[0].split('data: ')[1])
        } catch (e) { return e }
    }

    async create(title, content, path, image = false, music = '/musics/CjfFFwHK4iTik1AjrDa33PT3waZm4Bv1qFreni4e.mp3') {
        if (!title || !content || !path) return 'Missing parameters'
        if (path.includes(' ')) return 'Path cannot contain spaces'
        if (path.length > 30) return 'Path is too long, max is 30 characters'
        try {
            let tokenInput = await this.getToken()
            this.headers = {
                ...this.header,
                'X-CSRF-TOKEN': tokenInput,
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Requested-With': 'XMLHttpRequest',
            }
            let gallery_images = ''
            if (image) {
                let { id } = await this.upload(image)
                gallery_images = id
            }
            let input = new URLSearchParams({
                page_slug: path,
                _token: tokenInput,
                title: title,
                content: content,
                slug: path,
                gallery_images,
                type_music: music.includes('musics/') ? 'default' : 'link',
                music,
                bgOption: 'none',
                proengsoft_jsvalidation: ''
            })
            let { data: createData } = await client.post(`${this.baseUrl}/signup`, input, { headers: this.headers })
            return {
                status: createData.status,
                message: createData.message,
                url: this.baseUrl + '/' + path,
                edit_url: createData.data.redirect,
                input
            }
        } catch (e) { return e }
    }
}

(async () => {
    let lovetsonit = new Lovetsonit()
    let create = await lovetsonit.create('hay gantengg', 'i miss you so muchhh, kepin jelek, lang ganteng', 'i-was-so-crazy', require('fs').readFileSync('./pfp.png'), 'https://tmpfiles.org/dl/2489599/spotidown.app-ratherlie_withtheweeknd_-playboicarti.mp3')
    console.log(create)
})()    