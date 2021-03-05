import { UserInfo } from '../usersReducer';

export const MODAL_SHOW_CONFIRM = 'modals/show/confirm';
export const MODAL_SHOW_EDIT = 'modals/show/edit';
export const MODAL_HIDE = 'modals/hide';

type ModalsType = typeof MODAL_SHOW_CONFIRM | typeof MODAL_SHOW_EDIT | typeof MODAL_HIDE;

export type ModalsState = {
  modal?: ModalInfo;
  modalOpen?: ModalsType;
};

export type ModalsAction = {
  type: ModalsType;
  payload?: ModalInfo;
};

export type ModalInfo = ModalConfirmPayload | ModalEditPayload | ModalHidePayload;

type ModalHidePayload = {} & ModalPayload;

type ModalPayload = {
  name: string;
  handleCancelModal: () => void;
  handleConfirmModal: (data?: any) => void;
};

type ModalConfirmPayload = {} & ModalPayload;

type ModalEditPayload = {
  userData: UserInfo;
  isModalCreate: boolean;
} & ModalPayload;
