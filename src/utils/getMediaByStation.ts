import {store} from './../_app';

const getMediaLabelsByStation = (station: string) => {
  if (!station) {
    return {};
  }
  const STATION_DATA = store.getState().script.survey.stationData[station];

  const MEDIA_DETAILS = store.getState().gallery.mediaInScript;
  const questionList: string[] = [];
  STATION_DATA.QuestionGroups.forEach(group => {
    group.Questions.map(question => {
      if (question.Type === 'SingleSelect' || question.Type === 'MultiSelect') {
        questionList.push(question.Name);
      }
    });
  });
  let lebelsInScript = Object.keys(MEDIA_DETAILS);

  let MEDIA: {
    [key: string]: {
      [key: string]: {
        response: any[];
        media: any;
        error: boolean;
        imageType: number;
      };
    };
  } = {};
  if (lebelsInScript?.length > 0 && questionList.length > 0) {
    questionList.forEach(questionName => {
      if (lebelsInScript.some(key => key === questionName)) {
        MEDIA = Object.assign(MEDIA, {
          [questionName]: MEDIA_DETAILS[questionName],
        });
      }
    });
  }
  return MEDIA;
};

export {getMediaLabelsByStation};
