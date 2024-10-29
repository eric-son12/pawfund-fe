import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  TextField,
} from "@mui/material";
import * as Yup from "yup";
import dayjs from "dayjs";
import { useFormik } from "formik";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";

import { useStore } from "../../../store";
import { LetterVolunteer } from "../../../store/users";
import Header from "../../../components/header/Header";
import Footer from "../../../components/footer/Footer";

import "./Dashboard.scss";

interface IDonationForm {
  title: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount: string;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [type, setType] = useState<"user" | "post" | "donate">("user");
  const [open, setOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");

  const users = useStore((store) => store.users.users);
  const fetchUsers = useStore((store) => store.fetchUsers);

  const posts = useStore((store) => store.post.data);
  const fetchPosts = useStore((store) => store.fetchPosts);

  const createDonation = useStore((store) => store.createDonate);

  const [showLetter, setShowLetter] = useState<boolean>(false);
  const [letter, setLeter] = useState<LetterVolunteer>();
  const fetchLetter = useStore((store) => store.getVolunteerDetail);
  const confirmVolunteer = useStore((store) => store.confirmVolunteer);
  const deletePost = useStore((store) => store.deletePost);
  const deactivateUser = useStore((store) => store.deactivateUser);

  useEffect(() => {
    if (type === "user") fetchUsers();
    if (type === "post") fetchPosts();
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleClickOpen(params.row);
            }}
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

  const formik = useFormik<IDonationForm>({
    initialValues: {
      title: "",
      image: "",
      description: "",
      startDate: "",
      endDate: "",
      targetAmount: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      image: Yup.string().url("Invalid URL").required("Image URL is required"),
      description: Yup.string().required("Description is required"),
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .min(Yup.ref("startDate"), "End date must be after start date")
        .required("End date is required"),
      targetAmount: Yup.number()
        .typeError("Target amount must be a number")
        .min(0, "Target amount must be at least 0")
        .required("Target amount is required"),
    }),
    onSubmit: (values: any) => {
      console.log("Form values:", values);
      createDonation(values);
    },
  });

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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const uploadImages = async (filesArray: any) => {
        const formData = new FormData();
        formData.append("file", filesArray);
        formData.append("upload_preset", "blnhfbwk");

        try {
          const response = await fetch(
            `https://api.cloudinary.com/v1_1/dzclrmcf5/image/upload`,
            {
              method: "POST",
              body: formData,
            }
          );
          const data = await response.json();
          return data.secure_url;
        } catch (error) {
          console.error("Error uploading image:", error);
          return null;
        }
      };

      const uploadPromises = filesArray.map((file: any) => uploadImages(file));
      const urls = await Promise.all(uploadPromises);

      setSelectedImage(urls[0]);
      formik.setFieldValue("image", urls[0]);
    }
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
              <ListItemButton onClick={() => setType("donate")}>
                <ListItemIcon>
                  <BorderColorIcon />
                </ListItemIcon>
                <ListItemText primary="Create Donation" />
              </ListItemButton>
            </List>
          </div>

          <div className="content">
            <h1 className="title">
              {type === "donate"
                ? "Tạo bài đăng donate"
                : `Quản lý ${type === "post" ? "bài đăng" : "người dùng"}`}
            </h1>

            {type === "donate" ? (
              <div>
                <form
                  onSubmit={formik.handleSubmit}
                  style={{ maxWidth: "500px", margin: "0 auto" }}
                >
                  <TextField
                    fullWidth
                    id="title"
                    name="title"
                    label="Title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    margin="normal"
                  />

                  <TextField
                    fullWidth
                    id="description"
                    name="description"
                    label="Description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                    margin="normal"
                    multiline
                    rows={4}
                  />

                  <TextField
                    fullWidth
                    id="targetAmount"
                    name="targetAmount"
                    label="Target Amount"
                    type="number"
                    value={formik.values.targetAmount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.targetAmount &&
                      Boolean(formik.errors.targetAmount)
                    }
                    helperText={
                      formik.touched.targetAmount && formik.errors.targetAmount
                    }
                    margin="normal"
                  />

                  <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Start Date"
                        value={
                          formik.values.startDate
                            ? dayjs(formik.values.startDate)
                            : null
                        }
                        onChange={(newValue) => {
                          formik.setFieldValue(
                            "startDate",
                            newValue ? newValue.format("YYYY-MM-DD") : ""
                          );
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            id: "startDate",
                            name: "startDate",
                            onBlur: formik.handleBlur,
                            error:
                              formik.touched.startDate &&
                              Boolean(formik.errors.startDate),
                            helperText:
                              formik.touched.startDate &&
                              formik.errors.startDate,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <div style={{ marginTop: "16px", marginBottom: "8px" }}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="End Date"
                        value={
                          formik.values.endDate
                            ? dayjs(formik.values.endDate)
                            : null
                        }
                        onChange={(newValue) => {
                          formik.setFieldValue(
                            "endDate",
                            newValue ? newValue.format("YYYY-MM-DD") : ""
                          );
                        }}
                        slotProps={{
                          textField: {
                            fullWidth: true,
                            id: "endDate",
                            name: "endDate",
                            onBlur: formik.handleBlur,
                            error:
                              formik.touched.endDate &&
                              Boolean(formik.errors.endDate),
                            helperText:
                              formik.touched.endDate && formik.errors.endDate,
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </div>

                  <FormControl fullWidth style={{ marginBottom: "16px" }}>
                    <FormLabel
                      component="legend"
                      style={{ marginBottom: "8px" }}
                    >
                      Hình ảnh
                    </FormLabel>
                    <div className="gallery-photo">
                      {selectedImage && (
                        <div className="gallery-item">
                          <img src={selectedImage} alt={"image donate"} />
                        </div>
                      )}
                      <div className="upload-image">
                        <Button variant="text" component="label">
                          <AddIcon fontSize="large" />
                          <input
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                          />
                        </Button>
                      </div>
                    </div>
                  </FormControl>

                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    type="submit"
                    style={{ marginTop: "16px" }}
                  >
                    Submit
                  </Button>
                </form>
              </div>
            ) : (
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
            )}
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
