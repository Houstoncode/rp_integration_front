import {
  ModalsAction,
  MODAL_HIDE,
  MODAL_SHOW_EDIT,
  PastJobInfo,
  UserInfo,
  UserPatchPayload,
  UserRemovePayload,
  UsersAction,
  USER_PATCH,
  USER_REMOVE,
} from '../store';
import React, { Fragment } from 'react';
import { Button, Col, Row, Table } from 'react-bootstrap';
import { BsPencil, BsTrash } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useAlert } from 'react-alert';

type TableItemProps = {
  userInfo: UserInfo;
};

export const TableItem = ({ userInfo }: TableItemProps): JSX.Element => {
  const { id, firstName, middleName, lastName, birthDay, pastJobs, gender } = userInfo;
  const dispatch = useDispatch();
  const alert = useAlert();

  const handleCloseModal = () => {
    const action: ModalsAction = {
      type: MODAL_HIDE,
    };

    dispatch(action);
  };

  const handleSave = async (data: any) => {
    const { removed, pastJobs, firstName, lastName, middleName, gender, birthDay } = data;

    const editedRemoved = removed.filter((remove: number) => remove > 0);

    if (editedRemoved.length > 0) {
      try {
        await fetch('http://rp-integration.loc/public/api/jobs/delete', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ removed: editedRemoved }),
        });
      } catch (e) {
        alert.error('Произошла ошибка');
      } finally {
      }
    }

    const editedPastJobs = pastJobs.map((pastJob: PastJobInfo) => {
      const obj: any = {
        name: pastJob.organizationName,
        start_date: pastJob.startDateWork,
        end_date: pastJob.endDateWork,
      };

      if (pastJob.id) {
        obj['id'] = pastJob.id;
      }

      return obj;
    });

    try {
      const body = {
        first_name: firstName,
        last_name: lastName,
        middle_name: middleName,
        gender: gender,
        birthday: birthDay,
        past_jobs: editedPastJobs,
      };

      const response = await fetch(`http://rp-integration.loc/public/api/staffs/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      const { data } = await response.json();

      const action: UsersAction = {
        type: USER_PATCH,
        payload: {
          user: data.staff,
        } as UserPatchPayload,
      };

      alert.success('Вы успешно сохранили пользователя!');

      dispatch(action);
    } catch (e) {
      console.log(e);
      alert.error('Произошла ошибка!');
    }

    handleCloseModal();
  };

  const handleRemoveUser = async () => {
    try {
      await fetch(`http://rp-integration.loc/public/api/staffs/${id}`, {
        method: 'delete',
      });

      const action: UsersAction = {
        type: USER_REMOVE,
        payload: { id } as UserRemovePayload,
      };

      dispatch(action);

      alert.success(`Пользователь с #${id} был успешно удалён`);
    } catch (e) {
      alert.error('Произошла ошибка');
    }
  };

  return (
    <Fragment>
      <tr
        className="clickable"
        data-toggle="collapse"
        data-target={`#item-${id}`}
        aria-expanded={false}
        aria-controls={`item-${id}`}
      >
        <td>{id}</td>
        <td>{lastName}</td>
        <td>{firstName}</td>
        <td>{middleName}</td>
        <td>{birthDay}</td>
        <td>{gender === 'male' ? 'Мужской' : 'Женский'}</td>
        <td>
          <Button
            variant="outline-primary"
            onClick={(event) => {
              event.stopPropagation();
              const action = {
                type: MODAL_SHOW_EDIT,
                payload: {
                  userData: userInfo,
                  name: `Редактирование сотрудника #${id}`,
                  handleCancelModal: handleCloseModal,
                  handleConfirmModal: handleSave,
                },
              };

              dispatch(action);
            }}
          >
            <BsPencil />
          </Button>
          <Button
            variant="outline-danger"
            className="ml-md-3 mt-2 mt-md-0"
            onClick={(event) => {
              event.stopPropagation();
              handleRemoveUser();
            }}
          >
            <BsTrash />
          </Button>
        </td>
      </tr>
      <tr>
        <td colSpan={7} id={`item-${id}`} className="collapse">
          <Row>
            <Col xs={12}>
              <div className="h5 text-left pb-2">Предыдущие места работы</div>
            </Col>
            <Col>
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>Название организации</th>
                    <th>Дата начала работы</th>
                    <th>Дата окончания работы</th>
                  </tr>
                </thead>
                <tbody>
                  {pastJobs &&
                    pastJobs.map(({ organizationName, startDateWork, endDateWork }, index) => (
                      <tr key={index}>
                        <td>{organizationName}</td>
                        <td>{startDateWork}</td>
                        <td>{endDateWork}</td>
                      </tr>
                    ))}
                  {pastJobs.length === 0 && (
                    <tr className="text-center">
                      <td colSpan={3}>Данные отсутствуют</td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </td>
      </tr>
    </Fragment>
  );
};
