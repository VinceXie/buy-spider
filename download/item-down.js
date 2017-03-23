/**
 * Created by vincexie on 2017/3/21.
 */
'use strict'
const cheerio = require('cheerio')
const async = require('async')
const phantom = require('phantom')
const toChinese = require('../common/decode').toChinese
/**
 *
 * @param url https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?spm=a2147.7632989.List.2&ju_id=10000042087212&item_id=544875066509
 * @param cb
 */
let main = function (url,callback) {
  async.waterfall([
    function (callback) {
      downPage(url).then(function (body) {
        callback(null,body)
      }).catch(function (err) {
        callback(err)
      })
    },
    parseDetail
  ],function (err,results) {
    callback()
  })
}

let downPage = async function(url) {
  const instance = await phantom.create()
  const page = await instance.createPage()
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url)
  })

  const status = await page.open(url)
  console.log(status)

  // await timeout(10000)
  const content = await page.property('content')
  console.log(content)

  await instance.exit()

  return content
}

let parseDetail = function (body,callback) {
  // console.log(body)
  let $ = cheerio.load(body)
  let title = $('#J_itemInfo .item-info h1').html()
  title = toChinese(title)
  console.log(title)

  callback()
}

module.exports=main
module.exports.parseDetail = parseDetail