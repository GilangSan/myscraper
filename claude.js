/**
 * Claude AI Scraper
 * @author Lang
 * @package axios, cheerio
 * @function claude(msg)
 */

const axios = require('axios')
const cheerio = require('cheerio')

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    
    return result;
}


async function getData() {
    let { data } = await axios.get(`https://claudeai.one/`, {
        headers: {
            'origin': 'https://claudeai.one',
            'referer': 'https://claudeai.one/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
        }
    })
    const $ = cheerio.load(data)
    var wpaicg_randomnum = Math.floor((Math.random() * 100000) + 1);
    const chatId = `wpaicg-chat-message-${wpaicg_randomnum}`;
    return {
        nonce: $('.wpaicg-chat-shortcode').attr('data-nonce'),
        postId: $('.wpaicg-chat-shortcode').attr('data-post-id'),
        botId: $('.wpaicg-chat-shortcode').attr('data-bot-id'),
        chatId,
        userId: generateRandomString(10)
    }
}

async function claude(msg){
    let req = await getData()
    let form = new FormData()
    form.append('_wpnonce', req.nonce)
    form.append('post_id', req.postId)
    form.append('url', 'https://claudeai.one')
    form.append('action', 'wpaicg_chat_shortcode_message')
    form.append('message', msg)
    form.append('bot_id', req.botId)
    form.append('chatbot_identity', 'shortcode')
    form.append('wpaicg_chat_history', [])
    form.append('wpaicg_chat_client_id', req.userId)
    let { data } = await axios.post(`https://claudeai.one/wp-admin/admin-ajax.php`, form, {
        headers: {
            'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary94Z6AocbJ95PHwCx',
            'origin': 'https://claudeai.one',
            'referer': 'https://claudeai.one/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36'
        }
    })
    return data
}

/* example usage
(async () => console.log(await claude('siapa namamu dan hari ini hari apa')))()
*/