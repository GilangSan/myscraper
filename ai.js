/* created by lang
*ai chat scraper*
package: axios
usage: ai('your msg')
*/

const axios = require('axios')

async function ai(msg){
  let formData = new FormData()
  formData.append('_wpnonce', '2bfb1eb0bb')
  formData.append('post_id', 11)
  formData.append('url', 'https://chatbotai.one')
  formData.append('action', 'wpaicg_chat_shortcode_message')
  formData.append('message', msg)
  formData.append('bot_id', 0)
  let  { data } = await axios.post('https://chatbotai.one/wp-admin/admin-ajax.php', formData, {
    headers: {
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryLsMgWIagQ7hFRUP3",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "origin": "https://chatbotai.one",
      "referer": "https://chatbotai.one/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  return {
    status: data.status,
    result: data.data
  }
}
