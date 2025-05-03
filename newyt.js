/**
 * Youtube Download Scraper
 * @author Lang
 * @package axios
 * 
 * @class Youtubedl
 * Example use ada dibawah
 */

const axios = require('axios')

class Youtubedl {
  constructor(url) {
    this.url = url.split('/')[3].split('?')[0]
    this.base = 'https://d.ymcdn.org/api/v3/router'
    this.headers = {
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryCFXihWAqo9rfvfGr",
      "origin": "https://en.greenconvert.net",
      "referer": "https://en.greenconvert.net/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36",
    }
    this.server = ''
  }
  
  async route() {
    let { data } = await axios.get(this.base, {
      headers: this.headers
    })
    this.server = data.serverUrl
    return data
  }
  
  async init() {
    let { serverUrl } = await this.route()
    let form = new FormData()
    form.append('id', this.url)
    let { data } = await axios.post(`${serverUrl}/api/v3/init`, form, {
      headers: this.headers
    })
    this.hash = data.hash
    this.progressURL = data.progressURL
    return data
  }
  
  async progress() {
    let { hash, progressURL } = await this.init()
    let form = new FormData()
    form.append('id', hash)
    form.append('s', false)
    let { data } = await axios.post(progressURL, form, {
      headers: this.headers
    })
    return data
  }
  
  async convert(format) {
    let form = new FormData()
    form.append('id', this.hash)
    form.append('format', format)
    form.append('type', 'redirect')
    form.append('s', false)
    let { data } = await axios.post(`${this.server}/api/v3/convert`, form, {
      headers: this.headers
    })
    return data
  }
  
  async download(type, quality) {
    let progress = await this.progress()
    while (progress.data?.videoDetail == undefined){
      let form = new FormData()
      form.append('id', this.hash)
      form.append('s', false)
      progress = await axios.post(this.progressURL, form, {
        headers: this.headers
      })
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    let format = progress?.data?.videoDetail.formats[type][quality].itag
    console.log(format)
    let convert = await this.convert(format)
    let form = new FormData()
    form.append('id', this.hash)
    form.append('format', format)
    form.append('type', convert.type)
    form.append('readType', convert.type)
    form.append('direct', 'direct')
    let { data } = await axios.post(`${this.server}/api/v3/detail`, form, {
      headers: this.headers
    })
    return {
      info: progress.data.videoDetail,
      down: data
    }
  }
}

/*
type: sounds, audios, videos
sounds: 128k, dll
audios: 128k, dll
videos: 360p, 480p, 720p, dll

let dl = new Youtubedl('url yt nya')
let result = await dl.download('videos', '1080p')
*/
