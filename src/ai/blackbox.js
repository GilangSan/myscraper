/**
 * Created By Lang
 * BlackBox AI Scraper
 * Support Prompt, Models And History
 * Can Read Image
 * @package axios
 * Example: blackbox('msg', false, models[1], [], 'your prompt', true)
 * Thanks To Zervida
 */

const axios = require('axios')
const fs = require('fs')

const models = [
  "gemini",
  "deepseek-r1",
  "deepseek-v3"
  ]

/** 
 * Generate Random ID For chat
 * 
 * @param {number} length
 * @returns {String}
 */
function generateRandomId(length = 7) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomId = '';
  for (let i = 0; i < length; i++) {
    randomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return randomId;
}

/**
 * AI Chat function
 * 
 * @param {String} msg
 * @param {Buffer} image
 * @param {String} model // models Array
 * @param {arrayObject} history
 * @param {String} prompt
 * @param {Boolean} codeMode
 * @param {Boolean} deepsearch
 * @returns {array}
 */
async function blackbox(msg, image = false, model = null, history = [], prompt = null, codeMode = false, deepsearch = false){
  let agentMode = {}
  let userSelectedModel = null
  try {
    switch(model) {
      case "gemini": 
        agentMode = {
          id: "Gemini/Gemini-Flash-2.0",
          mode: true,
          name: "Gemini-Flash-2.0"
        }
        userSelectedModel = "Gemini-Flash-2.0"
      break
      case "deepseek-r1":
        agentMode = {
          id: "deepseek-reasoner",
          mode: true,
          name: "DeepSeek-R1"
        }
        userSelectedModel = "DeepSeek-R1"
      break
      case "deepseek-v3":
        agentMode = {
          id: "deepseek-chat",
          mode: true,
          name: "DeepSeek-V3"
        }
        userSelectedModel = "DeepSeek-V3"
      break
    }
    
    let messages = []
    for (let i of history){
      messages.push(i)
    }
    if (image) {
        let base64 = `data:image/png;base64,${image.toString('base64')}`
        messages.push(
            {
              "id": generateRandomId(),
              "content": msg,
              "role": "user",
              "data": {
                "imagesData": [
                  {
                    "filePath": `MultipleFiles/${generateRandomId()}.png`,
                    "contents": base64
                  }
                ],
                "fileText": "",
                "title": ""
              }
            }
          )
    } else {
        messages.push({
            "role":"user",
            "content":msg,
            "id":generateRandomId()
          })
    }
    let { data } = await axios.post('https://www.blackbox.ai/api/chat', {
      messages,
      agentMode,
      "id":"eZPRPvp",
      "previewToken":null,
      "userId":null,
      "codeModelMode":true,
      "trendingAgentMode":{},
      "isMicMode":false,
      "userSystemPrompt":prompt,
      "maxTokens":1024,
      "playgroundTopP":null,
      "playgroundTemperature":null,
      "isChromeExt":false,
      "githubToken":"",
      "clickedAnswer2":false,
      "clickedAnswer3":false,
      "clickedForceWebSearch":false,
      "visitFromDelta":false,
      "isMemoryEnabled":false,
      "mobileClient":false,
      userSelectedModel,
      "validated":"00f37b34-a166-4efb-bce5-1312d87f2f94",
      "imageGenerationMode":true,
      "webSearchModePrompt":false,
      "deepSearchMode":deepsearch,
      "domains":null,
      "vscodeClient":false,
      "codeInterpreterMode":codeMode,
      "customProfile":{"name":"","occupation":"","traits":[],"additionalInfo":"","enableNewChats":false},"session":null,"isPremium":false,"subscriptionCache":null,"beastMode":false
    }, {
      headers: {
        "content-type": "application/json",
        origin: "https://www.blackbox.ai",
        referer: "https://www.blackbox.ai/",
        "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
      },
      responseType: "stream"
    })
    let output = ''
    let search = []
    data.on('data', chunk => {
            const chunkStr = chunk.toString();
            output += chunkStr;
            
            const match = output.match(/\$~~~\$(.*?)\$~~~\$/);
            if (match) {
                search = JSON.parse(match[1]);
                if (search.length) output = output.replace(match[0], '')
                output = output.replace(/^[\r\n]*[A-Za-z]+/, '');
                output = output.replace(/^(\r\n|\r|\n){4}/, '');
            } else {
            }
        });
        
        return new Promise((resolve) => {
            data.on('end', () => {
                resolve({ search, text: output.trim() });
            });
        });
  } catch (e) { return e }
}