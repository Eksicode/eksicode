const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const axios = require('axios')
const { apiAuth } = require('./src/utils')
const cron = require('node-cron')

/**
 * Cron Job
 *
 * Run crone job everyday
 *
 * @param '00 01 * * *' Evertyday will backup at 01
 */

cron.schedule('00 01 * * *', async () => {
// cron.schedule('1 * * * * *', async () => {
  console.log('Eksicode Source Checking Process Started')
  console.log('-----------------------------------------')

  let allSourcess
  const jwt = await apiAuth()

  const changeApprove = async (id, status) => {
    try {
      const requestData = {
        approved: status
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt
        }
      }
      axios.put('https://api.eksicode.org/kaynaklars/' + id, requestData, config)
    } catch (err) {
      console.error(err)
    }
  }

  axios.get('https://api.eksicode.org/kaynaklars?_limit=10000000&_sort=id:ASC')
    .then(async (response) => {
      allSourcess = response.data
    })
    .then(() => {
      const getConfig = {
        timeout: 60000,
        maxContentLength: 500 * 1000 * 1000,
        headers: {
          'Content-Type': 'text/html; charset=UTF-8',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_2) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9',
          Authorization: 'Bearer ' + jwt
        }
      }
      console.log('total links: ' + allSourcess.length)
      let number = 0
      allSourcess.forEach(
        async (source) => {
          axios.get(source.doc_link, getConfig)
            .then(async (response) => {
              if (response.status === '' || response.status >= 399) {
                // console.log(response.status)
                await changeApprove(source.id, 'false')
                number++
                throw new Error(number + ' ' + source.doc_link + ' is down' + ' - ')
              } else if (response.status <= 399 && source.status === 'false') {
                await changeApprove(source.id, 'true')
                number++
              } else {
                console.log(number + '/' + allSourcess.length + ' - ' + response.status + ' ' + source.doc_link + ' is up')
                number++
              }
            })
            .catch((error) => {
              console.log(error)
            })
        })

      if (allSourcess.length === number) {
        console.log('Eksicode Source Checking Process finished')
        console.log('-----------------------------------------')
      }
    })
    .catch((error) => {
      console.log(error)
    })
})
