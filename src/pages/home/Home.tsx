import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  TablePagination,
  Tabs,
} from "@mui/material";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import CardPost from "../../components/card-post/CardPost";
import Footer from "../../components/footer/Footer";
import CardDonate from "../../components/card-donate/CardDonate";

import "./Home.scss";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const CustomTabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
};

const Home: React.FC = () => {
  const [location, setLoation] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [categories, setCategories] = useState<any[]>([]);
  const [age, setAge] = useState<string>("");
  const [type, setType] = useState<number>(0);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchPosts = useStore((store) => store.fetchPosts);
  const posts = useStore((store) => store.post.data);
  const totalPost = useStore((store) => store.post.totalCount);
  const donates = useStore((store) => store.post.donate);
  const fetchDonates = useStore((store) => store.fetchListDonate);

  useEffect(() => {
    getPetType();
    fetchPosts();
    fetchDonates();
  }, []);

  const getPetType = async () => {
    const url = "http://103.151.239.114/api/public/pet/type/dropdown";

    try {
      const response = await axios.post(url);
      const categories = response.data?.data || [];
      setCategories(categories);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setType(newValue);
    switch (newValue) {
      case 0:
        fetchPosts();
        break;
      case 1:
        fetchPosts(1);
        break;
      case 2:
        fetchPosts(2);
        break;
      default:
        fetchPosts();
        break;
    }
  };

  const handleChangeAge = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
    switch (event.target.value) {
      case "1-5":
        fetchPosts(0, 0, 1, 5);
        break;
      case "5-12":
        fetchPosts(0, 0, 5, 12);
        break;
      case "12+":
        fetchPosts(0, 0, 12, 99);
        break;
      default:
        fetchPosts();
        break;
    }
  };

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLoation(event.target.value as string);
    fetchPosts(0, 0, 0, 0, event.target.value);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    fetchPosts(0, Number(event.target.value));
  };

  const clearFilter = () => {
    setLoation("");
    setCategory("");
    setAge("");
    fetchPosts();
  };

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Header />

      <div className="home-page">
        <div className="filter-controller">
          <div className="filter-content">
            <FormControl size="small" fullWidth>
              <InputLabel id="location-label">Khu vực</InputLabel>
              <Select
                labelId="location-label"
                id="location"
                value={location}
                label="Khu vực"
                onChange={handleChangeLocation}
              >
                <MenuItem value={"Hồ chí minh"}>Hồ chí minh</MenuItem>
                <MenuItem value={"Đà nẵng"}>Đà nẵng</MenuItem>
                <MenuItem value={"Hà nội"}>Hà nội</MenuItem>
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="category-label">Loại thú cưng</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                value={category}
                label="Loại thú cưng"
                onChange={handleChangeCategory}
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl size="small" fullWidth>
              <InputLabel id="age-label">Độ tuổi</InputLabel>
              <Select
                labelId="age-label"
                id="age"
                value={age}
                label="Độ tuổi"
                onChange={handleChangeAge}
              >
                <MenuItem value={"1-5"}>1 ~ 5 tháng tuổi</MenuItem>
                <MenuItem value={"5-12"}>5 ~ 12 tháng tuổi</MenuItem>
                <MenuItem value={"12+"}> 12+ tháng tuổi</MenuItem>
              </Select>
            </FormControl>
          </div>

          {(age || location || category) && (
            <Button
              onClick={clearFilter}
              variant="text"
              startIcon={<ClearIcon fontSize="large" />}
            >
              Reset
            </Button>
          )}
        </div>

        <div className="home-container">
          <div className="news-feed">
            <div className="category-wrap">
              <Tabs
                style={{ background: "white", marginBottom: "4px" }}
                value={type}
                onChange={handleChangeTabs}
                aria-label="basic tabs example"
              >
                <Tab label="Tất cả" {...a11yProps(0)} />
                <Tab label="Muốn cho" {...a11yProps(1)} />
                <Tab label="Muốn nhận" {...a11yProps(2)} />
              </Tabs>
            </div>
            <CustomTabPanel value={type} index={0}>
              {posts &&
                posts.length > 0 &&
                posts.map((post) => <CardPost key={post.id} post={post} />)}
            </CustomTabPanel>
            <CustomTabPanel value={type} index={1}>
              {posts &&
                posts.length > 0 &&
                posts.map((post) => <CardPost key={post.id} post={post} />)}
            </CustomTabPanel>
            <CustomTabPanel value={type} index={2}>
              {posts &&
                posts.length > 0 &&
                posts.map((post) => <CardPost key={post.id} post={post} />)}
            </CustomTabPanel>

            {posts.length === 0 && (
              <p style={{ textAlign: "center" }}>Post is empty.</p>
            )}

            <div>
              <TablePagination
                component="div"
                count={totalPost}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>

          <div className="list-donate">
            {donates &&
              donates.length > 0 &&
              donates.map((donate, index) => (
                <CardDonate key={index} donate={donate} />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Home;
