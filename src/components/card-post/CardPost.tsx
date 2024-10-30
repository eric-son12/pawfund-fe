import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Button, Chip } from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";

import { useStore } from "../../store";

import "./CardPost.scss";

export interface Post {
  id: number;
  title: string;
  petName: string;
  petType: string;
  age: number;
  address: string;
  fullName: string;
  type: string;
  image: string;
  star: null;
  review: number;
  status: number;
  profileImage: null;
}

interface Profile {
  avatar: string;
  name: string;
  rate: string;
  count: string;
}

interface CardPostProps {
  post: Post;
  isOwner?: boolean;
}

const CardPost: React.FC<CardPostProps> = (props: CardPostProps) => {
  const navigate = useNavigate();

  const deletePost = useStore((store) => store.deletePost);

  return (
    <div
      className="card-post"
      onClick={() => !props.isOwner && navigate(`/detail/${props.post.id}`)}
    >
      <img
        className="pet-thumb"
        src={
          props.post.image ||
          "https://cdn.chotot.com/Kj8oW7j_tDIJF8DTl9Mgwqb1SQUzDEKsWqtTimPEneI/preset:listing/plain/1154e7905a289321edccb404da17f847-2814930790607607946.jpg"
        }
        onError={(e) =>
          (e.currentTarget.src =
            "https://cdn.chotot.com/Kj8oW7j_tDIJF8DTl9Mgwqb1SQUzDEKsWqtTimPEneI/preset:listing/plain/1154e7905a289321edccb404da17f847-2814930790607607946.jpg")
        }
        alt="pet-thumb"
      />

      <div className="content">
        <div className="pet-detail-wrap">
          <p className="pet-name">{props.post.petName}</p>
          <p className="pet-info">{`${props.post.petType} ${props.post.age} tháng tuổi`}</p>
          <p className="pet-location">{props.post.address}</p>
        </div>

        {!props.isOwner && (
          <div className="profile-wrap">
            <div className="profile-detail">
              {props.post.profileImage ? (
                <img
                  className="profile-thumb"
                  src={props.post.profileImage || "https://i.pravatar.cc/100"}
                  alt="profile-thumb"
                />
              ) : (
                <Avatar>{props.post.fullName.slice(0, 1)}</Avatar>
              )}
              <div>
                <p className="profile-name">{props.post.fullName}</p>
                <div className="rating">
                  <div className="score">
                    {props.post.star || "N/a"}{" "}
                    <img width={12} src="icons/ico-rating.svg" alt="" />
                  </div>
                  <span>{props.post.review} đánh giá</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="action-wrap">
        <Chip
          label={props.post.type != "1" ? "Muốn nhận" : "Muốn cho"}
          variant="outlined"
          size="small"
          color={props.post.type != "1" ? "primary" : "secondary"}
        />

        {props.isOwner ? (
          <div>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(`/edit-post/${props.post.id}`)}
              style={{ marginRight: "10px" }}
            >
              Chỉnh sửa
            </Button>
            <Button
              color="error"
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={() => deletePost(props.post.id)}
            >
              Xóa bài
            </Button>
          </div>
        ) : (
          <Button variant="contained" startIcon={<PhoneOutlinedIcon />}>
            Liên hệ
          </Button>
        )}
      </div>
    </div>
  );
};

export default CardPost;
