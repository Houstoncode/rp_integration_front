import React, { useEffect, useState } from 'react';
import { Navbar, Container, Row, Col, Table, Card, Button } from 'react-bootstrap';
import { Modals, TableItem } from './components';
import {
  ModalsAction,
  MODAL_HIDE,
  MODAL_SHOW_EDIT,
  PastJobInfo,
  UserInfo,
  UsersAction,
  UsersState,
  USERS_INIT,
  USER_ADD,
} from './store';
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';

function App() {
  const { modals: modalState } = useSelector<RootStateOrAny, RootStateOrAny>((state) => state);
  const [isOpenModal, setOpenModal] = useState(false);
  const { users: dataUsers } = useSelector<UsersState, any>((state) => state.users);
  const alert = useAlert();
  const dispatch = useDispatch();

  useEffect(() => {
    if (modalState.modalOpen) {
      setOpenModal(true);
    } else setOpenModal(false);
  }, [modalState]);

  const handleGetUsers = async () => {
    const response = await fetch('http://rp-integration.loc/public/api/staffs');
    const { data } = await response.json();

    const usersPayload: UsersState = {
      users: data,
    };

    const action: UsersAction = {
      type: USERS_INIT,
      payload: usersPayload,
    };

    dispatch(action);
  };

  useEffect(() => {
    handleGetUsers();
  }, [dispatch]);

  const handleCloseModal = () => {
    const action: ModalsAction = {
      type: MODAL_HIDE,
    };

    dispatch(action);
  };

  const handleSave = async (data: any) => {
    const { firstName, middleName, lastName, birthDay, pastJobs, gender } = data;

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
      console.log(body);

      const response = await fetch('http://rp-integration.loc/public/api/staffs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const {
        data: { staff },
      } = await response.json();

      const action: UsersAction = {
        type: USER_ADD,
        payload: { user: staff },
      };

      dispatch(action);

      alert.success('Пользователь был успешно создан!');
    } catch (e) {
      alert.error('Произошла ошибка!');
    }

    handleCloseModal();
  };

  const handleAddNewUser = () => {
    const action: ModalsAction = {
      type: MODAL_SHOW_EDIT,
      payload: {
        userData: {
          firstName: '',
          middleName: '',
          lastName: '',
          birthDay: '',
          gender: 'male',
          pastJobs: [],
        },
        isModalCreate: true,
        name: `Создание нового сотрудника`,
        handleCancelModal: handleCloseModal,
        handleConfirmModal: handleSave,
      },
    };

    dispatch(action);
  };

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">Управление персоналом</Navbar.Brand>
      </Navbar>

      <Container fluid="xl" className="pt-4">
        <Card>
          <Card.Body>
            <Row>
              <Col sm="12">
                <Row className="d-flex justify-content-between">
                  <Col md="6">
                    <div className="h3 text-left">Список сотрудников</div>
                  </Col>
                  <Col xs="12" md="5" lg="3" className="mt-2 mt-md-0">
                    <Button variant="outline-success" block onClick={handleAddNewUser}>
                      Добавить нового сотрудника
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col className="pt-3">
                <Table bordered responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Фамилия</th>
                      <th>Имя</th>
                      <th>Отчество</th>
                      <th>Дата рождения</th>
                      <th>Пол</th>
                      <th>Действия</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataUsers.length > 0 ? (
                      dataUsers.map((userInfo: UserInfo) => {
                        return <TableItem userInfo={userInfo} key={userInfo.id} />;
                      })
                    ) : (
                      <tr>
                        <td className="text-center" colSpan={7}>
                          Данные не найдены
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>

      {isOpenModal && <Modals />}
    </div>
  );
}

export default App;
