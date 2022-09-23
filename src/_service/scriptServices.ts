import axios from 'axios';
import Pako from 'pako';
import {Buffer} from 'buffer';
import {store} from '../_app';

import {addOrderToDownloadedList, OrderListProp} from '../_feature/orderLists';
import {_getImagesByOrderNumber} from './mediaServices';

// import { saveUserResponse} from '../utils';
import {URL} from './urls';
import {deleteOrderData, getDownloadedOrderList, saveOrderData} from '../utils';

// save user resopnse
// const _saveTransportData = (
//   data: {
//     Name: string;
//     Values: string[];
//   }[],
//   ThirdPartyGuid: string,
//   scriptType: string,
// ) => {
//   // get data in required formate
//   const transportData = saveUserResponse(data, ThirdPartyGuid, scriptType);
//   axios
//     .put(URL.SAVE_TRANSPORT_DATA, transportData, {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(res => {
//       if (res.data.success === true) {
//         console.log('Data saved successfully', 2);
//       } else {
//         console.log('Data saved Failed', 0);
//       }
//     })
//     .catch(err => {
//       console.log(err);
//       console.log('Something went wrong! While saving data', 0);
//     });
// };

// submit user response
// const _submitTransportData = (
//   data: {
//     Name: string;
//     Values: string[];
//   }[],
//   ThirdPartyGuid: string,
//   scriptType: string,
// ) => {
//   // get data in required formate
//   const transportData = saveUserResponse(data, ThirdPartyGuid, scriptType);
//   axios
//     .put(URL.SUBMIT_TRANSPORT_DATA, transportData, {
//       withCredentials: true,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     })
//     .then(() => {
//       console.log('Data submitted successfully', 2);
//     })
//     .catch(err => {
//       console.log(err);
//       console.log('Something went wrong! While submitting data', 0);
//     });
// };

// get full order list
const _getOrderList = () => {
  return axios.get(URL.GET_ORDER_LIST, {withCredentials: true});
};

// get language pack
const _getLanguagePack = async (lang: string, sourceSystem: string) => {
  const url = `${URL.GET_LANGUAGE_PACK}${lang}/${sourceSystem}`;

  try {
    const res = await axios.get(url, {withCredentials: true});
    return res.data;
  } catch (err) {
    console.log('getLanguagePack - ', err);
    console.log('Something went wrong while getiing Language pack', 0);
  }
};

// get script
const _getScript = async (scriptHash: string) => {
  console.log('Getting Corescript', 2);
  const url = `${URL.GET_SCRIPT}${scriptHash}`;

  try {
    const res = await axios.get(url, {withCredentials: true});
    return res.data;
  } catch (err) {
    console.log('Get script - ', err);
    console.log('Something went wrong while getiing Corescript', 0);
  }
};

// get luggage pack
const _getOrderDetails = async (orderNumber: string, sourceSystem: string) => {
  const url = `${URL.GET_ORDER_DETAILS}${sourceSystem}/${orderNumber}`;
  try {
    const res = await axios.get(url, {withCredentials: true});
    return res.data;
  } catch (err) {
    console.log('Something went wrong while getiing Order Details', 0);
    console.log('Get Order details - ', err);
  }
};

const saveOrderToLocalSpace = async (orderNumber: string) => {
  const SOURCE_SYSTEM = 'INSPI';
  await _getOrderDetails(orderNumber, SOURCE_SYSTEM)
    .then(async res => {
      let initalLuggage = res;
      await saveOrderData(
        JSON.stringify(orderNumber),
        'luggage',
        JSON.stringify(initalLuggage),
      );
      await _getScript(res.scriptHash)
        .then(async scriptData => {
          const decodedScriptBuffer = Buffer.from(
            scriptData.scriptValueGzip,
            'base64',
          );
          const decodedScriptByteArray = new Uint8Array(decodedScriptBuffer);
          const script = Pako.inflate(decodedScriptByteArray, {
            to: 'string',
          }).replace(new RegExp(', ', 'g'), ',');

          try {
            store.dispatch(addOrderToDownloadedList({order: orderNumber}));
            const scriptJson = JSON.parse(script);
            await saveOrderData(
              JSON.stringify(orderNumber),
              'script',
              JSON.stringify(scriptJson),
            );
            store.dispatch(addOrderToDownloadedList({order: orderNumber}));
            console.log('order - ', orderNumber, '  able to parse');
          } catch {
            console.log('order - ', orderNumber, '  not able to parse');
          }

          await _getImagesByOrderNumber(orderNumber ? orderNumber : '')
            .then(async media => {
              await saveOrderData(
                JSON.stringify(orderNumber),
                'media',
                JSON.stringify(media.data.items),
              );
            })
            .catch(err => {
              console.log('unable to get media', orderNumber, err);
            });
        })
        .catch(err => {
          console.log('unable to get script', orderNumber, err);
        });
    })
    .catch(err => {
      console.log('unable to get luggage', orderNumber, err);
    });
};

const _pullDownToDownloadOrder = async (params?: OrderListProp[]) => {
  let orderList: OrderListProp[] = [];
  if (params) {
    orderList = params;
  } else {
    await _getOrderList()
      .then(res => {
        orderList = res.data.items;
      })
      .catch(err => {
        console.log(err);
      });
  }
  // let downloadedOrderList = store.getState().orderList.downloadedOrderList;
  await deleteOrderData('1234567890', 'safeguard').then(() => {
    console.log('file deleted ');
  });

  await getDownloadedOrderList().then(res => {
    orderList.forEach(item => {
      if (!res.some(order => order === item.orderNumber)) {
        console.log('pull data of order number', item.orderNumber);
        saveOrderToLocalSpace(item.orderNumber);
      }
    });
  });
};

export {
  // _saveTransportData,
  // _submitTransportData,
  _getOrderList,
  _getLanguagePack,
  _getOrderDetails,
  _getScript,
  _pullDownToDownloadOrder,
};
