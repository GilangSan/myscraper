# myscraper

Kumpulan scraper **untuk tujuan belajar / riset** (reverse-engineered) dari berbagai situs publik — downloader media sosial, AI chat, tool gambar, stalking publik, berita, anime, dan lain-lain.

> ⚠️ Semua kode ditulis untuk eksperimen & pembelajaran. Gunakan dengan tanggung jawab sendiri — patuhi ToS masing-masing situs dan hukum yang berlaku. Endpoint pihak ketiga bisa berubah / mati kapan saja.
>
> Kalau ada scraper yang error, buka **Issues**. Mau request scraper baru? Juga di **Issues**.

## Struktur

Semua scraper ada di `src/`, dikelompokkan per kategori:

```
src/
├── ai/          # AI chat, summarizer, prompt tools, poster
├── anime/       # situs anime, komik, donghua, livechart
├── downloader/  # YouTube, TikTok, IG, FB, X, Spotify, dll
├── drama/       # drakor
├── food/        # resep masakan
├── image/       # text2img, img2img, upscale, removebg, compress
├── islamic/     # jadwal sholat
├── music/       # lirik
├── news/        # berita (detik, kompas, antara)
├── stalk/       # stalking publik (IG, TikTok, FF, Twitter, WA)
└── tools/       # OCR, TTS, currency, wallpaper, dll
```

Node ≥ 18. Hampir semua file adalah modul CommonJS yang memakai `require('axios')` (+ `cheerio`/lainnya sesuai kebutuhan). Belum ada `node_modules` yang di-commit; install dependency yang kamu butuhkan sendiri (lihat kolom **package** di tiap tabel).

> **Pengecualian:** `src/downloader/grabmp4.mjs` adalah satu-satunya file **ESM** (pakai `import`/`export`) dan **tanpa dependency** (memakai `fetch` global). Import dengan ekstensi file, mis. `import { GrabMP4 } from './src/downloader/grabmp4.mjs'`.

## Cara pakai

```js
// CommonJS (mayoritas file)
const { getInfo, getVideo, getAudio } = require('./src/downloader/ytdl-grabtheclip.js')
console.log(await getInfo('https://youtu.be/dQw4w9WgXcQ'))

// ESM, tanpa dependency (grabmp4)
import { GrabMP4 } from './src/downloader/grabmp4.mjs'
const gm = new GrabMP4()
console.log(await gm.downloadVideo('https://youtu.be/dQw4w9WgXcQ', '720'))
```

Tiap file punya header `@package` dan contoh `usage` di komentar atas / bawah file.

---

## Index scraper

### `ai/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `ai-chatbotai.js` | chatbotai.one | `ai` | axios |
| `blackbox.js` | blackbox.ai | `blackbox` | axios |
| `claude-claudeai.js` | claudeai.one | `claude` | axios |
| `codeai-toolzflow.js` | toolzflow.app | `codeAI` | axios |
| `deepseek-deepseekfree.js` | deepseekfree.live | `deepseek` | axios |
| `gock.js` | ai.gock.net | `Gock` (class) | axios |
| `image-to-prompt.js` | chat-mentor.com | `imageToPrompt` | axios |
| `poster-maker.js` | signpanda.me | `createPoster` | axios |
| `prompt-enhancer.js` | prompthancer.com | `promptEnhancer` | axios, crypto |
| `updf-ai.js` | updf.com | `UPDF` (class) | axios |
| `yt-summarizer-tubeonai.js` | tubeonai.com | `summarize` | axios |
| `yt-summarizer-youtubesummary.js` | youtubesummary.pro | `youtubeSummarizer` | axios |
| `zonerai.js` | zonerai.com | `Zonerai` (class) | axios, https |

### `anime/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `animeindo.js` | animeindo.info | `getHome, getSearch, getDetail, getVideo` | axios, cheerio |
| `donghua-update.js` | anichin.watch | `getDonghuaUpdate` | axios, cheerio |
| `komikindo.js` | komikindo2.com | `getHome, getSearch, getDetail, getChapterList, getChapter` | axios, cheerio |
| `livechart.js` | livechart.me | `getUpdate` | axios, cheerio |
| `love-tsonit.js` | love.tsonit.com | `Lovetsonit` (class) | axios, cheerio, cookiejar |
| `nontonanimeid.js` | nontonanimeid | `NontonAnimeID` (class) | axios, cheerio |
| `whats-anime.js` | trace.moe | `whatsAnime, getAnimeInfo` | axios |

