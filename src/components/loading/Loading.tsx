import React from "react";

import "./Loading.scss";
import { Backdrop, CircularProgress } from "@mui/material";
import { useStore } from "../../store";

const Loading: React.FC = () => {
  const isLoading = useStore((state) => state.loading.isLoading);

  return (
    <Backdrop
      sx={(theme) => ({ color: "#00925d", zIndex: theme.zIndex.drawer + 1 })}
      open={isLoading}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
