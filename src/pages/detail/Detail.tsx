import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import { Button, Chip, IconButton } from "@mui/material";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import { Post } from "../../components/card-post/CardPost";

import "./Detail.scss";

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const postDetail = useStore((store) => store.postDetailFetch);

  const [post, setPost] = useState<Post>();

  useEffect(() => {
    const getPostDetail = async () => {
      const data = await postDetail(Number(slug));
      setPost(data);
      console.log(data);
    };

    getPostDetail();
  }, [slug]);

  const images = Array(5)
    .fill(0)
    .map((_, i) => ({
      id: i + 1,
      src: `https://picsum.photos/id/${i + 1}/500/300`,
    }));

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Header />

      <div className="detail-page">
        <div className="detail-container">
          <div className="left-side-wrap">
            <div className="preview-image">
              <Slider {...settings}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image.src}
                      alt={`Image ${index}`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                ))}
              </Slider>
            </div>
            <Chip
              label={post?.type === "buy" ? "Muốn nhận" : "Muốn cho"}
              variant="outlined"
              size="small"
              color={post?.type === "buy" ? "primary" : "secondary"}
              style={{ marginBottom: "16px" }}
            ></Chip>
            <p className="title">{post?.name}</p>
            <p className="description">{post?.info}</p>
            <div className="pet-info">
              <p>
                <span>
                  <IconButton>
                    <PetsOutlinedIcon />
                  </IconButton>{" "}
                  Giống thú cưng:
                </span>{" "}
                {post?.category}
              </p>
              <p>
                <span>
                  <IconButton>
                    <CakeOutlinedIcon />
                  </IconButton>{" "}
                  Độ tuổi:
                </span>{" "}
                {post?.age}
              </p>
            </div>
            <p className="location">
              <span>
                <IconButton>
                  <LocationOnOutlinedIcon />
                </IconButton>{" "}
                Địa chỉ:
              </span>{" "}
              {post?.location}
            </p>
          </div>

          <div className="right-side-wrap">
            <div className="profile">
              <img
                className="avatar"
                width={32}
                src={post?.profile.avatar}
                alt=""
              />
              <div className="profile-info">
                <p className="name">{post?.profile.name}</p>
                <p className="rating">
                  <img width={14} src="/icons/ico-rating.svg" alt="" />
                  <span className="score"> {post?.profile.rate}</span> (
                  {post?.profile.count} đánh giá)
                </p>
              </div>
            </div>

            <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<ContactPageOutlinedIcon />}
            >
              Xem thông tin
            </Button>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              startIcon={<PhoneOutlinedIcon />}
            >
              Liên hệ
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Detail;
