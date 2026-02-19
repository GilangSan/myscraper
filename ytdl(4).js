/**
 * Youtube donloder
 * lang made this
 * @class Youtube(url: string)
 * @function info() download()
 * USAGE AT BOTTOM!
 */

const axios = require("axios");

class Youtube {
  constructor(url) {
    this.base = "https://embed.dlsrv.online/api";
    this.id = null;
    this.headers = {
      "Content-Type": "application/json",
      origin: "https://embed.dlsrv.online",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36",
      referer: `https://embed.dlsrv.online/v2/full?videoId=${this.id}`,
    };
    this.setId(url)
  }

  async setId(url) {
    const regex =
      /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([^&?/]+)/;
    const match = url.match(regex);
    this.id = match ? match[1] : null;
  }

  async info() {
    try {
      let { data } = await axios.post(
        `${this.base}/info`,
        {
          videoId: this.id,
        },
        {
          headers: this.headers,
        },
      );
      return data;
    } catch (e) {
      return "error: " + e;
    }
  }

  async download(format, quality) {
    if (!format || !quality)
      return "format, and quality parameter is required";
    try {
      let { data } = await axios.post(
        `${this.base}/download/${format}`,
        {
          videoId: this.id,
          quality,
          format,
        },
        {
          headers: this.headers
        },
      );
      return data;
    } catch (e) {
      return "error: " + e;
    }
  }
}


// usagee
(async () => {
  const ytdl = new Youtube("https://youtu.be/fNFuf4FA5KM?si=Bu9o12E8tVdno3qO");
  let info = await ytdl.info();
  console.log(info);
  let mp4 = await ytdl.download("mp4", "1440");
  console.log(mp4)
  let mp3 = await ytdl.download("mp3", "320");
  console.log(mp3)
})();

/**
 * Available Format and Quality:
 * mp4 = 144, 240, 360, 480, 720, 1080, 1440
 * mp3 = 64, 96, 128, 256, 320
 * 
 * Check the available quality and format by using the info() method.
 */
