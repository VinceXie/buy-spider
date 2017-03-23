/**
 * Created by vincexie on 2017/3/21.
 */
var itemDown = require('../download/item-down')
var parseDetail = itemDown.parseDetail
var fs = require('fs')

var url= 'https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?spm=a2147.7632989.List.1&ju_id=10000044110017&item_id=15871340952'

describe('test item-down',function () {
  it('should test',function (done) {
    itemDown(url,done)
  })
  
  it.only('parseDetail',function (done) {
    fs.readFile('./test/body.txt',function (err,data) {
      console.log(data.toString())
      parseDetail(data,done)
    })
  })
})

