import {createSlice, PayloadAction, current} from '@reduxjs/toolkit';

interface MediaType {
  category: string;
  dateCreated: string;
  dateModified: string;
  deptCode: string;
  descPrefix: string;
  descText: string;
  fileSize: number;
  generatedImageFilePath: string;
  guid: string;
  imageFileName: string;
  imageHeight: number;
  imageId: string;
  imageType: number;
  imageWidth: number;
  mimeType: string;
  orderNumber: string;
  releaseDate: string;
  scanDate: string;
  thumbnailSize: 18304;
  webFileName: string;
}

// Gallery state types
interface Props {
  currentQuestionName: string;
  open: boolean;
  modalStatus: boolean;
  modalIndex: number;
  mediaLabelModal: boolean;
  mediaLabelModalData: {data: any; question: string; label: string};
  filterType: string;
  galleryMedia: MediaType[];
  unusedMedia: MediaType[];
  usedMedia: MediaType[];
  tempUsedMedia: MediaType[];
  dragFiles: MediaType[];
  mediaInScript: {
    [key: string]: {
      [key: string]: {
        response: any[];
        media: any;
        error: boolean;
        imageType: number;
      };
    };
  };
  imageUploadStatus: {[key: string]: [string, number]};
  localMedia: any[];
}

// initial state of media gallery
const initialState: Props = {
  currentQuestionName: '',
  open: false,
  modalStatus: false,
  modalIndex: 0,
  mediaLabelModal: false,
  mediaLabelModalData: {data: {}, question: '', label: ''},
  filterType: 'unusedMedia',
  galleryMedia: [],
  unusedMedia: [],
  usedMedia: [],
  tempUsedMedia: [],
  dragFiles: [],
  localMedia: [],
  imageUploadStatus: {},
  mediaInScript: {},
};

