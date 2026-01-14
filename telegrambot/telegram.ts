import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '.env')
});

import { Telegraf } from 'telegraf';
import axios from 'axios';
import { apiAuth } from './src/utils';
import * as cron from 'node-cron';

const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Cron Job
 *
 * Run cron job everyday
 *
 * @param '00 01 * * *' Everyday will backup at 01
 */

cron.schedule('00 01 * * *', async () => {
  console.log('Eksicode User Counts Checking Started');
  console.log('-----------------------------------------');

  const jwt = await apiAuth();

  // Update group members
  const updateMembers = async (id: number, members: number): Promise<void> => {
    try {
      const requestData = {
        members: members
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt
        }
      };
      axios.put(`${process.env.API_URL}/telegrams/` + id, requestData, config)
        .catch(err => {
          console.log(err);
        });
    } catch (err) {
      console.error(err);
    }
  };

  let allGroups: any[];

  // Get group list from api
  axios.get(`${process.env.API_URL}/telegrams?_sort=ListOrder:ASC`)
    .then(async function (response) {
      allGroups = response.data;
    })
    .then(async () => {
      console.log('total groups: ' + allGroups.length);

      const bot = new Telegraf(process.env.BOT_TOKEN!);

      // Get group member count from Telegram
      for (let i = 0; i < allGroups.length; i++) {
        await bot.telegram
          .getChatMembersCount(allGroups[i].channelID)
          .then(data => { allGroups[i].members = data; })
          .then(async () => {
            console.log(allGroups[i].name, allGroups[i].members + ' user');
            await sleep(2000);
            updateMembers(allGroups[i].id, allGroups[i].members);

            console.log(allGroups[i].name + ' Updated...');
            console.log('-------------------------');
          })
          .catch(err => {
            console.log(`${allGroups[i].name} wasn't respond any date.`);
            console.log(err);
          });

        delete allGroups[i].channelID;
      }
    })
    .then(() => {
      console.log('Eksicode User Counts Checking finished');
      console.log('-----------------------------------------');
    })
    .catch((err) => {
      console.log(err);
    });
});