### `downloader/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `ytdl-grabtheclip.js` | grabtheclip.com | `getInfo, getVideo, getAudio` | axios |
| `ytdl-yespotato.js` | yespotato.com | `info, download` | axios, crypto-js |
| `ytdl-genyoutube.js` | genyoutube.online | `YTDL` (class) | axios, cheerio |
| `ytdl-dlsrv.js` | dlsrv.online | `Youtube` (class) | axios |
| `yt-flvto.js` | flvto.top | `getInfo, mp3, mp4` | axios, cheerio |
| `yt-greenconvert.js` | greenconvert.net | `Youtubedl` (class) | axios |
| `yt-channel-analyzer.js` | evano.com | `channelStats, checkMonetization` | axios |
| `image-youtube.js` | imageyoutube.com | `imageYoutube` | axios |
| `tiktok-snapixels.js` | snapixels.com | `tiktok` | axios |
| `tiktok-tikmaker.js` | tikmaker.app | `tiktok` | axios |
| `tiktok-tiksave.js` | tiksave.io | `tiktok` | axios, cheerio |
| `aio-getindevice.js` | getindevice.com | `aio` | axios |
| `aio-allinonedownloader.js` | allinonedownloader.com | `aio` | axios, cheerio |
| `aio-getfvid-facebook.js` | getfvid.online (FB) | `aio` | axios |
| `aio-tera-instagram.js` | tera.backend.live (IG) | `aio` | axios |
| `douyin.js` | savedouyin.net | `douyin` | axios |
| `capcut.js` | 3bic.com | `capcut` | axios |
| `fbdl.js` | fadown.com | `fbdl` | axios |
| `igdl-indown.js` | indown.io | `igdl` | axios |
| `igdl-instasave.js` | instasave.website | `ig` | axios, cheerio |
| `pindl.js` | ssspin.app | `pindl` | axios |
| `x-twdownloader.js` | twdownloader.com | `x` | axios |
| `spotify.js` | spotify-down.com | `spotify, spodl` | axios |
| `grabmp4.mjs` | grabmp4.online | `GrabMP4` class / `info, download, formats, render` | none (ESM, fetch) |

### `drama/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `drakor.js` | wincamp.web.id | `Drakor` (class) | axios |

### `food/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `resep-cookpad.js` | cookpad.com | `resep` | axios, cheerio |
| `resep-fatsecret.js` | fatsecret.co.id | `Resep` (class) | axios, cheerio |

### `image/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `edit-image.js` | hf.space (gemini editor) | `editImage` | axios |
| `image-compresser.js` | pi7.org | `compress` | axios |
| `image-generator-aiimagegenerator.js` | aiimagegenerator.online | `generate` | axios |
| `img2img-vondy.js` | vondy proxy | `img2img` | axios |
| `removebg-photoaid.js` | photoaid.com | `removebg` | axios |
| `removebg-background-remover.js` | background-remover.com | `removebg` | axios |
| `removebg-phot-ai.js` | phot.ai | `removeBg` | axios |
| `text2img-aiimagegenerator.js` | aiimagegenerator.site | `text2img` | axios |
| `text2img-n8n.js` | n8n.io | `text2img` | axios |
| `text2img-texttoimage.js` | texttoimage.org | `text2img` | axios |
| `upscaler-aurasr.js` | hf.space (aurasr) | `upscale` | axios |
| `upscaler-imggen.js` | imggen.ai | `upscale` | axios |
| `upscaler-picupscaler.js` | picupscaler.com | `upscale` | axios |
| `upscaler-pixelcut.js` | pixelcut.ai | `upscaler` | axios |

### `islamic/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `jadwal-solat.js` | tirto.id | `jadwalSolat, searchCity` | axios |

### `music/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `lyric.js` | azlyrics.com | `lyricSearch, getLyric` | axios, cheerio |

### `news/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `antara.js` | antaranews.com | `antaraNews` (class) | axios |
| `detik.js` | detik.com | `detik, detikSearch, getDetailDetik` | axios, cheerio |
| `kompas.js` | kompas.com | `kompas` | axios, cheerio |

### `stalk/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `ff-stalk.js` | freefireinfo.in | `ffStalk` | axios |
| `ig-stalk.js` | greatfon.io | `igStalk` | axios, cheerio |
| `tt-stalk.js` | tokviewer.net | `ttStalk` | axios |
| `twitter-viewer.js` | twitterviewer.net | `TwitterViewer` (class) | axios |
| `whatsapp-profile-pic.js` | snaplytics.io | `getProfilePic` | axios |

### `tools/`
| File | Sumber | Fungsi utama | package |
|---|---|---|---|
| `cf-check.js` | checkforcloudflare.selesti.com | `cfCheck` | axios |
| `convert-currency.js` | forbes.com | `convertCurrency` | axios, cheerio |
| `discord-bot-search.js` | discordlist.gg | `searchDiscordBot` | axios |
| `ocr.js` | ocr.space | `ocr` | axios |
| `redirect-detective.js` | redirectdetective.com | `redirectDetective` | axios |
| `reply-comment.js` | (canvas lokal) | `generateCommentBuffer` | canvas |
| `soccer-club.js` | lapangbola.com | `searchClub, infoClub` | axios, cheerio |
| `spotify-playlist-analyzer.js` | gadegetkit.com | `analyzePlaylist` | axios |
| `tiktok-hashtag-counter.js` | tiktokhashtags.com | `getHashtagCount` | axios, cheerio |
| `tts-crikk.js` | crikk.com | `tts` | axios, cheerio |
| `vocal-remover.js` | songgenerator.io | `vocalRemover` | axios, crypto |
| `wallpaper.js` | 4kwallpapers.com | `Wallpaper` (class) | axios, cheerio |

---

## Spotify API (catatan lama)

```
Search:   https://song-teleservice.vercel.app/spotify/search?q=time&limit=20
Download: https://song-teleservice.vercel.app/spotify/search?url=
```
