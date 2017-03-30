/**
 * Created by vincexie on 2017/3/30.
 */
var storage = require('../storage')


describe('storage',function () {
  it('all',function (done) {
    let item = {
      itemMallId : '1'
    }
    storage.saveItem(item).then(function () {
      done()
    })
  })

})