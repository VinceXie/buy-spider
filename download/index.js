/**
 * Created by vincexie on 2017/3/21.
 */
'use strict'
const cheerio = require('cheerio')
const async = require('async')
const phantom = require('phantom')
const toChinese = require('../common/decode').toChinese
const storage = require('../storage')
// const rp = require('request-promise')


const urlDetailJuPrefix = 'https://detail.ju.taobao.com/home.htm?item_id='
const urlDetailJuMobilePrefix = 'https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id='
// const urlDetailMallPrefix = 'https://detail.tmall.com/item.htm?id='
// const urlDetailMallMobilePrefix = 'https://detail.m.tmall.com/item.htm?id='
const urlJuPrefix = 'https://ju.taobao.com/?page='
const urlMDetailPrefix = 'https://mdetail.tmall.com/mobile/itemPackage.do?itemId='

/**
 *
 * @param url https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?spm=a2147.7632989.List.2&ju_id=10000042087212&item_id=544875066509
 * @param cb
 */
let main = async function () {
  let res =  await getJuPage(1)
  return res
}

let getJuPage = async function (pageJu) {
  console.log('getOnePage '+pageJu)
  let content = await downPage(urlJuPrefix+pageJu)
  let itemIds = await parseJu(content)
  if (!itemIds) {
    return new Promise(resolve => resolve('getOnePage last page :' + pageJu))
  }
  console.log('before getItems')
  await getItems(itemIds)
  let res = await getJuPage(pageJu+1)
  return res
}
/**
 * 爬取网页获取内容
 * @param url
 * @returns {*}
 */
let downPage = async function(url) {
  console.log('down ' + url)

  const instance = await phantom.create()
  const page = await instance.createPage()
  // await page.on('onResourceRequested', function(requestData) {
  //   console.info('Requesting', requestData.url)
  // })

  await page.property('viewportSize', {width: 3840, height: 2160})
  await page.property('viewportSize')

  const status = await page.open(url)
  console.log(status + ' ' + url)


  await timeout(3000)
  const content = await page.property('content')

  await instance.exit()

  return content
}

/**
 * 分析聚划算页面
 * @param body
 * @returns {Promise}
 */
let parseJu = async function (body) {
  let $ = cheerio.load(body)
  let itemIds = $('.ju-itemlist #juList li div a').map(function () {
    let itemId = $(this).attr('href').split('item_id=')[1]
    if(itemId)
    {
      return itemId
    }
    else
    {
      return
    }

  }).get()

  return new Promise(function (resolve) {
    resolve(itemIds)
  })
}

let getItems = async function (itemIds) {

  let p = new Promise(resolve =>
    async.mapLimit(itemIds,2,async function (item,callback) {
      await getItem(item).catch(function (err) {
        console.log(err)
      })
      callback()
    },function (err) {
      console.log('getItems return')
      resolve(err)
    }))
  return p
}

let getItem = async function (itemId) {
  let urlDetailJu = urlDetailJuPrefix + itemId
  let urlDetailJuMobile = urlDetailJuMobilePrefix + itemId
  let urlMDetail = urlMDetailPrefix + itemId

  let item = {
    itemMallId: itemId,
    mall:'聚划算',
    url:urlDetailJu
  }
  console.log(itemId)
  try {
    let content = await downPage(urlDetailJu)
    item = await parseDetailJu(content,item)
    content = await downPage(urlDetailJuMobile)
    item = await parseDetailJuMobile(content,item)
    content = await downPage(urlMDetail)
    item = await parseMDetail(content,item)
  }
  catch (err){
    console.log(err)
  }


  console.log(item)
  await storage.saveItem(item)
  return new Promise(resolve => resolve(item))
}

let parseDetailJu = function (body,item) {
  let $ = cheerio.load(body)
  let sort = toChinese($('.detail-main .header .crumbs li a').eq(2).html())
  item.sort = sort

  // console.log(body)
  let targetTime = $('.ju-clock').attr('data-targettime')
  item.targetTime = targetTime

  let serverTime = $('.ju-clock').attr('data-servertime')
  item.serverTime = serverTime

  let desc = $('.main-box .description ul li').map(function () {
    return toChinese($(this).html())
  }).get()
  item.desc = desc

  let itemCovers = $('.thumbnails li img').map(function () {
    return 'http:' + $(this).attr('data-big')
  }).get()
  item.itemCovers = itemCovers

  let itemImgs = $('.infodetail p img').map(function () {
    return 'http:' + $(this).attr('src')
  }).get()
  item.itemImgs = itemImgs

  return new Promise(resolve => resolve(item))
}

let parseDetailJuMobile = function (body,item) {

  let $ = cheerio.load(body)
  let title = $('#J_itemInfo .item-info h1').html()
  title = toChinese(title)
  item.title = title
  if($('#J_itemInfo .price strong').html()){
    let price = $('#J_itemInfo .price strong').html()
    item.price = price
  }
  else if($('.actprice').html())
  {
    let price = $('.actprice').html().split('</i>')[1].split(' ')[0]
    item.price = price
  }


  if($('#J_itemInfo .oprice del').html()) {
    let priceMarket = $('#J_itemInfo .oprice del').html().split(' ')[1]
    item.priceMarket = priceMarket
  }
  let countSold = $('#J_itemInfo .soldcount span').html()
  item.countSold = countSold
  // let itemCovers = $('#J_BannerWrap .ks-xslide-item img').map(function () {
  //   return 'http:' + $(this).attr('src')
  // }).get()
  // item.itemCovers = itemCovers
  // let itemImgs = $('#J_itemH5Desc .h5-desc .des-pages img').map(function () {
  //   return 'http:' + $(this).attr('src')
  // }).get()
  // item.itemImgs = itemImgs
  let shop = {}
  shop.title = toChinese($('#J_shopH5Desc .shopdes .shopname').html())
  shop.descRating = $('#J_shopH5Desc .shopdes .shopasess li .red').eq(0).html().split(' ')[0]
  shop.serRating = $('#J_shopH5Desc .shopdes .shopasess li .red').eq(1).html().split(' ')[0]
  shop.expRating = $('#J_shopH5Desc .shopdes .shopasess li .red').eq(2).html().split(' ')[0]
  item.shop = shop


  return new Promise(resolve => resolve(item))
}

let parseMDetail = function (body,item) {
  // console.log(body)
  let $ = cheerio.load(body)
  let data = toChinese($('pre').html().replace(/&quot;/g,'"'))
  console.log(data)
  let property = JSON.parse(data).model.list
  item.property = property
  return new Promise(resolve => resolve(item))
}


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports=main
module.exports.getItem=getItem