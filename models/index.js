/**
 * Created by vincexie on 2017/1/16.
 */
var mongoose = require('mongoose')
var config   = require('../config')
var logger = require('../common/logger')
mongoose.Promise = global.Promise
mongoose.connect(config.db,config.options, function (err) {
  if (err) {
    logger.error('connect to %s error: ', config.db, err.message)
    process.exit(1)
  }
})

require('./item')

module.exports.clear = function (callback) {
  mongoose.connection.collections['items'].drop( function() {
    console.log('collection dropped')
    callback()
  })
}
