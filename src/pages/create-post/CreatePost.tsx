import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import AddIcon from "@mui/icons-material/Add";

import Header from "../../components/header/Header";

import "./CreatePost.scss";

interface ICategory {
  id: number;
  name: string;
  value: string;
}

interface IPostForm {
  category: string;
  age: number;
  title: string;
  description: string;
  location: string;
  type: string;
  images: File[];
}

const CreatePost: React.FC = () => {
  const [categories, setCategories] = useState<ICategory[]>([
    {
      id: 1,
      name: "Chó",
      value: "dog",
    },
    {
      id: 2,
      name: "Mèo",
      value: "cat",
    },
    {
      id: 3,
      name: "Khác",
      value: "other",
    },
  ]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const formik = useFormik<IPostForm>({
    initialValues: {
      category: "",
      age: 0,
      title: "",
      description: "",
      location: "",
      type: "buy",
      images: [],
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      age: Yup.number()
        .min(0, "Age must be positive")
        .required("Age is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      location: Yup.string().required("Location is required"),
      type: Yup.string().required("Please select an option"),
      image: Yup.mixed().nullable(),
    }),
    onSubmit: (values) => {
      console.log("Form values:", values);
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]); // Add new images to the existing ones
      formik.setFieldValue("images", [...formik.values.images, ...filesArray]);
    }
  };

  const renderImagePreviews = () => {
    return selectedImages.map((image, index) => {
      const objectUrl = URL.createObjectURL(image);
      return (
        <div className="gallery-item" key={index}>
          <img src={objectUrl} alt={`Preview ${index}`} />
        </div>
      );
    });
  };

  return (
    <>
      <Header />

      <div className="create-post-page">
        <div className="create-post-container">
          <h1>Tạo Bài Đăng</h1>

          <form
            onSubmit={formik.handleSubmit}
            style={{ maxWidth: "600px", margin: "0 auto" }}
          >
            <FormControl
              fullWidth
              component="fieldset"
              style={{ marginBottom: "16px" }}
            >
              <RadioGroup
                id="type"
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                style={{ display: "flex", gap: "1rem", flexDirection: "row" }}
              >
                <FormControlLabel
                  value="buy"
                  control={<Radio />}
                  label="Muốn nhận"
                />
                <FormControlLabel
                  value="sell"
                  control={<Radio />}
                  label="Muốn cho"
                />
              </RadioGroup>
            </FormControl>

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel>Loại thú cưng</InputLabel>
              <Select
                id="category"
                name="category"
                label="Loại thú cưng"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.value}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="age"
              name="age"
              label="Độ tuổi"
              type="number"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.age && Boolean(formik.errors.age)}
              helperText={formik.touched.age && formik.errors.age}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="title"
              name="title"
              label="Tiêu đề tin đăng"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              style={{ marginBottom: "16px" }}
            />

            <TextField
              fullWidth
              id="description"
              name="description"
              label="Mô tả chi tiết"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
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

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <FormLabel component="legend" style={{ marginBottom: "8px" }}>
                Hình ảnh
              </FormLabel>
              <div className="gallery-photo">
                {selectedImages.length > 0 && renderImagePreviews()}
                <div className="upload-image">
                  <Button variant="text" component="label">
                    <AddIcon fontSize="large" />
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      multiple
                      onChange={handleImageChange}
                    />
                  </Button>
                </div>
              </div>
            </FormControl>

            <Button
              color="primary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
            >
              Đăng tin
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreatePost;
