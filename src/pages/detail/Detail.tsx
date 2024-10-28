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

export interface PostDetail {
  id: number;
  title: string;
  petName: string;
  petType: string;
  age: number;
  address: string;
  fullName: string;
  profileImage: string | null;
  type: string;
  images: string[];
  application: number | null;
}

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const postDetail = useStore((store) => store.postDetailFetch);

  const [post, setPost] = useState<PostDetail>();

  useEffect(() => {
    const getPostDetail = async () => {
      const data = await postDetail(Number(slug));
      setPost(data);
    };

    getPostDetail();
  }, [slug]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  console.log("post?.images", post?.images);

  return (
    <>
      <Header />

      <div className="detail-page">
        <div className="detail-container">
          <div className="left-side-wrap">
            {post?.images && post.images.length > 0 && (
              <div className="preview-image">
                <Slider {...settings}>
                  {post.images.map((image, index) => (
                    <div key={index}>
                      <img
                        src={image}
                        alt={`Image ${index}`}
                        style={{ width: "100%", height: "auto" }}
                      />
                    </div>
                  ))}
                </Slider>
              </div>
            )}
            <Chip
              label={post?.type === "buy" ? "Muốn nhận" : "Muốn cho"}
              variant="outlined"
              size="small"
              color={post?.type === "buy" ? "primary" : "secondary"}
              style={{ marginBottom: "16px" }}
            ></Chip>
            <p className="title">{post?.title}</p>
            <p className="description">{post?.petName}</p>
            <div className="pet-info">
              <p>
                <span>
                  <IconButton>
                    <PetsOutlinedIcon />
                  </IconButton>{" "}
                  Giống thú cưng:
                </span>{" "}
                {post?.petType}
              </p>
              <p>
                <span>
                  <IconButton>
                    <CakeOutlinedIcon />
                  </IconButton>{" "}
                  Độ tuổi:
                </span>{" "}
                {post?.age} tháng
              </p>
            </div>
            <p className="location">
              <span>
                <IconButton>
                  <LocationOnOutlinedIcon />
                </IconButton>{" "}
                Địa chỉ:
              </span>{" "}
              {post?.address}
            </p>
          </div>

          <div className="right-side-wrap">
            <div className="profile">
              <img
                className="avatar"
                width={32}
                src={post?.profileImage || "https://i.pravatar.cc/100"}
                alt="avatar"
              />
              <div className="profile-info">
                <p className="name">{post?.fullName}</p>
                <p className="rating">
                  <img width={14} src="/icons/ico-rating.svg" alt="" />
                  <span className="score"> 3.4</span> ( 12 đánh giá)
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
              Gửi yêu cầu
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Detail;
