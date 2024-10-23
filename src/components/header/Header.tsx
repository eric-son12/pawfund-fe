import React, { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useStore } from "../../store";

import "./Header.scss";

const Header: React.FC = () => {
  const token = localStorage.getItem("token");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorEl);

  const navigate = useNavigate();
  const logout = useStore((store) => store.logout);

  const handleOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

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
        <Button
          variant="outlined"
          className="user-btn"
          startIcon={<PersonIcon />}
          id="basic-button"
          aria-controls={openMenu ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={openMenu ? "true" : undefined}
          onClick={handleOpenMenu}
        />
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openMenu}
          onClose={handleCloseMenu}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {token ? (
            <div>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleCloseMenu();
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </MenuItem>
            </div>
          ) : (
            <MenuItem
              onClick={() => {
                handleCloseMenu();
                navigate("/login");
              }}
            >
              Login
            </MenuItem>
          )}
        </Menu>
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
