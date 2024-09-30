import React, { useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./Notification.scss";

const Notification: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Thành công",
      desc: "Đăng nhập thành công",
    },
    {
      id: 2,
      type: "error",
      title: "Thất bại",
      desc: "Đăng bài thất bại",
    },
  ];

  return (
    <>
      <Header />

      <div className="notification-page">
        <div className="notification-container">
          <h1>Thông báo</h1>

          <div className="notifications-list">
            {notifications &&
              notifications.length > 0 &&
              notifications.map((notification, index) => (
                <div
                  className={`notification-item ${notification.type}`}
                  key={index}
                >
                  <IconButton style={{ padding: 0 }}>
                    {notification.type === "success" ? (
                      <CheckCircleOutlineOutlinedIcon
                        style={{ color: "white" }}
                        fontSize="large"
                      />
                    ) : (
                      <ErrorOutlineOutlinedIcon
                        style={{ color: "white" }}
                        fontSize="large"
                      />
                    )}
                  </IconButton>
                  <div>
                    <p className="title">{notification.title}</p>
                    <p className="desc">{notification.desc}</p>
                  </div>
                </div>
              ))}
          </div>

          <div className="action-wrap">
            <Button color="info" variant="outlined">Clear all</Button>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Notification;
