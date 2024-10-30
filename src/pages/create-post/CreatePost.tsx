import React, { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
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
import { useStore } from "../../store";
import { CreatePostReceiveRequest, CreatePostRequest } from "../../store/post";

import Header from "../../components/header/Header";

import "./CreatePost.scss";
import { PROVINCES } from "../home/Home";

interface IPostForm {
  petTypeId: number;
  category: string;
  name: string;
  age: number;
  title: string;
  description: string;
  location: string;
  type: string;
  images: File[];
  houseType: string;
  houseOwner: boolean;
  isAllergic: boolean;
  experience: string;
  reason: string;
}

const CreatePost: React.FC = () => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const categories = useStore((store) => store.post.petType);
  const fetchPetType = useStore((store) => store.fetchPetType);
  const createPost = useStore((store) => store.createPost);
  const createPostReceive = useStore((store) => store.createPostReceive);
  const addNotification = useStore((store) => store.addNotification);

  useEffect(() => {
    setSelectedImages([]);
    fetchPetType();
  }, []);

  const formik = useFormik<IPostForm>({
    initialValues: {
      petTypeId: 0,
      category: "",
      name: "",
      age: 0,
      title: "",
      description: "",
      location: "",
      type: "give",
      images: [],
      houseType: "",
      experience: "",
      reason: "",
      houseOwner: false,
      isAllergic: false,
    },
    validationSchema: Yup.object({
      category: Yup.string().required("Category is required"),
      name: Yup.string().required("Name is required"),
      age: Yup.number()
        .min(0, "Age must be positive")
        .required("Age is required"),
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      location: Yup.string().required("Location is required"),
      type: Yup.string().required("Please select an option"),
      image: Yup.mixed().nullable(),
    }),
    onSubmit: async (values) => {
      console.log("Form values:", values);
      const createPostBody: CreatePostRequest = {
        age: values.age.toString(),
        title: values.title,
        description: values.description,
        address: values.location,
        breed: values.category,
        imageUrl: selectedImages,
        name: values.name,
        petTypeId: categories.find((c) => c.name == values.category)?.id || 1,
      };
      const createPostReceiveBody: CreatePostReceiveRequest = {
        age: values.age.toString(),
        title: values.title,
        description: values.description,
        address: values.location,
        breed: values.category,
        imageUrl: selectedImages,
        name: values.name,
        experience: values.experience,
        houseType: values.houseType,
        reason: values.reason,
        houseOwner: values.houseOwner ? 1 : 0,
        isAllergic: values.isAllergic ? 1 : 0,
      };
      values.type === "give"
        ? await createPost(createPostBody)
        : await createPostReceive(createPostReceiveBody);
      formik.resetForm();
      setSelectedImages([]);
    },
  });

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const uploadImages = async (filesArray: any) => {
        const formData = new FormData();
        formData.append("file", filesArray);
        formData.append("upload_preset", "blnhfbwk");

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dzclrmcf5/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          return data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return null;
        }
      };

      const uploadPromises = filesArray.map((file: any) => uploadImages(file));
      const urls = await Promise.all(uploadPromises);

      setSelectedImages([...selectedImages, ...urls]);
      formik.setFieldValue("images", [...formik.values.images, ...urls]);
    }
  };

  const renderImagePreviews = () => {
    return selectedImages.map((src, index) => {
      return (
        <div className="gallery-item" key={index}>
          <img src={src} alt={`Preview ${index}`} />
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
                  value="give"
                  control={<Radio />}
                  label="Muốn cho"
                />
                <FormControlLabel
                  value="receive"
                  control={<Radio />}
                  label="Muốn nhận"
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
                  <MenuItem key={category.id} value={category.name}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              id="name"
              name="name"
              label="Tên thú cưng"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              style={{ marginBottom: "16px" }}
            />

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

            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel>Khu vực</InputLabel>
              <Select
                id="location"
                name="location"
                label="Khu vực"
                value={formik.values.location}
                onChange={formik.handleChange}
                error={
                  formik.touched.location && Boolean(formik.errors.location)
                }
              >
                {PROVINCES.map((location, index) => (
                  <MenuItem key={index} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <TextField
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
            /> */}

            {formik.values.type !== "give" && (
              <>
                <TextField
                  fullWidth
                  id="houseType"
                  name="houseType"
                  label="Chỗ nuôi"
                  value={formik.values.houseType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.houseType && Boolean(formik.errors.houseType)
                  }
                  helperText={
                    formik.touched.houseType && formik.errors.houseType
                  }
                  style={{ marginBottom: "16px" }}
                />

                <TextField
                  fullWidth
                  id="experience"
                  name="experience"
                  label="Kinh nghiệm"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.experience &&
                    Boolean(formik.errors.experience)
                  }
                  helperText={
                    formik.touched.experience && formik.errors.experience
                  }
                  style={{ marginBottom: "16px" }}
                />

                <TextField
                  fullWidth
                  id="reason"
                  name="reason"
                  label="Lý do"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.reason && Boolean(formik.errors.reason)}
                  helperText={formik.touched.reason && formik.errors.reason}
                  style={{ marginBottom: "16px" }}
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="houseOwner"
                      checked={formik.values.houseOwner}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Có nhà"
                />

                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAllergic"
                      checked={formik.values.isAllergic}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Bị dị ứng"
                />
              </>
            )}

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
              onClick={() => console.log("FORM", formik.values)}
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
