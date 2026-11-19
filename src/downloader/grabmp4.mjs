/**
 * grabmp4 — GrabMP4 (grabmp4.online) client
 * --------------------------------------------------------------
 * Zero-dependency Node client for grabmp4.online (YouTube → MP4/MP3),
 * reverse-engineered with REA.
 *
 * How it works:
 *   The site is a Next.js front-end that proxies everything through one JSON
 *   endpoint, `POST /api/yt`, backed by two upstream providers:
 *
 *     • savetube  (media.savetube.vip / cdnNNN.savetube.vip) — synchronous
 *                        {action:"info"}     -> {provider, cdn, info}
 *                        {action:"download"} -> {downloadUrl, provider}
 *     • ytmp4     (fsNN.flashydl.space) — asynchronous render job
 *                        {action:"ytmp4-formats"} -> {provider, formats}
 *                        {action:"ytmp4-start"}   -> {provider, job}
 *                        then poll job.statusUrl until status === "done".
 *
 *   A Cloudflare Worker mirror (grabmp4-edge-api.*.workers.dev) only implements
 *   the ytmp4-* actions.
 *
 * Requires the global fetch (Node >= 18). No runtime dependencies.
 *
 * Usage:
 *   import { GrabMP4 } from "./grabmp4.mjs";
 *   const gm = new GrabMP4();
 *   const meta = await gm.info("https://youtu.be/dQw4w9WgXcQ");
 *   const mp4  = await gm.downloadVideo("https://youtu.be/dQw4w9WgXcQ", "720");
 *   const mp3  = await gm.downloadAudio("https://youtu.be/dQw4w9WgXcQ", "128");
 *
 *   // function form
 *   import { info, download, formats, render } from "./grabmp4.mjs";
 *
 * NOTE: This is the ONLY ESM file in this repo (it uses `import`/`export`),
 * and it needs NO dependencies (uses the global fetch, Node >= 18), unlike the
 * other files which are CommonJS + axios. Import it with a file extension:
 *   import { GrabMP4 } from "./grabmp4.mjs";
 *   (or: const { GrabMP4 } = await import("./grabmp4.mjs"); from CommonJS)
 *
 * MIT License.
 */

const DEFAULT_BASE = "https://www.grabmp4.online";
const EDGE_BASE = "https://grabmp4-edge-api.plimbad347.workers.dev";
const SAVETUBE_CDN_LIST = "https://media.savetube.vip/api/random-cdn";

const DEFAULT_UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/150.0.0.0 Safari/537.36";

// Matches watch / youtu.be / embed / shorts links and captures the 11-char id.
const YT_ID_RE =
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;

/** Extract the 11-character video id from any common YouTube URL, else null. */
export function youtubeId(url) {
  const m = String(url || "").match(YT_ID_RE);
  return m ? m[1] : null;
}

export function isValidUrl(url) {
  return Boolean(youtubeId(url));
}

