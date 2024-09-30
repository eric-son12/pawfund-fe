import React from "react";
import { Button, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

import "./Header.scss";

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <nav className="header">
      <div className="branch-wrap" onClick={() => navigate("/")}>
        <img src="/logo.svg" alt="" />
        <h4>PawFund</h4>
      </div>

      <div className="searchbar-wrap">
        <TextField
          color="info"
          size="small"
          style={{ color: "white", fontSize: "14px" }}
          placeholder="Tìm kiếm bài viết..."
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </div>

      <div className="action-group-wrap">
        <IconButton
          style={{ color: "white", marginRight: "8px" }}
          onClick={() => navigate("/notification")}
        >
          <NotificationsNoneOutlinedIcon />
        </IconButton>
        <IconButton
          style={{ color: "white", marginRight: "8px" }}
          onClick={() => navigate("/listing")}
        >
          <ArticleOutlinedIcon />
        </IconButton>
        <IconButton
          style={{ color: "white", marginRight: "8px" }}
          onClick={() => navigate("/profile")}
        >
          <PersonIcon />
        </IconButton>
        <Button
          style={{ background: "#222222" }}
          color="primary"
          variant="contained"
          startIcon={<DriveFileRenameOutlineOutlinedIcon />}
          onClick={() => navigate("/create-post")}
        >
          Đăng tin
        </Button>
      </div>
    </nav>
  );
};

export default Header;
