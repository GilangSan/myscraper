/**
 * img2img ai
 * @package axios
 * au ah
 */

const axios = require("axios");

async function img2img(url, prompt) {
  let { data } = await axios.post(`https://vondyapi-proxy.com/images/`, {
    model: "text-davinci-003",
    maxTokens: 3000,
    input: 'n0HQvTEEkUWWQVFhiW71y2ivBdv6SGth+IiWL0y0lDMUUWsJVWlbbr4h+Ik23FMFoFK0CZ67b3bPsmmxYDxK3o9X9mEZINpEgNE8lK2Fky7E/K/n1AHMUx4SWjr3ZgisE6tIGrvYW4yPrMp8xdeGDhgxdzxWkBAVoqCsInbMQJslEBtw+5kQCVdCxPRJVFDTSt+9tKnGF4yYutUNh+5hwjeBQyB8O4Fs3jpJqRloHq1Ki11cyAc0H6RNtrH/kI6Z2wksQNxKA829nuYgh5cW4xgtbgFFHunJuRsRSIinSZ8=',
    temperature: 0.5,
    e: true,
    summarizeInput: false,
    inHTML: false,
    size: "1024x1024",
    numImages: 1,
    useCredits: false,
    titan: false,
    quality: "standard",
    embedToken: null,
    edit: prompt,
    inputImageUrl: url,
    seed: 0,
    similarityStrength: 0.9045893528738,
    flux: true,
    pro: false,
    face: false,
    useGPT: false,
  });
  return data.data[0]
}

/* Example
(async () => {
  console.log(await img2img('https://motomobinews.id/wp-content/uploads/2023/05/Paul-Walker-2.jpg', "Makes the car's color to white"));
})();
*/
