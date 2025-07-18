/**
 * UPDF Scraper from lang
 * package: axios
 * usage at the bottom
 */

const axios = require('axios')

function generateRandomDeviceId() {
    const chars = 'abcdef0123456789';
    let deviceId = '';
    for (let i = 0; i < 32; i++) {
        deviceId += chars[Math.floor(Math.random() * chars.length)];
    }
    return deviceId;
}

class UPDF {
    constructor() {
        this.base = 'https://apis.updf.com'
        this.loginUrl = 'https://accounts.updf.com/v1/user/guestLogin'
        this.deviceid = generateRandomDeviceId()
        this.headers = {
            origin: 'https://ai.updf.com',
            referer: 'https://ai.updf.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
            'X-Token': ''
        }
        this.token = ''
        this.payload = {
            "id": 0,
            "content": '',
            "target_lang": '',
            "chat_type": "random_talk",
            "chat_id": 0,
            "file_id": 0,
            "knowledge_id": 0,
            "continue": 0,
            "retry": 0,
            "model": "reasoning",
            "provider": "deepseek",
            "format": "md",
            "single_chat_id": ''
        }
    }

    async login() {
        try {
            this.headers['content-type'] = 'application/json'
            let { data } = await axios.post(this.loginUrl, {
                "deviceId": this.deviceid,
                "deviceType": "WEB"
            }, {
                headers: this.headers
            })
            this.token = data.data.token
            return data
        } catch (e) {
            return e.response?.data || e.message
        }
    }

    async history() {
        try {
            await this.login()
            this.headers['X-Token'] = this.token
            let { data } = await axios.get(`${this.base}/v1/ai/chat/history?chat_type=random_talk&token=`, {
                headers: this.headers
            })
            return data
        } catch (e) {
            return e.response?.data || e.message
        }
    }

    async chat(msg, type = false, lang = 'en') {
        try {
            if (!msg) return 'Wheres the msg'
            let check = await this.history()
            if (check.code !== 200) return check.msg
            this.headers['X-Token'] = this.token
            if (type) {
                this.payload['chat_type'] = type
                let { data } = await axios.get(`${this.base}/v1/ai/chat/instruction?chat_type=${type}&lang_type=${lang}`, {headers: this.headers})
                if (data.code !== 200) return 'error'
            }
            let { data } = await axios.get(`${this.base}/v1/ai/chat/single-chat-id`, {
                headers: this.headers
            })
            this.payload['content'] = msg
            this.payload['target_lang'] = lang
            this.payload['single_chat_id'] = data.data.single_chat_id
            let chats = await axios.post(`${this.base}/v1/ai/chat/talk-stream`, this.payload, {
                headers: this.headers
            })
            const lines = chats.data.split('\n').filter(Boolean)

            let fullMessage = ''

            for (let line of lines) {
                try {
                    const json = JSON.parse(line)
                    const content = json?.choices?.[0]?.delta?.content
                    if (content) {
                        fullMessage += content
                    }
                } catch (e) {
                    continue
                }
            }

            return fullMessage
        } catch (e) {
            return e.response?.data || e.message
        }
    }

    async searchPaper(q, limit = 10){
        if (!q) return 'Wheres the query?'
        await this.login()
        this.headers['X-Token'] = this.token
        let { data } = await axios.get(`${this.base}/v1/doc/paper/retrieve/keyword?keyword=${q}&fields_of_study=&year=&open_access_pdf=0&sort=&offset=0&limit=${limit}`, {headers: this.headers})
        return data
    }
}

/* usage

available type chat: summary, translate, explain

(async () => {
    let updf = new UPDF()
    console.log(await updf.chat('aku anak hebat', 'explain', 'id'))
    //console.log(await updf.searchPaper('pmid'))
})() */
