import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TextField, Button, FormControl, FormLabel } from "@mui/material";
import { Field, Form, Formik } from "formik";
import AddIcon from "@mui/icons-material/Add";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import { PostDetail } from "../detail/Detail";

import "./EditPost.scss";

const EditPost = () => {
  const { slug } = useParams();

  const [post, setPost] = useState<PostDetail>();
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const postDetail = useStore((store) => store.postDetailFetch);
  const updatePost = useStore((store) => store.updatePost);
  const addNotification = useStore((store) => store.addNotification);

  useEffect(() => {
    const getPostDetail = async () => {
      const data = await postDetail(Number(slug));
      setPost(data);
      setSelectedImages(data?.images || []);
    };

    getPostDetail();
  }, [slug]);

  const handleFormSubmit = async (values: any) => {
    values.images = selectedImages;
    updatePost(values);
  };

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

      <div className="edit-post-page">
        <div className="edit-post-container">
          <h1>Sửa Bài Đăng</h1>

          {post ? (
            <Formik
              initialValues={{
                adoptId: post.id,
                type: post.type,
                title: post.title,
                petName: post.petName,
                description: post.description,
                petTypeId: post.petType,
                address: post.address,
                age: post.age,
                images: post.images,
              }}
              onSubmit={handleFormSubmit}
            >
              {({ values, handleChange }) => (
                <>
                  <Form style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <Field
                      name="title"
                      label="Tiêu đề tin đăng"
                      as={TextField}
                      fullWidth
                      margin="normal"
                      value={values.title}
                      onChange={handleChange}
                    />
                    <Field
                      name="petName"
                      label="Name"
                      as={TextField}
                      fullWidth
                      margin="normal"
                      value={values.petName}
                      onChange={handleChange}
                    />
                    <Field
                      name="description"
                      label="Mô tả chi tiết"
                      as={TextField}
                      fullWidth
                      multiline
                      rows={4}
                      margin="normal"
                      value={values.description}
                      onChange={handleChange}
                    />
                    <Field
                      name="address"
                      label="Địa chỉ"
                      as={TextField}
                      fullWidth
                      margin="normal"
                      value={values.address}
                      onChange={handleChange}
                    />
                    {/* <Field
                      name="petTypeId"
                      label="Loại thú cưng"
                      as={TextField}
                      fullWidth
                      margin="normal"
                      value={values.petTypeId}
                      onChange={handleChange}
                    /> */}
                    <Field
                      name="age"
                      label="Tuổi"
                      as={TextField}
                      fullWidth
                      margin="normal"
                      value={values.age}
                      onChange={handleChange}
                    />

                    <FormControl fullWidth style={{ marginBottom: "16px" }}>
                      <FormLabel
                        component="legend"
                        style={{ marginBottom: "8px" }}
                      >
                        Hình ảnh
                      </FormLabel>
                      <div className="gallery-photo">
                        {selectedImages &&
                          selectedImages.length > 0 &&
                          renderImagePreviews()}
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
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      style={{ marginTop: "16px" }}
                    >
                      Update Post
                    </Button>
                  </Form>
                </>
              )}
            </Formik>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </div>
    </>
  );
};

export default EditPost;
