import RNFS from 'react-native-fs';
const CONSTANT = {
  LUGGAGE: 'luggage',
  SCRIPT: 'script',
  MEDIA: 'media',
  SAFEGUARD: 'safeguard',
};
let {LUGGAGE, MEDIA, SCRIPT, SAFEGUARD} = CONSTANT;

// write file
const writeFile = async (path: string, file: string) => {
  console.log(path);
  await RNFS.writeFile(path, file, 'utf8')
    .then(() => {
      console.log('FILE WRITTEN!');
    })
    .catch(err => {
      console.log('erroe', err);
    });
};

// read file
const readFile = async (path: string) => {
  console.log(path);
  return await RNFS.readFile(path)
    .then(res => {
      return res;
    })
    .catch(() => {
      return '[]';
    });
};

// delete file
const deleteFile = async (path: string) => {
  await RNFS.unlink(path)
    .then(() => true)
    .catch(() => false);
};

const isDirExist = async (fileName: string) => {
  const isExist = await RNFS.exists(
    `${RNFS.DocumentDirectoryPath}/Safeguard/` + JSON.parse(fileName),
  );
  if (!isExist) {
    try {
      RNFS.mkdir(
        `${RNFS.DocumentDirectoryPath}/Safeguard/` + JSON.parse(fileName),
      );
      return true;
    } catch {
      return false;
    }
  }
  return true;
};

const saveOrderData = async (
  orderNumber: string,
  param: string,
  file: string,
) => {
  const path =
    RNFS.DocumentDirectoryPath + '/Safeguard/' + JSON.parse(orderNumber);
  await isDirExist(orderNumber);
  if (param === LUGGAGE && file) {
    let luggagePath = path + '/' + LUGGAGE + '.txt';
    await writeFile(luggagePath, file);
  }
  if (param === SCRIPT && file) {
    let scriptPath = path + '/' + SCRIPT + '.txt';
    await writeFile(scriptPath, file);
  }
  if (param === MEDIA && file) {
    let mediaPath = path + '/' + MEDIA + '.txt';
    await writeFile(mediaPath, file);
  }
};

const getOrderData = async (orderNumber: string, param: string) => {
  const path = `${RNFS.DocumentDirectoryPath}/Safeguard/${orderNumber}`;

  if (param === LUGGAGE) {
    let luggagePath = path + '/' + LUGGAGE + '.txt';
    return await readFile(luggagePath);
  }
  if (param === SCRIPT) {
    let scriptPath = path + '/' + SCRIPT + '.txt';
    return await readFile(scriptPath);
  }
  if (param === MEDIA) {
    let mediaPath = path + '/' + MEDIA + '.txt';
    return await readFile(mediaPath);
  }
};

const deleteOrderData = async (orderNumber: string, param?: string) => {
  let path = `${RNFS.DocumentDirectoryPath}/Safeguard/${orderNumber}`;
  if (param) {
    if (param === LUGGAGE) {
      return await deleteFile(path + '/' + LUGGAGE + '.txt');
    }
    if (param === SCRIPT) {
      return await deleteFile(path + '/' + SCRIPT + '.txt');
    }
    if (param === MEDIA) {
      return await deleteFile(path + '/' + MEDIA + '.txt');
    }
    if (param === SAFEGUARD) {
      return await deleteFile(`${RNFS.DocumentDirectoryPath}/Safeguard`);
    }
  }
  return await deleteFile(path);
};

const getDownloadedOrderList = async () => {
  const path = `${RNFS.DocumentDirectoryPath}/Safeguard`;
  return await RNFS.readDir(path)
    .then(res => {
      return res.map(item => item.name);
    })
    .catch(err => {
      console.log('catch ', err);
      return [];
    });
};

export {
  isDirExist,
  saveOrderData,
  getOrderData,
  deleteOrderData,
  getDownloadedOrderList,
};
