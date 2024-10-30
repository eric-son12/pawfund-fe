import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";

import "./Register.scss";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerType, setRegisterType] = useState<string>("user");
  const register = useStore((store) => store.register);

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Sign-up user form values:", values);
      register(values, registerType);
    },
  });

  const formikVolunteer = useFormik({
    initialValues: {
      fullName: "",
      gender: "",
      phone: "",
      address: "",
      dob: "",
      cccd: "",
      experience: "",
      currentJob: "",
      reason: "",
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Name is required"),
      gender: Yup.string().required("Gender is required"),
      phone: Yup.string().required("Phone is required"),
      address: Yup.string().required("Address is required"),
      dob: Yup.string().required("DOB is required"),
      cccd: Yup.string().required("CCCD is required"),
      experience: Yup.string().required("Experience is required"),
      currentJob: Yup.string().required("Current Job is required"),
      reason: Yup.string().required("Reason Job is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      console.log("Sign-up volunteer form values:", values);
      let body: any = values;
      body["username"] = values.email;
      register(values, registerType);
    },
  });

  return (
    <div className="register-page">
      <img className="bg-register" src="login-background.avif" alt="bg-login" />
      <div
        className={`register-container ${
          registerType === "volunteer" ? "register-volunteer" : "register-user"
        }`}
      >
        <img
          className="logo"
          src="/logo.svg"
          alt="logo"
          onClick={() => navigate("/")}
        />
        <h4 className="title">Đăng ký</h4>

        {registerType === "user" ? (
          <form onSubmit={formik.handleSubmit}>
            <div>
              <TextField
                fullWidth
                id="name"
                name="name"
                label="Name"
                variant="outlined"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                variant="outlined"
                value={formik.values.phone}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                variant="outlined"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="confirmPassword"
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="outlined"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.confirmPassword &&
                  Boolean(formik.errors.confirmPassword)
                }
                helperText={
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                }
              />
            </div>

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Đăng ký
            </Button>
          </form>
        ) : (
          <form onSubmit={formikVolunteer.handleSubmit}>
            <div>
              <TextField
                fullWidth
                id="fullName"
                name="fullName"
                label="Full Name"
                variant="outlined"
                value={formikVolunteer.values.fullName}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.fullName &&
                  Boolean(formikVolunteer.errors.fullName)
                }
                helperText={
                  formikVolunteer.touched.fullName &&
                  formikVolunteer.errors.fullName
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <FormControl
                fullWidth
                variant="outlined"
                error={
                  formikVolunteer.touched.gender &&
                  Boolean(formikVolunteer.errors.gender)
                }
              >
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formikVolunteer.values.gender}
                  onChange={formikVolunteer.handleChange}
                  onBlur={formikVolunteer.handleBlur}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {formikVolunteer.touched.gender &&
                  formikVolunteer.errors.gender && (
                    <FormHelperText>
                      {formikVolunteer.errors.gender}
                    </FormHelperText>
                  )}
              </FormControl>
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="phone"
                name="phone"
                label="Phone"
                variant="outlined"
                value={formikVolunteer.values.phone}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.phone &&
                  Boolean(formikVolunteer.errors.phone)
                }
                helperText={
                  formikVolunteer.touched.phone && formikVolunteer.errors.phone
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Address"
                variant="outlined"
                value={formikVolunteer.values.address}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.address &&
                  Boolean(formikVolunteer.errors.address)
                }
                helperText={
                  formikVolunteer.touched.address &&
                  formikVolunteer.errors.address
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="DOB"
                  value={
                    formikVolunteer.values.dob
                      ? dayjs(formikVolunteer.values.dob)
                      : null
                  }
                  onChange={(newValue) => {
                    formikVolunteer.setFieldValue(
                      "dob",
                      newValue ? newValue.format("DD-MM-YYYY") : ""
                    );
                  }}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      id: "dob",
                      name: "dob",
                      onBlur: formikVolunteer.handleBlur,
                      error:
                        formikVolunteer.touched.dob &&
                        Boolean(formikVolunteer.errors.dob),
                      helperText:
                        formikVolunteer.touched.dob &&
                        formikVolunteer.errors.dob,
                    },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="cccd"
                name="cccd"
                label="CCCD"
                variant="outlined"
                value={formikVolunteer.values.cccd}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.cccd &&
                  Boolean(formikVolunteer.errors.cccd)
                }
                helperText={
                  formikVolunteer.touched.cccd && formikVolunteer.errors.cccd
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="experience"
                name="experience"
                label="Experience"
                variant="outlined"
                value={formikVolunteer.values.experience}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.experience &&
                  Boolean(formikVolunteer.errors.experience)
                }
                helperText={
                  formikVolunteer.touched.experience &&
                  formikVolunteer.errors.experience
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="currentJob"
                name="currentJob"
                label="Current Job"
                variant="outlined"
                value={formikVolunteer.values.currentJob}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.currentJob &&
                  Boolean(formikVolunteer.errors.currentJob)
                }
                helperText={
                  formikVolunteer.touched.currentJob &&
                  formikVolunteer.errors.currentJob
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="reason"
                name="reason"
                label="Reason"
                variant="outlined"
                value={formikVolunteer.values.reason}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.reason &&
                  Boolean(formikVolunteer.errors.reason)
                }
                helperText={
                  formikVolunteer.touched.reason &&
                  formikVolunteer.errors.reason
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                variant="outlined"
                value={formikVolunteer.values.email}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.email &&
                  Boolean(formikVolunteer.errors.email)
                }
                helperText={
                  formikVolunteer.touched.email && formikVolunteer.errors.email
                }
              />
            </div>

            <div style={{ marginTop: "16px" }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                value={formikVolunteer.values.password}
                onChange={formikVolunteer.handleChange}
                onBlur={formikVolunteer.handleBlur}
                error={
                  formikVolunteer.touched.password &&
                  Boolean(formikVolunteer.errors.password)
                }
                helperText={
                  formikVolunteer.touched.password &&
                  formikVolunteer.errors.password
                }
              />
            </div>

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Đăng ký
            </Button>
          </form>
        )}

        <div className="register">
          Bạn đã có tài khoản?{" "}
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate("/login")}
          >
            Đăng nhập ngay
          </Button>
          <Button
            color="primary"
            variant="text"
            onClick={() =>
              registerType === "volunteer"
                ? setRegisterType("user")
                : setRegisterType("volunteer")
            }
          >
            {registerType !== "volunteer"
              ? "Đăng ký tình nguyện viên"
              : "Đăng ký tình thành viên"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
