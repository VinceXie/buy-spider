const toChinese = function (str) {
  return unescape(str.replace(/&#x/g,'%u').replace(/;/g,'').replace(/%uA0/g,' '))
}

module.exports.toChinese = toChinese