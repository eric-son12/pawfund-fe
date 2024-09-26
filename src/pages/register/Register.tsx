import React from "react";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import "./Register.scss";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
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
      console.log("Sign-up form values:", values);
    },
  });

  return (
    <div className="login-page">
      <img className="bg-login" src="login-background.avif" alt="bg-login" />
      <div className="login-container">
        <img
          className="logo"
          src="/logo.svg"
          alt="logo"
          onClick={() => navigate("/")}
        />
        <h4 className="title">Đăng ký</h4>

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
              error={formik.touched.password && Boolean(formik.errors.password)}
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
                formik.touched.confirmPassword && formik.errors.confirmPassword
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

        <div className="register">
          Bạn đã có tài khoản?{" "}
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate("/login")}
          >
            Đăng nhập ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Register;
