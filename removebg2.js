/**
 * RemoveBG
 * scraper by lang
 * @package axios
 * @function removebg(url/buffer)
 * return bufferimage
 */

const axios = require("axios");

function isUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (err) {
    return false;
  }
}

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function removebg(buffer) {
    if (!buffer) return 'manalah buffer/url nya cuk'
  if (isUrl(buffer)){
    const arrayBuffer = await axios.get(buffer, {
        responseType: 'arraybuffer'
    });
    buffer = Buffer.from(arrayBuffer.data,'binary').toString("base64");
  }
  let { data } = await axios.post(
    `https://background-remover.com/removeImageBackground`,
    {
      encodedImage: buffer,
      title: `${makeid(5)}.jpg`,
      mimeType: "image/jpg",
    },
    {
      headers: {
        "content-type": "application/json",
        origin: "https://background-remover.com",
        referer: "https://background-remover.com/upload",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
      },
    }
  );
  let dete = data.encodedImageWithoutBackground.replace(/^data:image\/\w+;base64,/, "");
  let buf = new Buffer(dete, 'base64')
  return buf
}
