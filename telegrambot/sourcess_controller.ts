import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, '.env')
});

import axios from 'axios';
import { apiAuth } from './src/utils';
import * as cron from 'node-cron';

/**
 * Cron Job
 *
 * Run cron job everyday
 *
 * @param '00 01 * * *' Everyday will backup at 01
 */

cron.schedule('00 01 * * *', async () => {
  console.log('Eksicode Source Checking Process Started');
  console.log('-----------------------------------------');

  let allSources: any[];
  const jwt = await apiAuth();

  const changeApprove = async (id: number, status: string): Promise<void> => {
    try {
      const requestData = {
        approved: status
      };
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + jwt
        }
      };
      axios.put(`${process.env.API_URL}/kaynaklars/` + id, requestData, config);
    } catch (err) {
      console.error(err);
    }
  };

  axios.get(`${process.env.API_URL}/kaynaklars?_limit=10000000&_sort=id:ASC`)
    .then(async (response) => {
      allSources = response.data;
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
      };
      console.log('total links: ' + allSources.length);
      let number = 0;
      allSources.forEach(
        async (source: any) => {
          axios.get(source.doc_link, getConfig)
            .then(async (response) => {
              if (!response.status || response.status >= 399) {
                await changeApprove(source.id, 'false');
                number++;
                throw new Error(number + ' ' + source.doc_link + ' is down' + ' - ');
              } else if (response.status <= 399 && source.status === 'false') {
                await changeApprove(source.id, 'true');
                number++;
              } else {
                console.log(number + '/' + allSources.length + ' - ' + response.status + ' ' + source.doc_link + ' is up');
                number++;
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });

      if (allSources.length === number) {
        console.log('Eksicode Source Checking Process finished');
        console.log('-----------------------------------------');
      }
    })
    .catch((error) => {
      console.log(error);
    });
});
