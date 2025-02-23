/* created by lang
*depsek depsek an katanya*
package: axios
usage: deepseek('your msg')
*/

const axios = require('axios')

async function deepseek(msg){
  let formData = new FormData()
  formData.append('_wpnonce', '29bf9dcc71')
  formData.append('post_id', 14)
  formData.append('url', 'https://deepseekfree.live')
  formData.append('action', 'wpaicg_chat_shortcode_message')
  formData.append('message', msg)
  formData.append('bot_id', 0)
  let  { data } = await axios.post('https://deepseekfree.live/wp-admin/admin-ajax.php', formData, {
    headers: {
      "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryPV7qIySbUthvBScc",
      "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
      "origin": "https://deepseekfree.live",
      "referer": "https://deepseekfree.live/",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    }
  })
  return {
    status: data.status,
    result: data.data
  }
}
