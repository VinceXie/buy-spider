/**
 * Created by vincexie on 2017/1/16.
 */
var log4js = require('log4js');
var rm = require('rimraf')
log4js.configure({
  appenders: [
    { type: 'console' },
    { type: 'file',
      filename: 'logs/spider.log',
      category: 'spider'}
  ],
  replaceConsole: true
});

var logger = log4js.getLogger('spider');

var clearLog = function () {
  rm('./logs/spider.log',function () {
    
  })
  rm('./logs/upload.log',function () {
    
  })
}

module.exports = logger
module.exports.clearLog = clearLog