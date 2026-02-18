/**
 * Tiktok Advance DL
 * made by lang
 * @package crypto-js axios
 * @function tikok(url: string)
 */

const CryptoJS = require("crypto-js");
const axios = require("axios");

function y() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.floor(Math.random() * 16);
    const v = c === "x" ? r : (r & 0x3) | 0x8;

    return v.toString(16);
  });
}

function buildEncryptedPayload(data, y) {
  try {
    const parsedData = JSON.parse(data || "{}");

    const a = y();

    const i = a
      .replace(/-/g, "")
      .split("")
      .filter((e, t) => t % 2 === 0)
      .reverse()
      .join("");

    const key = CryptoJS.enc.Utf8.parse(i);
    const iv = CryptoJS.enc.Utf8.parse(i);

    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(parsedData), key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    }).toString();

    const result = a + encrypted;

    return {
      payload: btoa(result),
    };
  } catch (err) {
    console.error("Data encryption error.", err);
    return null;
  }
}

async function tiktok(url) {
  if (!url) return "Url parameter is required!";
  try {
    const payload = buildEncryptedPayload(
      JSON.stringify({
        url,
        ssstik_params: {
          ip: "",
          locale: "ua",
          bundle_id: "com.tikmake.app",
        },
      }),
      y,
    );
    const { data } = await axios.post(
      "https://api.tikmaker.app:22803/web-content/",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          origin: "https://tikmaker.app",
          referer: "https://tikmaker.app/",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36"
        },
      },
    );
    return data;
  } catch (e) {
    return "error: " + e;
  }
}

// exampleeee
(async () =>
  console.log(
    await tiktok(
      "https://www.tiktok.com/@flawwzyy/photo/7590051402446048520",
    ),
  ))();
