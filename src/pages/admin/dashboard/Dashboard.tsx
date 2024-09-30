import React, { useState } from "react";
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";

import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

import "./Dashboard.scss";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<string>("post");
  const [open, setOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"edit" | "delete">("edit");
  const [selectedRow, setSelectedRow] = useState<any>(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "firstName", headerName: "First name", width: 130 },
    { field: "lastName", headerName: "Last name", width: 130 },
    {
      field: "age",
      headerName: "Age",
      type: "number",
      width: 90,
    },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      width: 160,
      valueGetter: (value, row) =>
        `${row.firstName || ""} ${row.lastName || ""}`,
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleClickOpen("edit", params.row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleClickOpen("delete", params.row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      ),
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35 },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
    { id: 3, lastName: "Lannister", firstName: "Jaime", age: 45 },
    { id: 4, lastName: "Stark", firstName: "Arya", age: 16 },
    { id: 5, lastName: "Targaryen", firstName: "Daenerys", age: null },
    { id: 6, lastName: "Melisandre", firstName: null, age: 150 },
    { id: 7, lastName: "Clifford", firstName: "Ferrara", age: 44 },
    { id: 8, lastName: "Frances", firstName: "Rossini", age: 36 },
    { id: 9, lastName: "Roxie", firstName: "Harvey", age: 65 },
  ];

  const paginationModel = { page: 0, pageSize: 5 };

  const handleClickOpen = (type: "edit" | "delete", row: any) => {
    setDialogType(type);
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleEditSubmit = () => {
    console.log("Editing post:", selectedRow);
    handleClose();
  };

  const handleDeleteSubmit = () => {
    console.log("Deleting post:", selectedRow);
    handleClose();
  };

  const handleChangeType = (type: string) => {
    setType(type);
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
              <ListItemButton>
                <ListItemIcon>
                  <ArticleOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Posts" />
              </ListItemButton>
              <ListItemButton>
                <ListItemIcon>
                  <PersonOutlineOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="Users" />
              </ListItemButton>
            </List>
          </div>

          <div className="content">
            <h1 className="title">
              Quản lý {type === "post" ? "bài đăng" : "người dùng"}
            </h1>

            <div className="table-wrap">
              <Paper sx={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  initialState={{ pagination: { paginationModel } }}
                  pageSizeOptions={[5, 10]}
                  checkboxSelection
                  sx={{ border: 0 }}
                />
              </Paper>
            </div>
          </div>
        </div>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>
            {dialogType === "edit" ? "Edit Post" : "Delete Post"}
          </DialogTitle>
          <DialogContent>
            {dialogType === "edit" ? (
              <div>
                <p>Edit the details of the post:</p>
                <p>ID: {selectedRow?.id}</p>
                <p>First Name: {selectedRow?.firstName}</p>
                <p>Last Name: {selectedRow?.lastName}</p>
              </div>
            ) : (
              <div>
                <p>Are you sure you want to delete this post?</p>
                <p>ID: {selectedRow?.id}</p>
                <p>First Name: {selectedRow?.firstName}</p>
              </div>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {dialogType === "edit" ? (
              <Button onClick={handleEditSubmit} color="primary">
                Save
              </Button>
            ) : (
              <Button onClick={handleDeleteSubmit} color="secondary">
                Delete
              </Button>
            )}
          </DialogActions>
        </Dialog>
      </div>

      <Footer />
    </>
  );
};

export default Dashboard;
