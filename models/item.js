var mongoose = require('mongoose')

var item = mongoose.Schema({
  title:String,
  url:String,
  itemMallId:{type:String,unique: true},
  sort:String,
  desc:[String],
  price:String,
  priceMarket:String,
  countSold:String,
  itemCovers:[],
  itemImgs:[],
  serverTime:Date,
  targetTime:Date,
  property:{},
  shop:{
    descRating:String,
    serRating:String,
    expRating:String,
    title:String
  },
  mall:String
})

mongoose.model('Item',item)