/**
 * Created by vincexie on 2017/1/16.
 */

/**
 * args[0]: - String
 * dev      - 本地运行搭配本地mongoDB
 * devYunDB - 本地运行搭配云服务器mongoDB
 * ser      - 云服务器测试运行
 * pro      - 正式上线运行
 */
var dev = 'dev'
var devYunDB = 'devYunDB'
var ser = 'ser'
var pro = 'pro'
var dbDev = 'mongodb://localhost/buy-spider'
var dbDevYun = 'mongodb://localhost:27017/test'
var dbYun = 'mongodb://10.66.187.160:27017/test'

var args = process.argv.slice(2)
var runType = args[0]
if(!runType){
  runType = dev
}

var config = {
  db:'',
  options:{},
  secId:'AKIDgOuHTTouLadXFlsqWHqDONBoMnbEpvAT',
  secKey:'KXZP3WoqnY7XlogLoJfpnjiX9csvpkX9',
  dirMoviePath:'./movies/',
  maxDown:3,
  maxUpload:3
}



var optYun = {
  user:'cmsuser',
  pass:'cms2017@666',
  auth:{
    authSource:'admin'
  }
}


// console.log(runType)

switch (runType){
  case dev :
    config.db = dbDev
    break
  case devYunDB :
    config.db = dbDevYun
    config.options = optYun
    break
  case ser :
    config.db = dbYun
    config.options = optYun
    break
  default :
    config.db = dbDev
    break
}


module.exports=config