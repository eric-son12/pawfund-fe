import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Slider,
  Typography,
} from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import "./CardDonate.scss";

export const StatusLabel: React.FC<{ status: number }> = ({ status }) => {
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 1:
        return { label: "Đang diễn ra", color: "#FFA500" };
      case 2:
        return { label: "Hoàn thành", color: "#4CAF50" };
      case 3:
        return { label: "Không hoàn thành", color: "#FF6347" };
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

  const valuetext = (value: number) => {
    return `${value}`;
  };

  return (
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
            defaultValue={props.donate.currentAmount}
            getAriaValueText={valuetext}
            marks={[
              { value: 0, label: 0 },
              { value: 100, label: props.donate.targetAmount },
            ]}
            // valueLabelDisplay="on"
            color="secondary"
            sx={{ margin: "16px 0" }}
          />
        </CardContent>
      </CardActionArea>
      <CardActions sx={{ justifyContent: "flex-end" }}>
        <Button size="small" color="primary">
          Donate
        </Button>
      </CardActions>
    </Card>
  );
};

export default CardDonate;
