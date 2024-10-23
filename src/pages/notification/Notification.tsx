import React, { useEffect } from "react";
import { Button, IconButton } from "@mui/material";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";

import "./Notification.scss";

const Notification: React.FC = () => {
  const notifications = useStore((store) => store.notification.data);
  const clearNotification = useStore((store) => store.clearNotification);

  const handleClearNotification = () => {
    clearNotification();
  };

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
                  className={`notification-item ${notification.status.toLowerCase()}`}
                  key={index}
                >
                  <IconButton style={{ padding: 0 }}>
                    {notification.status.toLowerCase() === "success" ? (
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
                    <p className="title">{notification.status}</p>
                    <p className="desc">{notification.content}</p>
                  </div>
                </div>
              ))}
          </div>

          {notifications.length === 0 && (
            <div className="no-notification">
              <p>No notification</p>
            </div>
          )}

          {notifications.length > 0 && (
            <div className="action-wrap">
              <Button
                color="info"
                variant="outlined"
                onClick={handleClearNotification}
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Notification;
