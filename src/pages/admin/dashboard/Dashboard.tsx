import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import { useStore } from "../../../store";
import { LetterVolunteer } from "../../../store/users";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string>("user");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const users = useStore((store) => store.users.users);
  const fetchUsers = useStore((store) => store.fetchUsers);

  const posts = useStore((store) => store.post.data);
  const fetchPosts = useStore((store) => store.fetchPosts);

  const [showLetter, setShowLetter] = useState<boolean>(false);
  const [letter, setLeter] = useState<LetterVolunteer>();
  const fetchLetter = useStore((store) => store.getVolunteerDetail);
  const confirmVolunteer = useStore((store) => store.confirmVolunteer);
  const deletePost = useStore((store) => store.deletePost);
  const deactivateUser = useStore((store) => store.deactivateUser);

  useEffect(() => {
    type === "user" ? fetchUsers() : fetchPosts();
  }, [type]);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "fullName", headerName: "Fullname", flex: 1 },
    {
      field: "phone",
      headerName: "Phone",
      type: "string",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      type: "string",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
    },
    {
      field: "action",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <div>
          <IconButton
            color="secondary"
            onClick={() => handleClickOpen(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const columnsPost: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "petName", headerName: "Pet Name", flex: 1 },
    {
      field: "petType",
      headerName: "Pet Type",
      type: "string",
      flex: 1,
    },
    {
      field: "age",
      headerName: "Age",
      type: "string",
      flex: 1,
    },
    {
      field: "address",
      headerName: "Address",
      type: "string",
      flex: 1,
    },
    {
      field: "fullName",
      headerName: "Full Name",
      type: "string",
    },
    {
      field: "action",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <div>
          <IconButton
            color="secondary"
            onClick={() => handleClickOpen(params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const handleClickOpen = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowLetter(false);
  };

  const showDetailVolunteer = async (id: string, row: any) => {
    setSelectedRow(row);
    const letterDetail = await fetchLetter(id);
    setLeter(letterDetail);
    !_.isEmpty(letterDetail) && setShowLetter(true);
  };

  const handleConfirmVolunteer = async () => {
    const { id } = selectedRow;
    const res = await confirmVolunteer(id);
    res && setShowLetter(false);
  };

  return (
    <>
      <Header />

      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="sidebar">
            <List
              sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
              component="nav"
              subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                  Menu
                </ListSubheader>
              }
            >
              <ListItemButton onClick={() => setType("user")}>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
              <ListItemButton onClick={() => setType("post")}>
                <ListItemIcon>
                  <ArticleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItemButton>
            </List>
          </div>

          <div className="content">
            <h1 className="title">
              Quản lý {type === "post" ? "bài đăng" : "người dùng"}
            </h1>

            <div className="table-wrap">
              <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                  rows={type === "post" ? posts : users || []}
                  columns={type === "post" ? columnsPost : columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  onRowClick={(row) => {
                    if (row.row.role === "VOLUNTEER") {
                      showDetailVolunteer(row.row.id, row);
                    }
                  }}
                  sx={{ border: 0 }}
                />
              </Paper>
            </div>
          </div>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {type === "post" ? "Delete Post" : "Delete User"}
          </DialogTitle>
          <DialogContent>
            <div>
              <p>
                <span>Do you want to delete ID: </span>
                {selectedRow?.id}
              </p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                type === "post"
                  ? deletePost(selectedRow.id)
                  : deactivateUser(selectedRow.id);
                handleClose();
              }}
              color="primary"
            >
              Delete
            </Button>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={showLetter} onClose={handleClose}>
          <DialogTitle>Letter Detail</DialogTitle>
          <DialogContent>
            <div className="letter-detail-content">
              <p>
                <span>Email: </span> {letter?.email}
              </p>
              <p>
                <span>FullName: </span> {letter?.fullName}
              </p>
              <p>
                <span>Gender: </span> {letter?.gender}
              </p>
              <p>
                <span>Phone: </span> {letter?.phone}
              </p>
              <p>
                <span>Address: </span> {letter?.address}
              </p>
              <p>
                <span>DOB: </span> {letter?.dob}
              </p>
              <p>
                <span>CCCD: </span> {letter?.cccd}
              </p>
              <p>
                <span>Experience: </span> {letter?.experience}
              </p>
              <p>
                <span>CurrentJob: </span> {letter?.currentJob}
              </p>
              <p>
                <span>Reason: </span> {letter?.reason}
              </p>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleConfirmVolunteer} color="primary">
              Approve
            </Button>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
