import React, { useState, useEffect } from 'react';
import { Table, FormGroup, Input } from 'reactstrap';
import moment from 'moment';
import { useCallback } from 'react';
import { apiURL } from '../../redux/actions';
import { _customNotify } from '../utils/helpers';
import Loading from '../comp/components/Loading';

function ManageDoctor() {
  const [data, setData] = useState([]);
  const [loading, toggle] = useState(false);

  const getData = useCallback(() => {
    toggle(true);
    fetch(`${apiURL()}/doctors`)
      .then((raw) => raw.json())
      .then((data) => {
        toggle(false);
        setData(data);
      })
      .catch((error) => {
        console.log(error);
        toggle(false);
      });
  });

  const handleActionSelectChange = async (user, value) => {
    let updatedUser = { ...user, status: value };
    try {
      toggle(true);
      let response = await fetch(`${apiURL()}/doctors/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser),
      });
      let data = await response.json();
      if (data) {
        _customNotify('Data updated!');
        getData();
      }
      toggle(false);
    } catch (error) {
      console.log(error);
      toggle(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <h3>Doctors</h3>
      {loading && <Loading />}
      <Table size="md" bordered hover striped>
        <thead>
          <tr>
            <th>S/N</th>
            <th>Full Name</th>
            <th>Licence No</th>
            <th>Speciality</th>
            <th>Date Registered</th>
            <th>Account Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>
                {item.firstname} {item.lastname}
              </td>
              <td>{item.licenceNo}</td>
              <td>{item.speciality}</td>
              <td>{moment(item.createdAt).calendar()}</td>
              <th>
                <span
                  className={`form-control text-center text-light border-0
                    ${
                      item.status === 'approved'
                        ? 'bg-success'
                        : item.status === 'pending'
                        ? 'bg-warning'
                        : item.status === 'suspended'
                        ? 'bg-danger'
                        : 'bg-secondary'
                    }
                  `}
                >
                  {item.status}
                </span>
              </th>
              <td>
                <FormGroup>
                  <Input
                    type="select"
                    name="select"
                    className="mt-2"
                    onChange={(e) =>
                      handleActionSelectChange(item, e.target.value)
                    }
                  >
                    <option value="">Select Action</option>
                    <option value="approve">Approve</option>
                    <option value="lead">Lead Doctor</option>
                    <option value="suspend">Suspend</option>
                  </Input>
                </FormGroup>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}

export default ManageDoctor;
