/**
 * Created by vincexie on 2017/3/21.
 */
const phantom = require('phantom');

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function down () {
  const instance = await phantom.create()
  const page = await instance.createPage()
  await page.on('onResourceRequested', function(requestData) {
    console.info('Requesting', requestData.url)
  })

  const status = await page.open('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?spm=a2147.7632989.List.1&ju_id=10000044110017&item_id=15871340952')
  console.log(status)

  // await timeout(10000)
  const content = await page.property('content')
  console.log(content)

  await instance.exit()

  return content
}

down().then(console)