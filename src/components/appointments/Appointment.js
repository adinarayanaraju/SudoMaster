import React, { useState, useEffect } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Container,
  Table,
} from 'reactstrap'
import { useHistory } from 'react-router-dom'
import { apiURL } from '../../redux/actions'
import Loading from '../comp/components/Loading'

function Appointment() {
  const history = useHistory()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(false)

  const getAppointments = () => {
    setLoading(true)
    fetch(`${apiURL()}/appointments`)
      .then((raw) => raw.json())
      .then((data) => {
        setAppointments(data)
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  useEffect(() => {
    getAppointments()
  }, [])

  return (
    <div>
      <Row>
        <Col>
          <Container>
            <Card>
              <center>
                <CardHeader>Appointment</CardHeader>
              </center>
              <CardBody>
                <div>
                  <Button
                    style={{ margin: '0em' }}
                    onClick={() => history.push('/me/appointments/bookanappointment')}
                  >
                    Add New
                  </Button>
                  <Button style={{ margin: '1em' }}>View Calendar</Button>
                  <Button onClick={() => history.push('/me/appointments/sendmessge')}>
                    Send Messege
                  </Button>
                </div>
                <Row className="mt-4">
                  {loading && <Loading />}
                  <Table className="mt-4 table table-bordered">
                    <thead>
                      <tr>
                        <th>Patient Name</th>
                        <th>Purpose</th>
                        <th>Department</th>
                        <th>Doctor</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>
                      {appointments.map((item, index) => (
                        <tr key={index}>
                          <td>{item.patientName}</td>
                          <td>{item.purpose}</td>
                          <td>{item.department}</td>
                          <td>{item.doctor}</td>
                          <td>{item.preferredDate}</td>
                          <td>
                            <Button onClick={() => history.push('/me/appointments/viewappointment')}>
                              View
                            </Button>
                            &nbsp;
                            <Button
                              onClick={() => history.push('/me/appointments/bookanappointment')}
                            >
                              Edit
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Row>
              </CardBody>
            </Card>
          </Container>
        </Col>
      </Row>
    </div>
  )
}
export default Appointment
