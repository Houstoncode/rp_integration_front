import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import {
  MODAL_SHOW_CONFIRM,
  MODAL_SHOW_EDIT,
  UserInfo,
  UserPatchPayload,
  UsersAction,
  USER_PATCH,
} from '../../store';
import { EditBody } from './EditBody';

const initialUser: UserInfo = {
  firstName: '',
  middleName: '',
  lastName: '',
  birthDay: '',
  gender: 'male',
  pastJobs: [],
};

export const Modals = (): JSX.Element => {
  const { modals: modalState } = useSelector<RootStateOrAny, RootStateOrAny>((state) => state);
  const dispatch = useDispatch();
  const { modalOpen, modal } = modalState || {};
  const [user, setUser] = useState<UserInfo>(initialUser);
  const [removed, setRemoved] = useState<number[]>([]);
  const isShow = !!modalOpen;

  const isUnfillableJobs =
    (user &&
      user.pastJobs.filter(
        (pastJob) => !pastJob.endDateWork || !pastJob.organizationName || !pastJob.startDateWork,
      ).length > 0) ||
    false;

  const isDisabled =
    user &&
    (isUnfillableJobs ||
      !user.lastName ||
      !user.middleName ||
      !user.firstName ||
      !user.birthDay ||
      !user.gender);

  const isModalEdit = modalOpen === MODAL_SHOW_EDIT;

  const handleSetRemoved = (value: number) => {
    setRemoved([...removed, value]);
  };

  useEffect(() => {
    setUser(modal?.userData);
  }, []);

  return (
    <Modal size="lg" show={isShow} onHide={modal?.handleCancelModal}>
      <Modal.Header closeButton>
        <Modal.Title>{modal?.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {modalOpen === MODAL_SHOW_CONFIRM
          ? 'Вы действительно хотите выполнить это действие?'
          : user && <EditBody user={user} setUser={setUser} handleSetRemoved={handleSetRemoved} />}
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            modal?.handleCancelModal();
          }}
        >
          Закрыть
        </Button>
        <Button
          variant="primary"
          disabled={isModalEdit && isDisabled}
          onClick={() => {
            if (isModalEdit && !modal?.isModalCreate) {
              const action: UsersAction = {
                type: USER_PATCH,
                payload: {
                  user,
                } as UserPatchPayload,
              };

              dispatch(action);

              modal?.handleConfirmModal({ removed, ...user });
            } else if (modal?.isModalCreate) modal?.handleConfirmModal({ ...user });
            else modal?.handleConfirmModal();
          }}
        >
          {modal?.isModalCreate ? 'Создать пользователя' : 'Сохранить изменения'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
