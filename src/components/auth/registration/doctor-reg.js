import React from "react";
import Input from "./component/Input";
import { useState, useEffect } from "react";
import {
  checkUsername,
  checkEmail,
  checkPrefix,
  getSpecialityList,
} from "./api";
import PasswordInput from "./component/PasswordInput";
import Autocomplete from "./component/Autocomplete";
import { Link, useRouteMatch } from "react-router-dom";
// import BackButton from '../../BackButton';
import PublicWrapper from "../../../routes/PublicWrapper";
import { apiURL } from "../../../redux/actions";
import BackButton from "../../BackButton";

function DocReg() {
  const match = useRouteMatch();
  const { referralId } = match.params;

  const [submitting, toggleSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [specialities, setSpecialities] = useState([]);
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    retypePass: "",
    speciality: "",
    licenceNo: "",
    prefix: "",
    referralId: referralId ? referralId : "",
  });
  const [showPassword, togglePassword] = useState(false);
  const [showRPassword, toggleRPassword] = useState(false);

  const [mode, setMode] = useState("basic");

  const onInputChange = (name, value) => setForm({ ...form, [name]: value });

  const submit = () => {
    if (
      form.fullname === "" ||
      form.username === "" ||
      form.email === "" ||
      form.retypePass === "" ||
      form.password === "" ||
      form.prefix === ""
    ) {
      setError("Please complete the form");
    } else {
      if (form.password !== form.retypePass) {
        setError("Passwords do not match!");
      } else {
        toggleSubmitting(true);
        saveDocRecord();
      }
    }
  };

  const saveDocRecord = () => {
    fetch(`${apiURL()}/doctors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    })
      .then((raw) => raw.json())
      .then((data) => {
        toggleSubmitting(false);
        setMode("success");
      })
      .catch((err) => {
        toggleSubmitting(false);
        setError("An error occured");
        console.log("err");
      });
  };

  return (
    <PublicWrapper>
      <div className="d-flex flex-column align-items-center" />
      {/* <div>{JSON.stringify(match)}ss</div> */}
      {/* {<h3>Referred</h3>} */}
      <div className="row mt-2 mb-4 m-0">
        {mode === "success" ? (
          <Success />
        ) : (
          <UserInfo
            form={form}
            onInputChange={onInputChange}
            setMode={setMode}
            error={error}
            submit={submit}
            submitting={submitting}
            showPass={showPassword}
            toggleShowPass={togglePassword}
            showRPass={showRPassword}
            toggleRShowPass={toggleRPassword}
            specialities={specialities}
          />
        )}
      </div>
    </PublicWrapper>
  );
}

function UserInfo({
  form = {},
  onInputChange = (f) => f,
  error = "",
  submit = (f) => f,
  submitting = false,
  toggleShowPass = (f) => f,
  showPass = false,
  toggleRShowPass = (f) => f,
  showRPass = false,
  specialities = [],
}) {
  return (
    <div className="offset-md-1 offset-lg-2 col-md-9 col-lg-8 p-0">
      <BackButton />
      <div className="card">
        <div className="card-header">
          <div>Register as a Doctor</div>
        </div>
        <div className="card-body row">
          <div className="form-group col-lg-6">
            <label htmlFor="fullname">
              Full name <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="validationTooltipUsernamePrepend"
                >
                  Dr.
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                id="fullname"
                name="fullname"
                onChange={(e) => onInputChange("fullname", e.target.value)}
                value={form.fullname}
                placeholder="Enter full name here"
                required
              />
            </div>
          </div>

          <div className="col-lg-6">
            <Autocomplete
              label="Speciality"
              options={
                specialities.length ? specialities : [{ speciality: "" }]
              }
              labelKey="speciality"
              value={form.speciality}
              onChange={(item) => {
                if (item.length) {
                  onInputChange("speciality", item[0].speciality);
                }
              }}
              onInputChange={(text) => onInputChange("speciality", text)}
              name="speciality"
              placeholder="Enter speciality"
              required
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="col-lg-6"
              label="Folio Number"
              name="licenceNo"
              onChange={(e) => onInputChange("licenceNo", e.target.value)}
              value={form.licenceNo}
              placeholder="Enter your folio number"
              required
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="col-lg-6"
              label="Username"
              name="username"
              onChange={(e) => onInputChange("username", e.target.value)}
              value={form.username}
              placeholder="e.g. john"
              required
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="col-lg-6"
              label="Preferred prefix to append to Patient file no. generation"
              name="prefix"
              onChange={(e) => onInputChange("prefix", e.target.value)}
              value={form.prefix}
              placeholder="e.g. JHN for Dr. John Smith"
              required
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="col-lg-6"
              label="Email"
              type="email"
              name="email"
              onChange={(e) => onInputChange("email", e.target.value)}
              value={form.email}
              placeholder="e.g. johnsmith@demo.com"
              required
            />
          </div>
          <div className="col-lg-6">
            <Input
              className="col-lg-6"
              label="Phone Number"
              type="tel"
              name="phone"
              onChange={(e) => onInputChange("phone", e.target.value)}
              value={form.phone}
              required
              // loading={checkingPhone}
              // good={phoneGood}
              // message={phoneMsg}
            />
          </div>
          <div className="col-lg-6">
            <PasswordInput
              className="col-lg-6"
              label="Password (at least 6 characters)"
              required
              value={form.password}
              showPass={showPass}
              toggleShowPass={() => toggleShowPass(!showPass)}
              onChange={(e) => onInputChange("password", e.target.value)}
            />
          </div>
          <div className="col-lg-6">
            <PasswordInput
              className="col-lg-6"
              label="Re-type Password"
              required
              value={form.retypePass}
              showPass={showRPass}
              toggleShowPass={() => toggleRShowPass(!showRPass)}
              onChange={(e) => onInputChange("retypePass", e.target.value)}
            />
          </div>
          <div className="col-lg-6">
            <Input
              label="Referral Code (optional)"
              name="referralId"
              onChange={(e) => onInputChange("referralId", e.target.value)}
              value={form.referralId}
              placeholder="Referral Code"
            />
          </div>
        </div>
        <p className="text-danger text-center">{error}</p>

        <div className="card-footer d-flex flex-row justify-content-end">
          <button className="btn btn-primary" onClick={submit}>
            {submitting ? "Loading..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Success() {
  return (
    <div className="card offset-md-4 col-md-4 mt-5">
      <div className="card-body ">
        <h1>Success</h1>

        <p>
          Your request has been taken, you will be sent an email once your
          account is approved.
        </p>
        <h5>
          Proceed to <Link to="/auth">login</Link>
        </h5>
      </div>
    </div>
  );
}

export default DocReg;
