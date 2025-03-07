/**
 * Whats Anime? Scraper
 * @author Lang
 * @package axios
 * @function whatsAnime(img_buffer)
 * @function getAnimeInfo(anilist_id)
 */

const axios = require('axios')

async function whatsAnime(buffer) {
    const blob = new Blob([buffer]);
    let formData = new FormData()
    formData.append('image', blob)
    let { data } = await axios.post('https://api.trace.moe/search?cutBorders&', formData, {
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary0YylamyCiWp0hAt8",
            "Origin": "https://trace.moe",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    return data
}

async function getAnimeInfo(id) {
    let { data } = await axios.post('https://trace.moe/anilist/', {
        "query": "query ($ids: [Int]) {\n            Page(page: 1, perPage: 50) {\n              media(id_in: $ids, type: ANIME) {\n                id\n                title {\n                  native\n                  romaji\n                  english\n                }\n                type\n                format\n                status\n                startDate {\n                  year\n                  month\n                  day\n                }\n                endDate {\n                  year\n                  month\n                  day\n                }\n                season\n                episodes\n                duration\n                source\n                coverImage {\n                  large\n                  medium\n                }\n                bannerImage\n                genres\n                synonyms\n                studios {\n                  edges {\n                    isMain\n                    node {\n                      id\n                      name\n                      siteUrl\n                    }\n                  }\n                }\n                isAdult\n                externalLinks {\n                  id\n                  url\n                  site\n                }\n                siteUrl\n              }\n            }\n          }\n          ",
          "variables": {
            "ids": [id]
          }
    }, {
        headers: {
            "Content-Type": "multipart/form-data; boundary=----WebKitFormBoundary0YylamyCiWp0hAt8",
            "Origin": "https://trace.moe",
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36"
        }
    })
    return data.data.Page
}
