import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Slider from "react-slick";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PetsOutlinedIcon from "@mui/icons-material/PetsOutlined";
import CakeOutlinedIcon from "@mui/icons-material/CakeOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ContactPageOutlinedIcon from "@mui/icons-material/ContactPageOutlined";
import SendIcon from "@mui/icons-material/Send";
import { Avatar, Button, Chip, IconButton } from "@mui/material";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./Detail.scss";

export interface PostDetail {
  id: number;
  title: string;
  petName: string;
  petType: string;
  age: number;
  address: string;
  fullName: string;
  description: string;
  profileImage: string | null;
  type: string;
  images: string[];
  application: any | null;
  phone?: string;
}

const Detail: React.FC = () => {
  const navigate = useNavigate();
  const { slug } = useParams();

  const [post, setPost] = useState<PostDetail>();

  const profile = useStore((store) => store.profile.userProfile);
  const categories = useStore((store) => store.post.petType);
  const fetchPetType = useStore((store) => store.fetchPetType);
  const postDetail = useStore((store) => store.postDetailFetch);
  const addNotification = useStore((store) => store.addNotification);

  const isAuthenticated = !!localStorage.getItem("token");

  useEffect(() => {
    const getPostDetail = async () => {
      const data = await postDetail(Number(slug));
      setPost(data);
    };

    fetchPetType();
    getPostDetail();
  }, [slug]);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const handleRequest = async () => {
    const token =
      "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyZWdpc3RlcjMwMTB2QGdtYWlsLmNvbSIsImlhdCI6MTczMDI3NDIzNywiZXhwIjoxNzMwODc5MDM3fQ.IRnHgazY-UWF0061jfA1eO1Vka_Gj3zAjjDoiC5qBdk";
    const url = `https://spacesport.pro/api/adopt/changeStatus`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        adoptId: post?.id,
        status: 3,
      }),
    });

    const data = await response.json();
    if (data)
      addNotification({ status: "SUCCESS", content: "Yêu cầu đã được gửi" });
  };

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
                  <div>
                    <img
                      src={"/bg-detail-default.jpg"}
                      alt={`Image`}
                      style={{ width: "100%", height: "auto" }}
                    />
                  </div>
                </Slider>
              </div>
            )}
            <Chip
              label={post?.type != "1" ? "Muốn nhận" : "Muốn cho"}
              variant="outlined"
              size="small"
              color={post?.type != "1" ? "primary" : "secondary"}
              style={{ marginBottom: "16px" }}
            ></Chip>
            <p className="title">{post?.title}</p>
            <p className="description">{post?.description}</p>
            {post?.application != null && (
              <>
                <p className="description">
                  <i>Kinh nghiệm:</i> {post?.application?.experience}
                </p>
                <p className="description">
                  <i>Lý do muốn xin:</i> {post?.application?.reason}
                </p>
                <p className="description">
                  <i>Chỗ nuôi:</i>{" "}
                  {!!post?.application?.homeOwner ? "Có" : "Không"}
                </p>
                <p className="description">
                  <i>Nuôi ở:</i> {post?.application?.houseType}
                </p>
                <p className="description">
                  <i>Dị ứng:</i>{" "}
                  {!!post?.application?.isAllregic ? "Có" : "Không"}
                </p>
              </>
            )}
            <div className="pet-info">
              <p>
                <span>
                  <IconButton>
                    <PetsOutlinedIcon />
                  </IconButton>{" "}
                  Giống thú cưng:
                </span>{" "}
                {categories.find((item: any) => item.id == post?.petType)
                  ?.name ?? "Pet"}
              </p>
              <p>
                <span>
                  <IconButton>
                    <PetsOutlinedIcon />
                  </IconButton>{" "}
                  Tên:
                </span>{" "}
                {post?.petName}
              </p>
            </div>
            <div className="pet-info">
              <p>
                <span>
                  <IconButton>
                    <CakeOutlinedIcon />
                  </IconButton>{" "}
                  Độ tuổi:
                </span>{" "}
                {post?.age} tháng
              </p>
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
          </div>

          <div className="right-side-wrap">
            <div className="profile">
              <Avatar>{post?.fullName.slice(0, 1)}</Avatar>
              <div className="profile-info">
                <p className="name">{post?.fullName}</p>
                <p className="rating">{post?.phone || "0909357281"}</p>
              </div>
            </div>

            {/* <Button
              fullWidth
              variant="outlined"
              color="primary"
              startIcon={<ContactPageOutlinedIcon />}
            >
              Xem thông tin
            </Button> */}
            {isAuthenticated && post?.fullName !== profile?.fullName && (
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SendIcon />}
                onClick={handleRequest}
              >
                Gửi yêu cầu
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Detail;