function httpError(status, body) {
  const msg = (body && (body.error || body.message)) || `HTTP ${status}`;
  const err = new Error(msg);
  err.status = status;
  err.body = body;
  return err;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function normalizeQuality(quality, type) {
  if (type === "audio") {
    const m = String(quality).match(/(128|256|320)/);
    return m ? m[1] : "128";
  }
  const m = String(quality).match(/(\d{3,4})/);
  return m ? m[1] : "360";
}

function normalizeInfo(inputUrl, r) {
  const info = r.info || {};
  return {
    url: info.url || inputUrl,
    provider: r.provider || "savetube",
    cdn: r.cdn || null,
    key: info.key || null,
    id: info.id || youtubeId(inputUrl),
    title: info.title || null,
    slug: info.titleSlug || null,
    thumbnail: info.thumbnail || null,
    duration: info.duration ?? null,
    durationLabel: info.durationLabel || null,
    videoFormats: (info.video_formats || []).map((f) => ({
      quality: String(f.quality ?? f.height ?? ""),
      height: f.height ?? null,
      width: f.width ?? null,
      label: f.label || `${f.height ?? f.quality}p`,
      url: f.url || null, // short-lived googlevideo.com URL, when present
    })),
    audioFormats: (info.audio_formats || []).map((f) => ({
      quality: String(f.quality ?? ""),
      label: f.label || `MP3 ${f.quality}kbps`,
      url: f.url || null,
    })),
  };
}

/**
 * GrabMP4 client.
 *
 * @example
 *   const gm = new GrabMP4();
 *   const meta = await gm.info(url);
 *   const { downloadUrl } = await gm.download(meta, "720p");   // video
 *   const mp3 = await gm.download(meta, "128", "audio");       // audio
 */
export class GrabMP4 {
  /**
   * @param {object} [opts]
   * @param {string} [opts.base]      Base origin (default grabmp4.online).
   * @param {string} [opts.edge]      Edge Worker origin.
   * @param {number} [opts.timeout]   Per-request timeout in ms (default 30s).
   * @param {string} [opts.userAgent]
   */
  constructor(opts = {}) {
    this.base = (opts.base || DEFAULT_BASE).replace(/\/+$/, "");
    this.edge = (opts.edge || EDGE_BASE).replace(/\/+$/, "");
    this.timeout = opts.timeout ?? 30_000;
    this.userAgent = opts.userAgent || DEFAULT_UA;
  }

  /** POST a JSON payload to an origin's /api/yt and return parsed JSON. */
  async _post(origin, payload, timeout = this.timeout) {
    const res = await fetch(`${origin}/api/yt`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "User-Agent": this.userAgent },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(timeout),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) throw httpError(res.status, body);
    return body;
  }

  /** Raw call through the primary Next.js endpoint. */
  call(payload) {
    return this._post(this.base, payload);
  }

  // --- savetube provider (synchronous) -------------------------------------

  /**
   * Fetch metadata + a ready-to-use direct video URL for a YouTube video.
   * @param {string} url
   */
  async info(url) {
    if (!isValidUrl(url)) throw new Error("Please enter a valid YouTube URL.");
    const r = await this.call({ action: "info", url });
    return normalizeInfo(url, r);
  }

  /**
   * Resolve a downloadable media URL.
   * @param {object|string} info  A `VideoInfo` from info(), or a YouTube URL.
   * @param {string} [quality]     Video "144".."1080"; audio "128"|"256"|"320".
   * @param {"video"|"audio"} [type]
   */
  async download(info, quality = "360", type = "video") {
    const meta = typeof info === "string" ? await this.info(info) : info;
    if (!meta || !meta.url) throw new Error("info must be a VideoInfo or YouTube URL.");

    const r = await this.call({
      action: "download",
      url: meta.url,
      provider: meta.provider,
      cdn: meta.cdn || undefined,
      key: meta.key || undefined,
      quality: normalizeQuality(quality, type),
      type,
    });
    if (!r.downloadUrl) throw new Error(r.error || "No downloadUrl returned.");
    return { downloadUrl: r.downloadUrl, provider: r.provider || meta.provider };
  }

  /** URL -> direct MP4 URL. */
  async downloadVideo(url, quality = "720") {
    return (await this.download(url, quality, "video")).downloadUrl;
  }

  /** URL -> direct MP3 URL (default 128 kbps). */
  async downloadAudio(url, quality = "128") {
    return (await this.download(url, quality, "audio")).downloadUrl;
  }

  // --- ytmp4 provider (asynchronous render) --------------------------------

  /**
   * List available formats from the ytmp4 provider (sizes are estimates).
   * @param {string} url
   * @param {{edge?:boolean}} [opts]
   */
  async formats(url, opts = {}) {
    if (!isValidUrl(url)) throw new Error("Please enter a valid YouTube URL.");
    const origin = opts.edge ? this.edge : this.base;
    const r = await this._post(origin, { action: "ytmp4-formats", url });
    if (!r.formats) throw new Error(r.error || "No formats returned.");
    return r.formats;
  }

  /**
   * Start an async render job and poll until the file is ready.
   * @param {object|string} video  A `formats` result (or a video id).
   * @param {string} quality       e.g. "1080p", "720p", "MP3_320".
   * @param {object} [opts]
   * @param {(p:{status:string,progress:number})=>void} [opts.onProgress]
   * @param {number} [opts.interval]  Poll interval ms.
   * @param {number} [opts.maxPollMs] Abort after this many ms (default 600s).
   * @param {boolean} [opts.edge]
   */
  async render(video, quality, opts = {}) {
    const vid = typeof video === "string" ? video : video && video.vid;
    if (!vid) throw new Error("render() needs a formats result or a video id.");

    const origin = opts.edge ? this.edge : this.base;
    const start = await this._post(origin, { action: "ytmp4-start", vid, quality });
    const job = start.job;
    if (!job || (!job.statusUrl && !job.fallbackUrl)) {
      throw new Error(start.error || "Failed to start render job.");
    }

    const interval = opts.interval ?? job.pollIntervalMs ?? 1000;
    const deadline = Date.now() + (opts.maxPollMs ?? (job.maxPollS ?? 600) * 1000);
    let url = job.statusUrl || job.fallbackUrl;

    while (Date.now() < deadline) {
      const res = await fetch(url, {
        headers: { "User-Agent": this.userAgent },
        cache: "no-store",
        signal: AbortSignal.timeout(this.timeout),
      });
      const body = await res.json().catch(() => null);
      const result = body && body.success ? body.result : null;

      if (result) {
        if (opts.onProgress) opts.onProgress({ status: result.status, progress: result.progress ?? 0 });
        if (result.status === "done" && result.output && result.output.url) {
          return {
            url: String(result.output.url).replace(/^http:\/\//, "https://"),
            expiresAt: result.expiresAt || result.output.expiresAt || null,
            jobId: result.job_id || vid,
          };
        }
        if (result.status === "failed") throw new Error(result.error || "Conversion failed");
      }
      if (!res.ok && job.fallbackUrl) url = job.fallbackUrl;

      await sleep(interval);
    }
    throw new Error("Render timed out.");
  }

  /** URL -> final rendered URL via the ytmp4 provider (formats + render). */
  async renderUrl(url, quality = "720p", opts = {}) {
    const formats = await this.formats(url, { edge: opts.edge });
    return (await this.render(formats, quality, opts)).url;
  }

  /** Query SaveTube's public random-cdn API directly (third fallback). */
  async savetubeCdn() {
    const res = await fetch(SAVETUBE_CDN_LIST, {
      headers: { "User-Agent": this.userAgent },
      signal: AbortSignal.timeout(this.timeout),
    });
    if (!res.ok) throw httpError(res.status);
    const { cdn } = await res.json();
    return cdn;
  }
}

// --- top-level function form ------------------------------------------------

export async function info(url, opts) {
  return new GrabMP4(opts).info(url);
}

export async function download(url, quality = "360", type = "video", opts) {
  return new GrabMP4(opts).download(url, quality, type);
}

export async function formats(url, opts) {
  return new GrabMP4(opts).formats(url, opts);
}

export async function render(url, quality = "720p", opts) {
  return new GrabMP4(opts).renderUrl(url, quality, opts);
}

export { DEFAULT_BASE, EDGE_BASE };
export default GrabMP4;
