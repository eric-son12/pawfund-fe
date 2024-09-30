import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import "./Login.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
    }),
    onSubmit: (values) => {
      const { email, password } = values;
      if (email === "admin@gmail.com" && password === "admin123") {
        navigate("/admin/dashboard");
      }
      // alert(JSON.stringify(values, null, 2));
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
        <h4 className="title">Đăng nhập</h4>

        <form onSubmit={formik.handleSubmit}>
          <div>
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

          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            style={{ marginTop: "16px" }}
          >
            Đăng nhập
          </Button>
        </form>

        <div className="register">
          Chưa có tài khoản?{" "}
          <Button
            color="primary"
            variant="text"
            onClick={() => navigate("/register")}
          >
            Đăng ký tài khoản mới
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
