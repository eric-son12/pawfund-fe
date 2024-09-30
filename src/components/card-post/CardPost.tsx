import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Chip } from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import "./CardPost.scss";

export interface Post {
  id: number;
  type: string;
  name: string;
  info: string;
  location: string;
  category: string;
  age: string;
  thumb: string;
  profile: Profile;
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

  return (
    <div
      className="card-post"
      onClick={() => !props.isOwner && navigate(`/detail/${props.post.id}`)}
    >
      <img className="pet-thumb" src={props.post.thumb} alt="pet-thumb" />

      <div className="content">
        <div className="pet-detail-wrap">
          <p className="pet-name">{props.post.name}</p>
          <p className="pet-info">{props.post.age}</p>
          <p className="pet-location">{props.post.location}</p>
        </div>

        {!props.isOwner && (
          <div className="profile-wrap">
            <div className="profile-detail">
              <img
                className="profile-thumb"
                src={props.post.profile.avatar}
                alt="profile-thumb"
              />
              <div>
                <p className="profile-name">{props.post.profile.name}</p>
                <div className="rating">
                  <div className="score">
                    {props.post.profile.rate}{" "}
                    <img width={12} src="icons/ico-rating.svg" alt="" />
                  </div>
                  <span>{props.post.profile.count} đánh giá</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="action-wrap">
        <Chip
          label={props.post.type === "buy" ? "Muốn nhận" : "Muốn cho"}
          variant="outlined"
          size="small"
          color={props.post.type === "buy" ? "primary" : "secondary"}
        />

        {props.isOwner ? (
          <Button
            variant="contained"
            startIcon={<EditOutlinedIcon />}
            onClick={() => navigate(`/edit-post/${props.post.id}`)}
          >
            Chỉnh sửa
          </Button>
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
