import React, { useEffect, useState } from "react";
import { Alert, Snackbar } from "@mui/material";

import { useStore } from "../../store";
import { Notification } from "../../store/notification";

import "./NotificationItem.scss";

const NotificationItem: React.FC = () => {
  const notification = useStore((state) => state.notification.data);
  const [item, setItem] = useState<Notification>();
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (notification.length > 0) {
      const lastItem = notification[notification.length - 1];
      setItem(lastItem);
      setOpen(true);
    }
  }, [notification]);

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={5000}
      onClose={() => setOpen(false)}
    >
      {item?.status === "ERROR" ? (
        <Alert severity="error">{item?.content}</Alert>
      ) : (
        <Alert severity="success">{item?.content}</Alert>
      )}
    </Snackbar>
  );
};

export default NotificationItem;
