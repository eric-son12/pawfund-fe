import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { useStore } from "../../store";

import "./CardDonate.scss";

export const StatusLabel: React.FC<{ status: number }> = ({ status }) => {
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Đang diễn ra", color: "#FFA500" };
      case 2:
        return { label: "Hoàn thành", color: "#4CAF50" };
      case 3:
        return { label: "Chưa hoàn thành", color: "#FF6347" };
      case 4:
        return { label: "Hủy", color: "#808080" };
      default:
        return { label: "Unknown Status", color: "#000" };
    }
  };

  const { label, color } = getStatusLabel(status);

  return (
    <span className="status-label" style={{ color, fontWeight: "bold" }}>
      {label}
    </span>
  );
};

export interface Donate {
  id: number;
  title: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount: number;
  currentAmount: number;
  status: number;
  createdDate: string;
}

interface CardDonateProps {
  donate: Donate;
  isOwner?: boolean;
}

const CardDonate: React.FC<CardDonateProps> = (props: CardDonateProps) => {
  const navigate = useNavigate();
  const [amount, setAmount] = useState<number>(0);
  const [openAmountModal, setOpenAmountModal] = useState<boolean>(false);

  const donateEvent = useStore((store) => store.donateEvent);

  const valuetext = (value: number) => {
    return `${value}`;
  };

  const handleClose = () => {
    setOpenAmountModal(false);
    setAmount(0);
  };

  const openNewTab = (linkUrl: string) => {
    const url = new URL(linkUrl);
    const params = new URLSearchParams(url.search);
    const newUrl = `${url.origin}${url.pathname}?${params.toString()}`;
    window.open(newUrl, "_blank");
  };

  return (
    <>
      <Card className="card-donate" sx={{ maxWidth: 345 }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            image={props.donate.image}
            alt="banner donate"
          />
          <StatusLabel status={props.donate.status} />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {props.donate.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {props.donate.description}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "text.secondary",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CalendarMonthIcon /> {props.donate.startDate} ~{" "}
              {props.donate.endDate}
            </Typography>
            <Slider
              aria-label="Amount"
              defaultValue={
                (props.donate.currentAmount / props.donate.targetAmount) * 100
              }
              getAriaValueText={valuetext}
              marks={[
                { value: 0, label: 0 },
                {
                  value:
                    (props.donate.currentAmount / props.donate.targetAmount) *
                    100,
                  label: props.donate.currentAmount,
                },
                { value: 100, label: props.donate.targetAmount },
              ]}
              // valueLabelDisplay="on"
              color="secondary"
              sx={{ margin: "16px 0" }}
            />
          </CardContent>
        </CardActionArea>
        {props.donate.status !== 2 && (
          <CardActions sx={{ justifyContent: "flex-end" }}>
            <Button
              size="small"
              color="primary"
              onClick={() => setOpenAmountModal(true)}
            >
              Donate
            </Button>
          </CardActions>
        )}
      </Card>

      <Dialog open={openAmountModal} onClose={handleClose}>
        <DialogTitle>Nhập số tiền muốn ủng hộ</DialogTitle>
        <DialogContent>
          <div>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              margin="normal"
              variant="outlined"
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={async () => {
              const linkPayment = await donateEvent(props.donate.id, amount);
              openNewTab(linkPayment);
            }}
            color="primary"
          >
            Donate
          </Button>
          <Button onClick={handleClose} color="info">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CardDonate;
