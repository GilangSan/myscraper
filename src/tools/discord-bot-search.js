/**
 * Discord bot scraper from lang
 * package: axios
 * usage at bottom!
 */

const axios = require('axios')

let tags = [
    "gambling",
    "tips-tricks",
    "robbing",
    "inventory",
    "rewards",
    "leaderboards",
    "stores",
    "cryptocurrency",
    "NFT"
]

let sort = ["relevancy", "trending", "popularity", "age", "votes"]

async function searchDiscordBot(q, tag = [], sort = 'relevancy', limit = 10) {
    if (!q) return 'Wheres the query?'
    try {
        let { data } = await axios.post('https://search.discordlist.gg/v0/bots/search', {
            "query": q,
            "offset": 0,
            "limit": limit,
            "filter": {
                "tags": tag.length == 0 ? tags : tag,
                "filterMode": tags.length !== 0 ? "intersection" : null
            },
            "order": "desc",
            "sort": sort
        }, {
            headers: {
                'Content-Type': 'application/json',
                Origin: 'https://discordlist.gg',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
            }
        })
        return data
    } catch (e) { return e }
}

async function getAvatar(id, avatar){
    if (!avatar || !id) return 'Wheres the avatar and id?'
    return `https://cdn.discordapp.com/avatars/${id}/${avatar}`
}

/* usage
u can see the available parameters at top!

function searchDiscordBot(q, tag = [], sort = 'relevancy', limit = 10)
function getAvatar(id, avatar)

(async () => {
    console.log(await searchDiscordBot('anime', ["gambling"], sort[2]))
    //console.log(await getAvatar('1366162211323777045', '82577d5fb661a0ef45f9048f0fe9f7c8'))
})() */