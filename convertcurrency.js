/**
 * Currency Converter from lang
 * package: axios, cheerio
 * usage at bottom
 */

const axios = require('axios')
const cheerio = require('cheerio')

async function listAvailableCountry(){
    try{
        let { data } = await axios.get('https://www.forbes.com/advisor/money-transfer/currency-converter/')
        const $ = cheerio.load(data)
        let a = []
        $('#to_currency option').each((i, e) => {
            a.push($(e).text().trim())
        })
        return a
    } catch (e) {return e}
}

async function convertCurrency(amount, currency = { from: 'usd', to: 'idr' }){
    if (!amount) return 'Wheres the amount??'
    try{
        let { data } = await axios.get(`https://www.forbes.com/advisor/money-transfer/currency-converter/${currency.from}-${currency.to}/?amount=${amount}`)
        const $ = cheerio.load(data)
        return {
            result: $('.amount').text().trim(),
            currency: $('.result-box-conversion > span').eq(1).text().trim(),
            unit: {
                from: $('.result-box-c1-c2 > div').eq(0).text().replace(/\s+/g, ' ').trim(),
                to: $('.result-box-c1-c2 > div').eq(1).text().replace(/\s+/g, ' ').trim()
            }
        }
    } catch (e) { return e}
}

/* usage */
(async () =>{
    console.log(await convertCurrency(1, { from: 'usd', to: 'zwl' }))
    console.log(await listAvailableCountry())
})()