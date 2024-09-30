import React, { useState } from "react";
import {
  Avatar,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../components/header/Header";

import "./Profile.scss";

interface IProfileForm {
  firstName: string;
  lastName: string;
  fullName: string;
  dob: string;
  phone: string;
  location: string;
  avatar: string;
}

const Profile: React.FC = () => {
  const formik = useFormik<IProfileForm>({
    initialValues: {
      firstName: "Eric",
      lastName: "Son",
      fullName: "Eric Son",
      dob: "12/03/2002",
      phone: "123456789",
      location: "HCM • Phú Nhuận",
      avatar: "https://i.pravatar.cc/500",
    },
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

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
              {formik.values.avatar ? (
                <Avatar
                  alt={formik.values.firstName}
                  src={formik.values.avatar}
                ></Avatar>
              ) : (
                <Avatar>{formik.values.firstName}</Avatar>
              )}
            </div>
            <TextField
              fullWidth
              id="firstName"
              name="firstName"
              label="Họ"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="lastName"
              name="lastName"
              label="Tên"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
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
              id="location"
              name="location"
              label="Địa chỉ"
              value={formik.values.location}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
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
