const BASE_URL = 'https://vndapi2.sgpdev.com';

const URL = {
  GET_ORDER_LIST: BASE_URL + '/GetOrderList',

  GET_ORDER_DETAILS: BASE_URL + '/OrderDetails/',
  GET_LANGUAGE_PACK: BASE_URL + '/LanguagePack/',
  GET_SCRIPT: BASE_URL + '/GetScript/',

  GET_MEDIA: BASE_URL + '/OrderImages/',
  GET_MEDIA_UPLOAD_URL: BASE_URL + '/s3upload',
  GET_MEDIA_UPLOAD_STATUS: BASE_URL + '/status',

  SAVE_TRANSPORT_DATA: BASE_URL + '/Submission/Save',
  SUBMIT_TRANSPORT_DATA: BASE_URL + '/Submission/Submit',
};

export {URL};
