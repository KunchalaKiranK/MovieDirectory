import React from 'react';

import {GalleryView} from '../component';
import {useAppSelector} from '../_app';

const Gallery = () => {
  const orderNumber = useAppSelector(state => state.user.orderNumber);
  const LOCAL_MEDIA = useAppSelector(state => state.gallery.localMedia);

  return <GalleryView imagesList={LOCAL_MEDIA} orderNumber={orderNumber} />;
};

export default Gallery;
