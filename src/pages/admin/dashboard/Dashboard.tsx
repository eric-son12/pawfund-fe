import React, { useEffect, useState } from "react";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
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
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import AddIcon from "@mui/icons-material/Add";
import Diversity2Icon from "@mui/icons-material/Diversity2";

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
  const [selectedRowPost, setSelectedRowPost] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [openChangeStatus, setOpenChangeStatus] = useState(false);
  const [openCreateDonate, setOpenCreateDonate] = useState(false);
  const [openEditDonate, setOpenEditDonate] = useState(false);

  const users = useStore((store) => store.users.users);
  const fetchUsers = useStore((store) => store.fetchUsers);

  const posts = useStore((store) => store.post.data);
  const fetchPosts = useStore((store) => store.fetchPosts);

  const donates = useStore((store) => store.post.donate);
  const fetchDonate = useStore((store) => store.fetchListDonate);

  const createDonation = useStore((store) => store.createDonate);
  const updateDonation = useStore((store) => store.updateDonate);

  const [showLetter, setShowLetter] = useState<boolean>(false);
  const [letter, setLeter] = useState<LetterVolunteer>();
  const fetchLetter = useStore((store) => store.getVolunteerDetail);
  const confirmVolunteer = useStore((store) => store.confirmVolunteer);
  const deletePost = useStore((store) => store.deletePost);
  const deactivateUser = useStore((store) => store.deactivateUser);
  const updateStatusPost = useStore((store) => store.updatePostStatusGive);

  useEffect(() => {
    if (type === "user") fetchUsers();
    if (type === "post") fetchPosts();
    if (type === "donate") fetchDonate();
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
      field: "statusApplication",
      headerName: "Status Application",
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
      width: 70,
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
      field: "status",
      headerName: "Status",
      type: "string",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.row.status === 1
            ? "Pending"
            : params.row.status === 2
            ? "Available"
            : params.row.status === 3
            ? "Review"
            : params.row.status === 4
            ? "Approved"
            : "Rejected"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "",
      flex: 1,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={() => handleOpenChangeStatus(params.row)}
          >
            <ArticleOutlinedIcon />
          </IconButton>
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

  const columnsDonate: GridColDef[] = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "string",
      flex: 1,
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "string",
      flex: 1,
    },
    {
      field: "targetAmount",
      headerName: "Target Amount",
      type: "string",
      flex: 1,
    },
    {
      field: "currentAmount",
      headerName: "Current Amount",
      type: "string",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      type: "string",
      renderCell: (params) => (
        <div>
          {params.row.status === 1
            ? "In Progress"
            : params.row.status === 2
            ? "Completed"
            : params.row.status === 3
            ? "UnCompleted"
            : "Cancel"}
        </div>
      ),
    },
    {
      field: "action",
      headerName: "",
      width: 70,
      renderCell: (params) => (
        <div>
          <IconButton
            color="primary"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpenEditDonate(true);
              formik.setValues(params.row);
              setSelectedImage(params.row.image);
            }}
          >
            <DriveFileRenameOutlineOutlinedIcon />
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
    onSubmit: async (values: any) => {
      if (openCreateDonate) {
        await createDonation(values);
        await fetchDonate();
        formik.resetForm();
        setSelectedImage("");
      } else if (openEditDonate) {
        await updateDonation(values);
        await fetchDonate();
        setSelectedImage("");
      }
    },
  });

  const handleUpdateStatus = async (status: number) => {
    const { id } = selectedRowPost;
    await updateStatusPost(id, status);
    await fetchPosts();
    setOpenChangeStatus(false);
  };

  const handleOpenChangeStatus = (row: any) => {
    setSelectedRowPost(row);
    setOpenChangeStatus(true);
  };

  const handleClickOpen = (row: any) => {
    setSelectedRow(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setShowLetter(false);
    setOpenChangeStatus(false);
    setOpenCreateDonate(false);
    setOpenEditDonate(false);
  };

  const showDetailVolunteer = async (id: string, row: any) => {
    setSelectedRow(row);
    const letterDetail = await fetchLetter(id);
    setLeter(letterDetail);
    !_.isEmpty(letterDetail) && setShowLetter(true);
  };

  const handleConfirmVolunteer = async (status: "Accept" | "Reject") => {
    const { id } = selectedRow;
    const res = await confirmVolunteer(id, status);
    res && setShowLetter(false);
    await fetchUsers();
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
                  <Diversity2Icon />
                </ListItemIcon>
                <ListItemText primary="Donation" />
              </ListItemButton>
            </List>
          </div>

          <div className="content">
            <h1 className="title">
              {`Quản lý ${
                type === "post"
                  ? "bài đăng"
                  : type === "user"
                  ? "người dùng"
                  : "donate"
              }`}
            </h1>

            <div className="table-wrap">
              <Paper sx={{ height: "100%", width: "100%" }}>
                <DataGrid
                  rows={
                    type === "post"
                      ? posts
                      : type === "user"
                      ? users
                      : donates || []
                  }
                  columns={
                    type === "post"
                      ? columnsPost
                      : type === "user"
                      ? columns
                      : columnsDonate
                  }
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
            {type === "donate" && (
              <Fab
                size="medium"
                className="add-donate"
                color="primary"
                aria-label="add"
                onClick={() => {
                  setOpenCreateDonate(true);
                  formik.resetForm();
                }}
              >
                <AddIcon />
              </Fab>
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
              onClick={async () => {
                if (type === "post") {
                  await deletePost(selectedRow.id);
                  await fetchPosts();
                } else if (type === "user") {
                  await deactivateUser(selectedRow.id);
                  await fetchUsers();
                }
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
            <Button
              onClick={() => handleConfirmVolunteer("Accept")}
              color="primary"
            >
              Approve
            </Button>
            <Button
              onClick={() => handleConfirmVolunteer("Reject")}
              color="error"
            >
              Reject
            </Button>
            <Button onClick={handleClose} color="info">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openChangeStatus} onClose={handleClose}>
          <DialogTitle>Change Status Post</DialogTitle>
          <DialogContent>
            <div className="change-status-content">
              {selectedRowPost && selectedRowPost.status !== 2 && (
                <Button
                  color="secondary"
                  variant="contained"
                  fullWidth
                  type="submit"
                  style={{ marginTop: "16px" }}
                  onClick={async () => {
                    await handleUpdateStatus(2);
                    await fetchPosts();
                  }}
                >
                  Available
                </Button>
              )}
              {selectedRowPost && selectedRowPost.status !== 5 && (
                <Button
                  color="error"
                  variant="contained"
                  fullWidth
                  type="submit"
                  style={{ marginTop: "16px" }}
                  onClick={async () => {
                    await handleUpdateStatus(5);
                    await fetchPosts();
                  }}
                >
                  Reject
                </Button>
              )}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setOpenChangeStatus(false)}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          className="donate-modal"
          open={openCreateDonate}
          onClose={handleClose}
        >
          <DialogTitle>Create Donate</DialogTitle>
          <DialogContent>
            <div className="create-donate">
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
                            formik.touched.startDate && formik.errors.startDate,
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
                  <FormLabel component="legend" style={{ marginBottom: "8px" }}>
                    Hình ảnh
                  </FormLabel>
                  <div className="gallery-photo">
                    {selectedImage && (
                      <div className="gallery-item">
                        <img src={selectedImage} alt={"image donate"} />
                      </div>
                    )}
                    {!selectedImage && (
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
                    )}
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
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          className="donate-modal"
          open={openEditDonate}
          onClose={handleClose}
        >
          <DialogTitle>Edit Donate</DialogTitle>
          <DialogContent>
            <div className="edit-donate">
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
                            formik.touched.startDate && formik.errors.startDate,
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
                  <FormLabel component="legend" style={{ marginBottom: "8px" }}>
                    Hình ảnh
                  </FormLabel>
                  <div className="gallery-photo">
                    {selectedImage && (
                      <div className="gallery-item">
                        <img src={selectedImage} alt={"image donate"} />
                      </div>
                    )}
                    {!selectedImage && (
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
                    )}
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
          </DialogContent>
          <DialogActions>
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
