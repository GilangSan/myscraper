/**
 * Instagram Downloader
 * @author Lang 
 * @package axios, cheerio
 * @function igdl(url)
 * @note dont delete wm, can download reels, photo slide, story, and highlights!
 */

const axios = require("axios");
const cheerio = require("cheerio");

const headers = {
  "content-type": "application/x-www-form-urlencoded",
  origin: "https://indown.io",
  referer: "https://indown.io/",
  "user-agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
  cookie: "__gads=ID=0dfb3747de9691fc:T=1740983928:RT=1740983928:S=ALNI_MY6Qyu9KygoMgQCsBX_meSN0rsu-g; __gpi=UID=000010529550e4d9:T=1740983928:RT=1740983928:S=ALNI_MYZMJfq0ozBJmJT4GCahHkO4ceOgA; __eoi=ID=15111bdd6fc12fdd:T=1740983928:RT=1740983928:S=AA-AfjZHJUzIX5QF2e9SgqtTvfEv; _gid=GA1.2.455304899.1740983930; cf_clearance=PE3r4u2bByvyu4Ih45AZMS65lxbnONsuDJMrrDr4JiY-1740983930-1.2.1.1-uyr17bd__MT9DA.yHpK3W6Ju9Oqxqk2w9dIgPpzTSEY46vL9vTwS4VEs6rr0Iz_ZkNtVBM5yVpGvEiILSqllRR4HY.tUzCcqL6Yb91TqFQnmLIUvW7PZUBakKUuJmebMtr0bfbOjwierC5sLx8GfiZHShoBYjyYUQH5FuV15ddPz2jDtWK.VSLB27kMmLT2eTXfRYGIw_QV3Mwpt3vGowZfqVkAkFDMdkhv7wmMwTCjYT5JRczi20W4XYXJG4ibWwIyvftzuegw10276YxB2AtTH0vB4U_BFiTg4WUtjT.w7il7n68p0e2CGSpZsrleUBNYQK4_ansSaK243QSbLMy9T9qP.uBVSALvUi3b9UAgxGpAUZ0uojJBRruyDtuYpR04J3A17sVoOmjjYJsCgSA1wqixRuTYl38dt8pJGNwo; XSRF-TOKEN=eyJpdiI6ImZDYlRJNzd2WkJYT08vZVJhY3U2VEE9PSIsInZhbHVlIjoiMm9mNW9wRVVCWkxVQTdOWU5HUWErb3VWWFBZVTlFM1Mzb0JPQkRDSUN4NEpad3ZJQXdqWXJCRkNOTEF1WEo1QXhNM1VBTjZWUHVZbjJtUXg4Y21RNkM1Qk40MURQSGVrQ3cvYlR2Y3pIYWlsQmNXbFBtR3V0YWV6bGx3cVcxQ2IiLCJtYWMiOiJiZTJmOTMyZGY4Y2RhMzA2NTI2YjNkYTU0NTcxODRjMDEwYmExMzI0YjI4NDNkZjM3MTI5ZjExYWY3YjQzM2UwIiwidGFnIjoiIn0%3D; indown_session=eyJpdiI6ImRuclNTZkc2cnJCUFZMVWJ3cU5Nb1E9PSIsInZhbHVlIjoiaU9pb3dGenlFd0xqcGZCalIwV3VkYXhCaDBrbTJ2cE9QZzZIaFFib1p3dDltY1dSZlNnd0dRN3NlemU0L1E2elY1MVlFYVJ4K3JFVXVMSHljWWlBY0tSTERnMTRZSmU5Qml0RjIwWkVkZkI5UDhXRklBWFVUbVdOZVNsalV2aUMiLCJtYWMiOiIzMmU4MDZlMzMwMTg2YzUzMTc0YWFkMTlhMDk4OTcyYTlmN2UxMzM1NjIzZjkwMzMwODBlNzM0MmJmNjI2NjUwIiwidGFnIjoiIn0%3D; _ga_DGBNK67EMB=GS1.1.1740983929.1.1.1740984018.0.0.0; _ga=GA1.2.210004249.1740983930; FCNEC=%5B%5B%22AKsRol-Ad8yCOt14IwhzW_kTzIVapqcOOkbaKggj47MwIrs-Jau46it1Nsh-7oi3lG_li4pqa0ULmwwDD2CmYBGC5aTHThryAPRpAKUc-QfX7STgpkEIZf8xdO_hN9IcjORPV3SO6P09fxa_zOoVS5UaqsaNUloAnA%3D%3D%22%5D%2Cnull%2C%5B%5B2%2C%22%5Bnull%2C%5Bnull%2C4%2C%5B1740983930%2C594402000%5D%5D%5D%22%5D%5D%5D"
};

async function getToken() {
  let { data } = await axios.get("https://indown.io/", { headers });
  const $ = cheerio.load(data)
  let p =$('input[name="p"]').attr('value')
  let token =$('input[name="_token"]').attr('value')
  let referer =$('input[name="referer"]').attr('value')
  let locale =$('input[name="locale"]').attr('value')
  return {
    p, token, referer, locale
  }
}

async function igdl(url) {
  let { referer, token, locale, p } = await getToken()
  let formData = new FormData()
  formData.append('referer', referer)
  formData.append('locale', locale)
  formData.append('_token', token)
  formData.append('p', p)
  formData.append('link', url)

  let { data } = await axios.post("https://indown.io/download", formData, {
    headers,
  });
  const $ = cheerio.load(data)
  let result = []

  $('#result').find('.col-md-4').each((i, e) => {
    result.push($(e).find('.img-fluid img').attr('src') ? $(e).find('.img-fluid img').attr('src') : $(e).find('.img-fluid source').attr('src'))
  })

  return result
}