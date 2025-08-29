import React, { useState } from 'react'
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Input,
  CardFooter,
  Label,
  Container,
  Table,
} from 'reactstrap'
import { useNavigate } from 'react-router-dom'
import { apiURL } from '../../redux/actions'
import { _customNotify, _warningNotify } from '../utils/helpers'

function BookAnAppointment() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    patientName: '',
    purpose: '',
    preferredDate: '',
    preferredLocation: '',
    department: '',
    doctor: '',
    otherNotes: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const onInputChange = ({ target: { name, value } }) => {
    setForm((p) => ({ ...p, [name]: value }))
  }

  const submit = () => {
    if (form.patientName === '' || form.purpose === '' || form.preferredDate === '') {
      _warningNotify('Please complete the form')
    } else {
      setSubmitting(true)
      fetch(`${apiURL()}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
        .then(() => {
          _customNotify('Appointment booked successfully')
          setSubmitting(false)
          navigate('/appointment')
        })
        .catch(() => {
          _warningNotify('An error occured')
          setSubmitting(false)
        })
    }
  }

  return (
    <div>
      <Container>
        <Row>
          <Col>
            <Card>
              <center>
                <CardHeader>Book An Appointment</CardHeader>
              </center>
              <CardBody>
                <Button
                  onClick={() => navigate('/appointment')}
                  className="mt-3"
                >
                  Back
                </Button>
                <Row>
                  <Col md="6">
                    <Label>Patient Name</Label>
                    <Input
                      type="text"
                      name="patientName"
                      value={form.patientName}
                      onChange={onInputChange}
                    />
                  </Col>
                  <Col md="6">
                    <Label>Purpose</Label>
                    <Input
                      type="select"
                      name="purpose"
                      value={form.purpose}
                      onChange={onInputChange}
                    >
                      <option></option>
                    </Input>
                  </Col>
                  <Col md="6">
                    <Label>Preferred Date</Label>
                    <Input
                      type="date"
                      name="preferredDate"
                      value={form.preferredDate}
                      onChange={onInputChange}
                    />
                  </Col>
                  <Col md="6">
                    <Label>Preferred Location</Label>
                    <Input
                      type="select"
                      name="preferredLocation"
                      value={form.preferredLocation}
                      onChange={onInputChange}
                    >
                      <option></option>
                    </Input>
                  </Col>
                  <Col md="6">
                    <Label>Department/ Speciality</Label>
                    <Input
                      type="select"
                      name="department"
                      value={form.department}
                      onChange={onInputChange}
                    >
                      <option></option>
                    </Input>
                  </Col>
                  <Col md="6">
                    <Label>Select Docter (Option)</Label>
                    <Input
                      type="select"
                      name="doctor"
                      value={form.doctor}
                      onChange={onInputChange}
                    >
                      <option></option>
                    </Input>
                  </Col>
                  <Col md="6">
                    <Label>Other Notes</Label>
                    <Input
                      type="textarea"
                      name="otherNotes"
                      value={form.otherNotes}
                      onChange={onInputChange}
                    />
                  </Col>
                </Row>
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={submit} disabled={submitting}>
                  {submitting ? 'Booking...' : 'Book Appointment'}
                </Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default BookAnAppointment
