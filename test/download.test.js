/**
 * Created by vincexie on 2017/3/21.
 */
var models = require('../models')
var down = require('../download')
var fs = require('fs')


describe('download',function () {

  before(function(done) {
    models.clear(done)
  })

  it('getItem',function (done) {
    down.getItem('545094447711').then(function (res) {
      console.log(res)
      done()
    })
  })

  it.only('all',function (done) {
    down(done)
  })
})

