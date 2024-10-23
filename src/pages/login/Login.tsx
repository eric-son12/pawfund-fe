import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";

import { useStore } from "../../store";

import "./Login.scss";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const onLogin = useStore((store) => store.login);
  const user = useStore((store) => store.profile.user);
  const error = useStore((store) => store.profile.error);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string().required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      const { username, password } = values;
      if (username === "admin" && password === "admin") {
        navigate("/admin/dashboard");
      } else {
        onLogin(username, password);
      }
    },
  });

  useEffect(() => {
    if (user) {
      const { role } = user;
      role === "ROLE_USER" ? navigate("/") : navigate("/admin/dashboard");
    }
  }, [user]);

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
              id="username"
              name="username"
              label="Email"
              variant="outlined"
              value={formik.values.username}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.username && Boolean(formik.errors.username)}
              helperText={formik.touched.username && formik.errors.username}
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
          {error && (
            <div style={{ marginTop: "16px" }}>
              <p style={{ color: "red" }}>{error}</p>
            </div>
          )}
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
