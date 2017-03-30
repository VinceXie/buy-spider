/**
 * Created by vincexie on 2017/3/30.
 */
require('../models')
const mongoose = require('mongoose')
const Item = mongoose.model('Item')

let saveItem = async function (item) {
  let mItem = new Item(item)
  return await mItem.save()
}

module.exports.saveItem = saveItem