import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import AddIcon from "@mui/icons-material/Add";

import { Post } from "../../components/card-post/CardPost";
import Header from "../../components/header/Header";

import "./EditPost.scss";

const EditPost = () => {
  const { slug } = useParams(); // Get the slug from the URL
  const [post, setPost] = useState<Post>({
    id: 1,
    type: "buy",
    name: "Mèo Anh lông ngắn cần tìm nhà",
    info: "Bé mèo ALN tai cụp lửng, đực đã thiến, nặng gần 6kg. Bé rất rất hiền và ngoan, ăn ngủ suốt ngày. Đã tiêm phòng và sổ giun đều mỗi tháng. Bé cực kỳ sạch sẽ cá nhân. Không có thời gian nên nhượng lại giá cá mềm cho ba má mới, thích hợp cho người mới nuôi mèo vì ảnh rất ngoan và biết điều. Tặng bát ăn và thau cát lồng cũng 400k đó. Cảm ơn mọi người đã đọc tin.",
    location: "HCM • Q. Phú Nhuận",
    category: "Mèo",
    age: "Mèo 3 tháng tuổi",
    thumb:
      "https://cdn.chotot.com/LjqRnNVS69OH1D0a0YdqtCYahV5gUrvdt_fP4Y5BUwk/preset:listing/plain/3bf1661484d7a9213835a55c62931d19-2895056263804913859.jpg",
    profile: {
      avatar: "https://i.pravatar.cc/100",
      name: "Trang Nguyễn",
      rate: "4.6",
      count: "23",
    },
  });
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  //   useEffect(() => {
  //     // Fetch the post data by slug
  //     const fetchPost = async () => {
  //       try {
  //         const response = await axios.get(`/api/posts/${slug}`);
  //         setPost(response.data); // Set the fetched post data
  //       } catch (error) {
  //         console.error("Error fetching the post:", error);
  //       } finally {
  //         setLoading(false); // Stop loading once data is fetched
  //       }
  //     };

  //     fetchPost();
  //   }, [slug]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const handleFormSubmit = async (values: any) => {
    try {
      await axios.put(`/api/posts/${post.id}`, values); // Update the post via API
      alert("Post updated successfully!");
    } catch (error) {
      console.error("Error updating the post:", error);
      alert("Failed to update the post.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedImages((prevImages) => [...prevImages, ...filesArray]); // Add new images to the existing ones
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

      <div className="edit-post-page">
        <div className="edit-post-container">
          <h1>Sửa Bài Đăng</h1>

          <Formik
            initialValues={{
              title: post.name,
              description: post.info,
              category: post.category,
              location: post.location,
              age: post.age,
              type: post.type, // "buy" or "sell"
            }}
            onSubmit={handleFormSubmit}
          >
            {({ values, handleChange }) => (
              <Form style={{ maxWidth: "600px", margin: "0 auto" }}>
                <Field
                  name="title"
                  label="Title"
                  as={TextField}
                  fullWidth
                  margin="normal"
                  value={values.title}
                  onChange={handleChange}
                />
                <Field
                  name="description"
                  label="Description"
                  as={TextField}
                  fullWidth
                  multiline
                  rows={4}
                  margin="normal"
                  value={values.description}
                  onChange={handleChange}
                />
                <Field
                  name="category"
                  label="Category"
                  as={TextField}
                  fullWidth
                  margin="normal"
                  value={values.category}
                  onChange={handleChange}
                />
                <Field
                  name="location"
                  label="Location"
                  as={TextField}
                  fullWidth
                  margin="normal"
                  value={values.location}
                  onChange={handleChange}
                />
                <Field
                  name="age"
                  label="Age"
                  as={TextField}
                  fullWidth
                  margin="normal"
                  value={values.age}
                  onChange={handleChange}
                />

                {/* Radio buttons for type (buy/sell) */}
                <RadioGroup
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  row
                >
                  <FormControlLabel
                    value="buy"
                    control={<Radio />}
                    label="Buy"
                  />
                  <FormControlLabel
                    value="sell"
                    control={<Radio />}
                    label="Sell"
                  />
                </RadioGroup>

                <FormControl fullWidth style={{ marginBottom: "16px" }}>
                  <FormLabel component="legend" style={{ marginBottom: "8px" }}>
                    Hình ảnh
                  </FormLabel>
                  <div className="gallery-photo">
                    <div className="gallery-item" key={1111}>
                      <img src={post.thumb} alt={`Preview ${1111}`} />
                    </div>
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
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  style={{ marginTop: "16px" }}
                >
                  Update Post
                </Button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditPost;
