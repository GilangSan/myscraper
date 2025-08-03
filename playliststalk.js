/** Spotify Playlist Analyzer from lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios')

const headers = {
    origin: 'https://www.gadegetkit.com',
    referer: 'https://www.gadegetkit.com/ai-tools/playlistanalyzer',
    'User-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
    'Content-Type': 'application/json',
}

async function analyzePlaylist(url) {
    if (!url) throw new Error('Please provide a valid YouTube playlist URL');
    try {
        const { data: { access_token } } = await axios.post('https://www.gadegetkit.com/api/auth/spotify/client-credentials', {
            headers
        })
        const playlistId = new URL(url).pathname.split("/")[2]
        let { data } = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}?market=US`, {
            headers: {
                ...headers,
                authorization: `Bearer ${access_token}`,
            }
        })
        return data
    } catch (e) {
        throw new Error('Failed to analyze playlist: ' + e.message);
    }
}

/* Example usage:
(async () => {
    console.log(await analyzePlaylist('https://open.spotify.com/playlist/0f4k5knjYtNBUfA10vPFoi'))
})() */