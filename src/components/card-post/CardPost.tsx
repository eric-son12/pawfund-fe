import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";

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

  const [openChangeStatus, setOpenChangeStatus] = useState(false);

  const fetchPosts = useStore((store) => store.postFetchByProfile);
  const deletePost = useStore((store) => store.deletePost);
  const updateStatusPost = useStore((store) => store.updatePostStatus);

  const handleClose = () => {
    setOpenChangeStatus(false);
  };

  return (
    <>
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
                <Avatar>{props.post.fullName.slice(0, 1)}</Avatar>
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
          <div>
            <Chip
              label={props.post.type != "1" ? "Muốn nhận" : "Muốn cho"}
              variant="outlined"
              size="small"
              color={props.post.type != "1" ? "primary" : "secondary"}
              style={{ marginRight: "10px" }}
            />
            {props.isOwner && (
              <Chip
                label={
                  props.post.status === 1
                    ? "Pending"
                    : props.post.status === 2
                    ? "Available"
                    : props.post.status === 3
                    ? "Review"
                    : props.post.status === 4
                    ? "Approved"
                    : "Rejected"
                }
                variant="outlined"
                size="small"
                color="info"
              />
            )}
          </div>

          {props.isOwner ? (
            <div>
              {props.post.status === 3 && (
                <Button
                  variant="contained"
                  startIcon={<AssignmentTurnedInIcon />}
                  onClick={() => setOpenChangeStatus(true)}
                  style={{ marginRight: "10px" }}
                >
                  Xem xét
                </Button>
              )}
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

      <Dialog open={openChangeStatus} onClose={handleClose}>
        <DialogTitle>Thay đổi trạng thái</DialogTitle>
        <DialogContent>
          <div className="change-status-content">
            <Button
              color="secondary"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
              onClick={async () => {
                await updateStatusPost(props.post.id, 2);
                await fetchPosts();
                handleClose();
              }}
            >
              Available
            </Button>
            <Button
              color="success"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
              onClick={async () => {
                await updateStatusPost(props.post.id, 4);
                await fetchPosts();
                handleClose();
              }}
            >
              Approve
            </Button>
            <Button
              color="error"
              variant="contained"
              fullWidth
              type="submit"
              style={{ marginTop: "16px" }}
              onClick={async () => {
                await updateStatusPost(props.post.id, 5);
                await fetchPosts();
                handleClose();
              }}
            >
              Reject
            </Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangeStatus(false)} color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardPost;