const gallerySlice = createSlice({
  name: 'gallery',
  initialState,
  reducers: {
    // reset the state
    resetGallery: () => initialState,

    //update gallery pics
    updateLocalMedia: (state: Props, action: PayloadAction<{id:string, orderNumber: string; uploadStatus: boolean, path: string, fileType: string, platform: string}>) => {
      current(state);
      state.localMedia.push(action.payload)
    },

    // update current question user viewing
    updateCurrentQuestion: (state: Props, action: PayloadAction<string>) => {
      current(state);
      if (action.payload !== state.currentQuestionName) {
        state.currentQuestionName = action.payload;
      }
    },
    // update the media label modal
    updateMediaLabelModal: (
      state: Props,
      action: PayloadAction<{
        status: boolean;
        data?: {data: any; question: string; label: string};
      }>,
    ) => {
      current(state);
      state.mediaLabelModal = action.payload.status;
      if (action.payload.data) {
        state.mediaLabelModalData = action.payload.data;
      }
    },

    // track multi select data and update it
    updateDragFiles: (
      state: Props,
      action: PayloadAction<{media: any; states: number}>, // states 1=> add 0=> remove 3=> delete
    ) => {
      current(state);
      let {media, states} = action.payload;
      // add media
      if (states === 1) {
        if (state.dragFiles) {
          state.dragFiles = [media, ...state.dragFiles];
        } else {
          state.dragFiles = [media];
        }
      }
      // remove media
      if (states === 0) {
        if (state.dragFiles.length > 0) {
          state.dragFiles = state.dragFiles.filter(
            item => item.guid !== media.guid,
          );
        }
      }
      // delete state or empaty it
      if (states === 2) {
        state.dragFiles = [];
      }
    },

    // reducer for tracking the upload media status
    updateImgUploadStatus: (
      state: Props,
      action: PayloadAction<{name: string; data: [string, number, string]}>,
    ) => {
      current(state);
      let {name, data} = action.payload;
      if (data[1] === 102) {
        console.log('Image upload fail', 0);
      }
      if (data[1] === 103) {
        console.log('Image upload success', 2);
      }
      if (data[1] > 101) {
        delete state.imageUploadStatus[name];
      } else {
        state.imageUploadStatus = Object.assign(
          state.imageUploadStatus ? state.imageUploadStatus : {},
          {
            [name]: data,
          },
        );
      }
    },

    // reducer for opening and closing the gallery
    updateGalleryState: (
      state: Props,
      action: PayloadAction<{open: boolean}>,
    ) => {
      current(state);
      state.open = action.payload.open;
    },
    // track gallery model index and view
    updateModalStatus: (
      state: Props,
      action: PayloadAction<{
        modalStatus: boolean;
        modalIndex: number;
        type: string;
      }>,
    ) => {
      current(state);
      state.modalIndex = action.payload.modalIndex;
      state.modalStatus = action.payload.modalStatus;
      state.filterType = action.payload.type;
    },

    // update initial state of gallery and unused media
    updateGalleryMedia: (
      state: Props,
      action: PayloadAction<{galleryMedia: MediaType[]}>,
    ) => {
      current(state);
      state.galleryMedia = action.payload.galleryMedia;
      state.unusedMedia = action.payload.galleryMedia;
      state.usedMedia = [];
    },

    updateMediaFromLuggage: (
      state: Props,
      action: PayloadAction<{key: string; value: string[]; media: any[]}>,
    ) => {
      current(state);
      let mediaIds: any[] = [];

      action.payload.media.forEach(item => {
        item.imageId?.forEach((mediaId: number | string) => {
          mediaIds.push(mediaId);
        });
      });

      // update used and unused media
      state.unusedMedia = [
        ...current(state.unusedMedia).filter(
          media => !mediaIds.some(id => id === media.imageId),
        ),
      ];
      state.usedMedia.push(
        ...current(state.galleryMedia).filter(media =>
          mediaIds.some(id => id === media.imageId),
        ),
      );
    },

    // reducer for handle add media to respective label
    usedMediaInScript: (state: Props, action: PayloadAction<MediaType>) => {
      current(state);
      state.tempUsedMedia = state.tempUsedMedia ? state.tempUsedMedia : [];
      state.tempUsedMedia.push(action.payload);
      state.unusedMedia = state.unusedMedia.filter(
        item => item.imageId !== action.payload.imageId,
      );
    },

    // remove media from respective label
    removeMedia: (state: Props, action: PayloadAction<any[]>) => {
      current(state);
      action.payload.forEach(file => {
        state.tempUsedMedia = state.tempUsedMedia.filter(
          item => item.imageId !== file.imageId,
        );
        let include = state.unusedMedia.some(i => i.imageId === file.imageId);
        if (!include) {
          state.unusedMedia.push(file);
        }
      });
    },

    // reducer for updating the media labels and for removing them
    updateImagesInScript: (
      state: Props,
      action: PayloadAction<{
        question: string;
        answer: boolean;
        media: {
          [
            key: string | 'Photos' | 'Videos' | 'Documents' | 'ScreenShots'
          ]: any[];
        };
        luggage?: boolean;
        mediaIds?: any[];
      }>,
    ) => {
      current(state);
      let {question, answer, media, luggage, mediaIds} = action.payload;

      if (!answer) {
        if (state.mediaInScript[question]) {
          let keys = Object.keys(state.mediaInScript[question]);
          if (keys.length > 0) {
            keys.forEach(() => {
              state.mediaInScript?.question?.label?.response.forEach(item => {
                state.unusedMedia.push(item);
                state.usedMedia.filter(items => items.imageId !== item.imageId);
              });
            });
          }
        }
        delete state.mediaInScript[question];
      } else {
        // Photos === 5
        // Videos === 13
        // Documents === 2
        // ScreenShots === 18
        let mediaLabels: {
          [key: string]: {
            response: any[];
            media: any;
            error: boolean;
            imageType: number;
          };
        } = {};
        for (const files in media) {
          let type: number =
            files === 'Photos'
              ? 5
              : files === 'Videos'
              ? 13
              : files === 'Documents'
              ? 2
              : files === 'ScreenShots'
              ? 18
              : 0;

          // if functioned called from luggage then also update media response
          if (mediaIds && luggage) {
            const getMediaByKey = (key: string) => {
              let ids = mediaIds?.filter(item => item.label === key)[0]
                ?.imageId;
              let mediaSources = current(state.galleryMedia).filter(item =>
                ids?.some((id: any) => id === item.imageId),
              );
              return mediaSources ? mediaSources : [];
            };

            media[files].forEach(mediaPlaceholder => {
              mediaLabels[`${mediaPlaceholder.Label}`] = {
                response: getMediaByKey(mediaPlaceholder.Label),
                media: mediaPlaceholder,
                error: false,
                imageType: type,
              };
            });
          } else {
            media[files].forEach((item: any) => {
              mediaLabels[item.Label] = {
                response: [],
                media: item,
                error: false,
                imageType: type,
              };
            });
          }
        }
        state.mediaInScript = Object.assign(
          state.mediaInScript ? state.mediaInScript : {},
          {
            [question]: mediaLabels,
          },
        );
      }
    },

    updateMediaInScriptResponse: (
      state: Props,
      action: PayloadAction<{
        question: string;
        label: string;
        value: any[];
      }>,
    ) => {
      current(state);
      let {question, label, value} = action.payload;
      state.mediaInScript[question][label].response = value;
      if (state.mediaInScript[question][label].media.Min <= value.length) {
        state.mediaInScript[question][label].error = false;
      } else {
        state.mediaInScript[question][label].error = true;
      }
    },

    updateMediaErrorInScript: (
      state: Props,
      action: PayloadAction<{
        question: string;
        label: string;
        err: boolean;
      }>,
    ) => {
      current(state);
      let {question, label, err} = action.payload;
      if (state.mediaInScript[question]?.[label]) {
        state.mediaInScript[question][label].error = err;
      }
    },
  },
});

export const {
  resetGallery,
  updateMediaLabelModal,
  updateCurrentQuestion,
  updateGalleryState,
  updateGalleryMedia,
  usedMediaInScript,
  removeMedia,
  updateModalStatus,
  updateImagesInScript,
  updateMediaInScriptResponse,
  updateImgUploadStatus,
  updateDragFiles,
  updateMediaErrorInScript,
  updateMediaFromLuggage,
  updateLocalMedia
} = gallerySlice.actions;
export default gallerySlice.reducer;
