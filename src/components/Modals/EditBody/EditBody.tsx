import React, { Fragment } from 'react';
import { Button, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { PastJobInfo, UserInfo } from '../../../store';

type Props = {
  user: UserInfo;
  setUser: React.Dispatch<React.SetStateAction<UserInfo>>;
  handleSetRemoved: (value: number) => void;
};

const currentDate = new Date().toISOString().split('T')[0];

export const EditBody = ({ user, setUser, handleSetRemoved }: Props): JSX.Element => {
  const handleChangePastJob = (pastJob: PastJobInfo, index: number) => {
    const jobs = [...user.pastJobs];
    jobs.splice(index, 1, pastJob);
    setUser({ ...user, pastJobs: jobs });
  };

  const handleRemovePastJob = (index: number, id?: number) => {
    const jobs = [...user.pastJobs];
    jobs.splice(index, 1);
    setUser({ ...user, pastJobs: jobs });
    handleSetRemoved(id || -1);
  };

  return (
    <Fragment>
      <Row>
        <Col sm="12" md="6">
          <FormControl
            placeholder="Имя"
            aria-label="Имя"
            aria-describedby="basic-addon1"
            defaultValue={user.firstName}
            onChange={(event) => {
              setUser({ ...user, firstName: event.currentTarget.value });
            }}
          />
        </Col>
        <Col sm="12" md="6" className="mt-3 mt-md-0">
          <FormControl
            placeholder="Фамилия"
            aria-label="Фамилия"
            aria-describedby="basic-addon1"
            defaultValue={user.lastName}
            onChange={(event) => {
              setUser({ ...user, lastName: event.currentTarget.value });
            }}
          />
        </Col>
        <Col sm="12" className="mt-3">
          <FormControl
            placeholder="Отчество"
            aria-label="Отчество"
            defaultValue={user.middleName}
            onChange={(event) => {
              setUser({ ...user, middleName: event.currentTarget.value });
            }}
          />
        </Col>
        <Col sm="12" className="mt-3">
          <FormControl
            placeholder="Дата рождения"
            type="date"
            max={currentDate}
            aria-label="Отчество"
            defaultValue={user.birthDay}
            onChange={(event) => {
              setUser({ ...user, birthDay: event.currentTarget.value });
            }}
          />
        </Col>
        <Col sm="12" className="mt-3">
          <FormControl
            as="select"
            placeholder="Пол"
            custom
            onChange={(event) => {
              setUser({ ...user, gender: event.currentTarget.value as 'male' | 'female' });
            }}
          >
            <option value="male" {...(user.gender === 'male' ? { selected: true } : {})}>
              Мужской
            </option>
            <option value="female" {...(user.gender === 'female' ? { selected: true } : {})}>
              Женский
            </option>
          </FormControl>
        </Col>
      </Row>
      <Row className="d-flex justify-content-between align-items-center mt-4">
        <Col md="6">
          <div className="h5">Предыдущие места работы</div>
        </Col>
        <Col xs="12" md="6" lg="6" className="mt-2 mt-md-0">
          <Button
            variant="outline-success"
            block
            onClick={() => {
              const pastJobs = [...user.pastJobs];
              pastJobs.push({
                id: -Math.floor(Math.random() * (10000 - 1)) + 1,
                startDateWork: '',
                endDateWork: '',
                organizationName: '',
              });

              setUser({ ...user, pastJobs });
            }}
          >
            Добавить место работы
          </Button>
        </Col>
      </Row>
      {user.pastJobs.map((pastJob, index) => {
        return (
          <Row className="mt-3 d-flex justify-content-center align-items-end" key={pastJob.id}>
            <Col lg="3" className="mt-3 mt-lg-0">
              <FormLabel htmlFor={`name-org-${index}`} className="text-nowrap">
                Название организации
              </FormLabel>
              <FormControl
                id={`name-org-${index}`}
                placeholder="Название организации"
                aria-label="Название организации"
                defaultValue={pastJob.organizationName}
                aria-describedby="basic-addon1"
                onChange={(event) => {
                  const job = { ...pastJob, organizationName: event.currentTarget.value };
                  handleChangePastJob(job, index);
                }}
              />
            </Col>
            <Col lg="4" className="mt-3 mt-lg-0">
              <FormLabel htmlFor={`date-start-${index}`}>Дата начала работы</FormLabel>
              <FormControl
                id={`date-start-${index}`}
                type="date"
                max={currentDate}
                defaultValue={pastJob.startDateWork}
                placeholder="Дата начала работы"
                aria-label="Название организации"
                aria-describedby="basic-addon1"
                onChange={(event) => {
                  const job = { ...pastJob, startDateWork: event.currentTarget.value };
                  handleChangePastJob(job, index);
                }}
              />
            </Col>
            <Col lg="4" className="mt-3 mt-lg-0">
              <FormLabel htmlFor={`date-end-${index}`}>Дата окончания работы</FormLabel>
              <FormControl
                id={`date-end-${index}`}
                type="date"
                max={currentDate}
                defaultValue={pastJob.endDateWork}
                placeholder="Дата окончания работы"
                aria-label="Название организации"
                aria-describedby="basic-addon1"
                onChange={(event) => {
                  const job = { ...pastJob, endDateWork: event.currentTarget.value };
                  handleChangePastJob(job, index);
                }}
              />
            </Col>
            <Col md="1" className="mt-3 mt-lg-0">
              <Button
                variant="outline-danger"
                onClick={() => handleRemovePastJob(index, pastJob.id)}
              >
                <BsX />
              </Button>
            </Col>
          </Row>
        );
      })}
    </Fragment>
  );
};
