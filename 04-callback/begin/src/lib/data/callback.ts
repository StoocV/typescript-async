import axios, { AxiosResponse, AxiosError } from 'axios';

import {
  Order,
  Callback,
  CallbackError,
  Hero,
  AccountRepresentative,
} from '../interfaces';
import { apiUrl, parseList } from './config';
import { error } from 'console';

/**
 * TODO: Create a function that gets the hero
 * and all of his/her related data.
 * Use callbacks for both success and error conditions.
 */

export const getHeroTreeCallback = (email: string, callback: Callback<Hero>, callbackError?: CallbackError) =>
{
  getHeroCallback(email, (hero: Hero) => { 
    getOrdersCallback(hero.id, (orders: Order[]) => {
      getAccountRepCallback(hero.id, 
        (accountRep: AccountRepresentative) => {
          hero.orders = orders;
          hero.accountRep = accountRep;
          callback(hero);
      }, 
      error => callbackError(error));
    }, 
    error => callbackError(error));
  }, 
  error => callbackError(error));
};

const getHeroCallback = function(
  email: string,
  callback: Callback<Hero>,
  callbackError?: CallbackError,
) {
  axios
    .get<Hero[]>(`${apiUrl}/heroes?email=${email}`) // change to /heroesXXXXX?email= for error testing
    .then((response: AxiosResponse<Hero[]>) => {
      const data = parseList<Hero>(response);
      const hero = data[0];
      callback(hero);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Hero`);
    });
};

const getOrdersCallback = function(
  heroId: number,
  callback: Callback<Order[]>,
  callbackError?: CallbackError,
) {
  const url = heroId ? `${apiUrl}/orders/${heroId}` : `${apiUrl}/orders`;
  axios
    .get(url)
    .then((response: AxiosResponse<Order[]>) => {
      const orders = parseList<Order>(response);
      callback(orders);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Orders`);
    });
};

const getAccountRepCallback = function(
  heroId: number,
  callback: Callback<AccountRepresentative>,
  callbackError?: CallbackError,
) {
  const url = `${apiUrl}/accountreps/${heroId}`;
  axios
    .get(url)
    .then((response: AxiosResponse<AccountRepresentative>) => {
      const list = parseList<AccountRepresentative>(response);
      const accountRep = list[0];
      callback(accountRep);
    })
    .catch((error: AxiosError) => {
      console.error(`Developer Error: Async Data Error: ${error.message}`);
      callbackError(`Oh no! We're unable to fetch the Account Rep`);
    });
};
