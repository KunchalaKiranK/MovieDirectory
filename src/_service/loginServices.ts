import axios from 'axios';

import {URL} from './urls';

const getLanguagePack = async (lang: string, sourceSystem: string) => {
  console.log('Getting Language Pack', 2);
  const url = `${URL.GET_LANGUAGE_PACK}${lang}/${sourceSystem}`;

  try {
    const res = await axios.get(url, {withCredentials: true});
    console.log('Get the Language pack successfully', 2);
    return res.data;
  } catch (err) {
    console.log('getLanguagePack - ', err);
    console.log('Something went wrong while getiing Language pack', 0);
  }
};

const getScript = async (scriptHash: string) => {
  console.log('Getting Corescript', 2);
  const url = `${URL.GET_SCRIPT}${scriptHash}`;

  try {
    const res = await axios.get(url, {withCredentials: true});
    console.log('Get Corescript successfully', 2);
    return res.data;
  } catch (err) {
    console.log('Get script - ', err);
    console.log('Something went wrong while getiing Corescript', 0);
  }
};

const getOrderDetails = async (orderNumber: string, sourceSystem: string) => {
  console.log('Getting Order', 2);
  const url = `${URL.GET_ORDER_DETAILS}${sourceSystem}/${orderNumber}`;
  try {
    const res = await axios.get(url, {withCredentials: true});
    console.log('Get Order successfully', 2);
    return res.data;
  } catch (err) {
    console.log('Something went wrong while getiing Order Details', 0);
    console.log('Get Order details - ', err);
  }
};

export {getLanguagePack, getOrderDetails, getScript};
