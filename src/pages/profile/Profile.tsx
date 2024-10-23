import React, { useEffect, useState } from "react";
import { Avatar, Button, TextField } from "@mui/material";
import { useFormik } from "formik";

import { useStore } from "../../store";
import Header from "../../components/header/Header";

import "./Profile.scss";
import { UserProfile } from "../../store/profile";

const Profile: React.FC = () => {
  const fetchProfile = useStore((store) => store.fetchProfile);
  const profile = useStore((store) => store.profile.userProfile);

  const formik = useFormik<UserProfile>({
    initialValues: {
      email: "",
      fullName: "",
      phone: "",
      address: "",
      username: "",
    },
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      formik.setValues(profile);
    }
  }, [profile]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files;
      formik.setFieldValue("avatar", file);
    }
  };

  return (
    <>
      <Header />

      <div className="profile-page">
        <div className="profile-container">
          <h1>Thông tin tài khoản</h1>

          <form
            onSubmit={formik.handleSubmit}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <div className="avatar-wrap">
              <Avatar>{formik.values.fullName.slice(0, 1)}</Avatar>
            </div>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="fullName"
              name="fullName"
              label="Họ và tên"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.fullName && Boolean(formik.errors.fullName)}
              helperText={formik.touched.fullName && formik.errors.fullName}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Số điện thoại"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="address"
              name="address"
              label="Địa chỉ"
              value={formik.values.address}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
              style={{ marginBottom: "16px" }}
            />

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Chỉnh sửa
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;
