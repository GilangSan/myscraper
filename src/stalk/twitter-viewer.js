/**
 * Twitter Viewer from Lang
 * package: axios
 * usage at bottom
 */

const axios = require('axios');

class TwitterViewer {
    constructor() {
        this.base = 'https://twitterviewer.net/api'
        this.headers = {
            'content-type': 'application/json',
            origin: 'https://twitterviewer.net',
            referer: 'https://twitterviewer.net/?',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36'
        }
    }

    async getUser(username) {
        if (!username) throw new Error('Please provide a valid Twitter username');
        try {
            const { data } = await axios.post(`${this.base}/get-user`, {
                username
            }, {
                headers: this.headers
            });
            return data;
        } catch (e) {
            throw e
        }
    }

    async getUserTweets(username) {
        if (!username) throw new Error('Please provide a valid Twitter username');
        try {
            const { data } = await axios.post(`${this.base}/get-user-tweets`, {
                username
            }, {
                headers: this.headers
            });
            return data;
        } catch (e) {
            throw e
        }
    }

    async getTweet(tweetId) {
        if (!tweetId) throw new Error('Please provide a valid Tweet ID');
        try {
            const { data } = await axios.post(`${this.base}/get-twitter`, {
                twitter_id: tweetId
            }, {
                headers: this.headers
            });
            return data;
        } catch (e) {
            throw e
        }
    }
}

/* Example usage:
(async () => {
    const twitterViewer = new TwitterViewer();
    const user = await twitterViewer.getUser('jack');
    const tweets = await twitterViewer.getUserTweets('jack');
    const tweet = await twitterViewer.getTweet('1950325764001345641');
    console.log(tweet);
})() */