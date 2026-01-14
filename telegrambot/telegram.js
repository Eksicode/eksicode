const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '.env')
})
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const axios = require('axios')
const { apiAuth } = require('./src/utils')
const cron = require('node-cron')

const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Cron Job
 *
 * Run crone job everyday
 *
 * @param '00 01 * * *' Evertyday will backup at 01
 */

cron.schedule('00 01 * * *', async () => {
  // cron.schedule('1 * * * * *', async () => {
  console.log('Eksicode User Counts Checking Started')
  console.log('-----------------------------------------')

  const jwt = await apiAuth()

  // Update group members
  const updateMembers = async (id, members) => {
    try {
      const requestData = {
        members: members
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt
        }
      }
      axios.put(`${process.env.API_URL}/telegrams/` + id, requestData, config)
        .catch(err => {
          console.log(err)
        })
    } catch (err) {
      console.error(err)
    }
  }

  let allGroups

  // Get group list from api
  axios.get(`${process.env.API_URL}/telegrams?_sort=ListOrder:ASC`)
    .then(async function (response) {
      allGroups = response.data
    })
    .then(async () => {
      console.log('total groups: ' + allGroups.length)

      // Get group member count from Telegram
      for (let i = 0; i < allGroups.length; i++) {
        await bot.telegram
          .getChatMembersCount(allGroups[i].channelID)
          .then(data => { allGroups[i].members = data })
          .then(async () => {
            console.log(allGroups[i].name, allGroups[i].members + ' user')
            await sleep(2000)
            updateMembers(allGroups[i].id, allGroups[i].members)

            console.log(allGroups[i].name + ' Uptated...')
            console.log('-------------------------')
          })
          .catch(err => {
            console.log(`${allGroups[i].name} wasn't respond any date.`)
            console.log(err)
          })

        delete allGroups[i].channelID
      }
    })
    .then(() => {
      console.log('Eksicode User Counts Checking finished')
      console.log('-----------------------------------------')
    })
    .catch((err) => {
      console.log(err)
    })
})
