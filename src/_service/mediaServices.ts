import axios from 'axios';
import {
  compressData,
  compressDataBase64,
  compressStatusData,
  TYPE,
} from 'safeguard-corescript-npm';
import {URL} from './urls';

const _getImagesByOrderNumber = (order: string) => {
  return axios.get(`${URL.GET_MEDIA}${order}`, {
    withCredentials: true,
  });
};

const _getUplodUrl = (props: TYPE.GetUplodUrlProps) => {
  let {fileName, id, imageType, orderNumber, userName} = props;
  let data = compressData({
    fileName,
    id,
    imageType,
    orderNumber,
    userName,
  });
  return axios.post(URL.GET_MEDIA_UPLOAD_URL, data, {
    withCredentials: true,
  });
};

const _uploadImg = (props: TYPE.UploadImgProps) => {
  let {file, fileName, id, imageType, orderNumber, url, userName, config} =
    props;
  let metaData = compressDataBase64({
    fileName,
    id,
    imageType,
    orderNumber,
    userName,
  });
  return axios.put(url, file, {
    withCredentials: true,
    headers: {
      'x-amz-meta-data': `${metaData}`,
      'Content-Type': 'image/jpeg',
    },
    ...config,
  });
};

const _getStatusMedia = (props: TYPE.GetMediaStatus) => {
  const metaData = compressStatusData(props);
  return axios.post(URL.GET_MEDIA_UPLOAD_STATUS, metaData, {
    withCredentials: true,
  });
};

export {_getUplodUrl, _uploadImg, _getImagesByOrderNumber, _getStatusMedia};
