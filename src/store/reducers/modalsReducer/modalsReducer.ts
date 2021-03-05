import {
  ModalsAction,
  ModalsState,
  MODAL_HIDE,
  MODAL_SHOW_CONFIRM,
  MODAL_SHOW_EDIT,
} from './modalsReducer.type';

const initialState: ModalsState = {
  modal: undefined,
  modalOpen: undefined,
};

export function modals(state: ModalsState = initialState, action: ModalsAction) {
  switch (action.type) {
    case MODAL_SHOW_CONFIRM: {
      return { ...state, modal: { ...action.payload }, modalOpen: action.type };
    }

    case MODAL_SHOW_EDIT: {
      return { ...state, modal: { ...action.payload }, modalOpen: action.type };
    }

    case MODAL_HIDE: {
      return { ...state, modal: undefined, modalOpen: undefined };
    }

    default: {
      return state;
    }
  }
}
