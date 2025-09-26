/**
 * Summarizer Youtube AI by lang
 * package: axios
 * official channel: https://www.whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n
 * usage at bottom
 */

const axios = require('axios');

const headers = {
    'Content-Type': 'application/json',
    Origin: 'https://tubeonai.com',
    Referer: 'https://tubeonai.com/',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'
}

// available detail levels: 'Simple', 'Detailed', 'Comprehensive'
// available tones: 'Neutral', 'Actionable', 'Academic', 'Conversational', 'Funny'

function joinChunksFromString(raw) {
  return raw
    .split("\n")
    .map(line => line.trim())
    .filter(line => /^\d+:/.test(line))
    .map(line => {
      const match = line.match(/^\d+:"?(.*?)"?$/);
      return match ? match[1] : "";
    })
    .join("");
}

async function summarize(url, detail = 'Detailed', tone = 'Neutral', language = 'en-US') {
    if (!url) {
        throw new Error('URL is required');
    }
    try {
        let { data } = await axios.post(`https://web.tubeonai.com/api/public/summarize`, {
            "tool_name": "web-page-summarizer",
            "url": url,
            "detail_level": detail,
            "tone": tone,
            "language": language,
            "user_id": "newsletter_14155",
            "link_or_id": url
        }, {
            headers
        });

        let { data: summary } = await axios.post(`https://web.tubeonai.com/api/public/generate-summary`, {
            "summary_id": data.data.id,
            "transcript": data.data.transcript,
            "detail_level": detail,
            "tone_name": tone,
            "language": language,
            "user_id": "newsletter_14155",
            "prompt": ""
        }, {
            headers
        });
        return {
            title: data.data.title,
            summary: joinChunksFromString(summary),
            transcript: data.data.transcript
        }
    } catch (e) { return e }
}

(async () => {
    console.log(await summarize('https://youtu.be/pl9whpbup1I?si=vTw7ePaFEJXvoA6j', 'Comprehensive', 'Neutral', 'id-ID'));
})()