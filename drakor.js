/**
 * Drakor ID API Scraper
 * package: axios
 * usage at bottom
 */

const axios = require('axios');

class Drakor {
    constructor() {
        this.baseUrl = 'https://wincamp.web.id'
        this.headers = {
            'Contet-Type': 'application/x-www-form-urlencoded',
            'Data-Agent': 'Drakor ID v1.8/10',
            'Host': 'wincamp.web.id',
            'User-Agent': 'okhttp/3.10.0',
        }
    }

    async home(type = 'new', page = 1, limit = 10) {
        try {
            let endpoint = '/drakor/phalcon/api/get_new_posts_drakor/v2/'
            switch (type) {
                case 'new':
                    endpoint = '/drakor/phalcon/api/get_new_posts_drakor/v2/'
                    break
                case 'ongoing':
                    endpoint = '/drakor/phalcon/api/get_category_ongoing_drakor/v2/'
                    break
            }
            let body = new URLSearchParams({
                page,
                count: limit,
                isAPKvalid: true
            })
            let { data } = await axios.post(`${this.baseUrl}${endpoint}`, body, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching home data:', error);
        }
    }

    async genreList() {
        try {
            let { data } = await axios.get(`${this.baseUrl}/drakor/phalcon/api/get_genre_list/v2/`, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching genre data:', error);
        }
    }

    async genre(genre) {
        try {
            let body = new URLSearchParams({
                genre1: genre,
                isAPKvalid: true
            })
            let { data } = await axios.post(`${this.baseUrl}/drakor/phalcon/api/get_drama_by_genre/v2/`, body, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching genre posts:', error);
        }
    }

    async detail(id, page = 1, limit = 10) {
        try {
            let body = new URLSearchParams({
                id,
                page,
                count: limit,
                isAPKvalid: true
            })
            let { data } = await axios.post(`${this.baseUrl}/drakor/phalcon/api/get_category_posts_drakor/v2/`, body, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching detail data:', error);
        }
    }

    async stream(id) {
        try {
            let body = new URLSearchParams({
                channel_id: id,
                isAPKvalid: true
            })
            let { data } = await axios.post(`${this.baseUrl}/drakor/phalcon/api/get_post_description_drakor/v2/`, body, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching stream data:', error);
        }
    }

    async search (query, page = 1, limit = 10) {
        try {
            let body = new URLSearchParams({
                pilihan: 'Serial Drama',
                search: query,
                page,
                count: limit,
                isAPKvalid: true
            })
            let { data } = await axios.post(`${this.baseUrl}/drakor/phalcon/api/search_category_collection/v2/`, body, {
                headers: this.headers
            })
            return data;
        } catch (error) {
            console.error('Error fetching search data:', error);
        }
    }
}

/* usage
(async () => {
    let drakor = new Drakor()
    let home = await drakor.home('new' / 'ongoing', 1, 10)
    let genreList = await drakor.genreList()
    let genre = await drakor.genre(genre)
    let detail = await drakor.detail(id, 1, 10)
    let stream = await drakor.stream(channel_id)
    console.log(stream)
})() */