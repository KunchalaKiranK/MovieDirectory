const ORDER_LIST_FUNCTIONALITY: {[key: string]: string} = {
  START: 'start order',
  RESUME: 'resume order',
  RESTART: 'restart',
  SAVE: 'save order',
  SUBMIT: 'submit order',
  UPLOAD_MEDIA: 'upload label media',
  VIEW_LABELED_MEDIA: 'View labeled media',

  DELETE_MEDIA: 'delete media',

  VIEW_SPACIAL_INSTRUCTION: 'View Work Order Text / Special Instructions',
  ASSIGN_ORDER_TO_SUB: 'assign/unassign order to sub',
  VIEW_PREVIOSLY_SUBMITTED_ORDER: 'View previously submitted order',
  RESPONSE_TO_REQUESTED_INFORMATION: 'Respond to requested information',
};

const ORDER_LIST_STATUS: {[key: string]: string} = {
  NOT_STATED: 'ORDERSTATUS_OPEN',
  IN_PROGRESS: 'ORDERSTATUS_OPEN',
  FULL_FOLLOW_UP: 'ORDERSTATUS_FOLLOWUP',
  PARTIAL_FOLLOW_UP: 'Partial Follow-up',
  SAFEGUARD_REVIEW: 'ORDERSTATUS_RECEIVED',
  COMPLETED: 'ORDERSTATUS_COMPLETED',
  ON_HOLD: 'ORDERSTATUS_ONHOLD',
  CANCELED: 'ORDERSTATUS_VOID',
  PENDING_CALCELED: 'ORDERSTATUS_CANCELED',
};
const ORDER_STATUS: {
  [key: string]: {key: string; color: string};
} = {
  ORDERSTATUS_OPEN: {key: 'Not Started', color: 'black'},
  ORDERSTATUS_OPENs: {key: 'In Progress', color: 'green'},
  ORDERSTATUS_FOLLOWUP: {key: 'Full Follow-up', color: 'grey'},
  PARTIAL_FOLLOW_UP: {key: 'Partial Follow-up', color: 'grey'},
  ORDERSTATUS_RECEIVED: {key: 'Safeguard Review', color: 'yellow'},
  ORDERSTATUS_COMPLETED: {key: 'Completed', color: 'black'},
  ORDERSTATUS_ONHOLD: {key: 'On Hold', color: 'yellow'},
  ORDERSTATUS_VOID: {key: 'Canceled', color: 'red'},
  ORDERSTATUS_CANCELED: {key: 'Pending Canceled', color: 'red'},
};

let {
  ASSIGN_ORDER_TO_SUB,
  DELETE_MEDIA,
  RESPONSE_TO_REQUESTED_INFORMATION,
  RESUME,
  RESTART,
  SAVE,
  START,
  SUBMIT,
  UPLOAD_MEDIA,
  VIEW_LABELED_MEDIA,
  VIEW_PREVIOSLY_SUBMITTED_ORDER,
  VIEW_SPACIAL_INSTRUCTION,
} = ORDER_LIST_FUNCTIONALITY;
let {
  NOT_STATED,
  IN_PROGRESS,
  FULL_FOLLOW_UP,
  PARTIAL_FOLLOW_UP,
  SAFEGUARD_REVIEW,
  COMPLETED,
  ON_HOLD,
  CANCELED,
} = ORDER_LIST_STATUS;

const FUNCTIONS = {
  viewWorkOrderTextSpecialInstructions: [
    NOT_STATED,
    IN_PROGRESS,
    SAFEGUARD_REVIEW,
    FULL_FOLLOW_UP,
    PARTIAL_FOLLOW_UP,
    COMPLETED,
    ON_HOLD,
  ],
  startOrder: [NOT_STATED],
  resumeOrder: [IN_PROGRESS, FULL_FOLLOW_UP],
  restartOrder: [IN_PROGRESS, FULL_FOLLOW_UP],
  uploadLabelMedia: [
    NOT_STATED,
    IN_PROGRESS,
    FULL_FOLLOW_UP,
    PARTIAL_FOLLOW_UP,
  ],
  saveOrder: [NOT_STATED, IN_PROGRESS, FULL_FOLLOW_UP],
  submitOrder: [NOT_STATED, IN_PROGRESS, FULL_FOLLOW_UP, PARTIAL_FOLLOW_UP],

  viewLabeledMedia: [
    IN_PROGRESS,
    SAFEGUARD_REVIEW,
    FULL_FOLLOW_UP,
    PARTIAL_FOLLOW_UP,
    COMPLETED,
    ON_HOLD,
    CANCELED,
  ],
  deleteMedia: [NOT_STATED, IN_PROGRESS, FULL_FOLLOW_UP],
  assignUnassignOrderToSub: [NOT_STATED, IN_PROGRESS],
  viewPreviouslySubmittedOrder: [
    SAFEGUARD_REVIEW,
    FULL_FOLLOW_UP,
    PARTIAL_FOLLOW_UP,
    COMPLETED,
    ON_HOLD,
    CANCELED,
  ],
  respondToRequestedInformation: [PARTIAL_FOLLOW_UP],
};
let {
  assignUnassignOrderToSub,
  deleteMedia,
  respondToRequestedInformation,
  restartOrder,
  resumeOrder,
  saveOrder,
  startOrder,
  submitOrder,
  uploadLabelMedia,
  viewLabeledMedia,
  viewPreviouslySubmittedOrder,
  viewWorkOrderTextSpecialInstructions,
} = FUNCTIONS;

// return boolean based on fun and status
const orderListStatus = (fun: string, status: string) => {
  if (fun === START) {
    return startOrder.some(i => i === status);
  }
  if (fun === RESUME) {
    return resumeOrder.some(i => i === status);
  }
  if (fun === RESTART) {
    return restartOrder.some(i => i === status);
  }
  if (fun === UPLOAD_MEDIA) {
    return uploadLabelMedia.some(i => i === status);
  }
  if (fun === SAVE) {
    return saveOrder.some(i => i === status);
  }
  if (fun === SUBMIT) {
    return submitOrder.some(i => i === status);
  }
  if (fun === DELETE_MEDIA) {
    return deleteMedia.some(i => i === status);
  }
  if (fun === ASSIGN_ORDER_TO_SUB) {
    return assignUnassignOrderToSub.some(i => i === status);
  }
  if (fun === VIEW_SPACIAL_INSTRUCTION) {
    return viewWorkOrderTextSpecialInstructions.some(i => i === status);
  }
  if (fun === VIEW_LABELED_MEDIA) {
    return viewLabeledMedia.some(i => i === status);
  }
  if (fun === VIEW_PREVIOSLY_SUBMITTED_ORDER) {
    return viewPreviouslySubmittedOrder.some(i => i === status);
  }
  if (fun === RESPONSE_TO_REQUESTED_INFORMATION) {
    return respondToRequestedInformation.some(i => i === status);
  }
  return false;
};

export {orderListStatus, ORDER_LIST_FUNCTIONALITY, ORDER_STATUS};
