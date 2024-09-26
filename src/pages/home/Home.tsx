import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  Tab,
  Tabs,
} from "@mui/material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import CardPost from "../../components/card-post/CardPost";
import Footer from "../../components/footer/Footer";
import Loading from "../../components/loading/Loading";

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
  const [age, setAge] = useState<string>("");
  const [type, setType] = useState<number>(0);
  const fetchPosts = useStore((store) => store.fetchPosts);
  const posts = useStore((store) => store.post.data);

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setType(newValue);
  };

  const handleChangeAge = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
  };

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLoation(event.target.value as string);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
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
                onChange={handleChangeAge}
              >
                <MenuItem value={"phunhuan"}>Phú Nhuận</MenuItem>
                <MenuItem value={"tanbinh"}>Tân Bình</MenuItem>
                <MenuItem value={"tanphu"}>Tân Phú</MenuItem>
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
                <MenuItem value={"dog"}>Chó</MenuItem>
                <MenuItem value={"cat"}>Mèo</MenuItem>
                <MenuItem value={"other"}>Khác</MenuItem>
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
                <MenuItem value={"1"}>1 tháng tuổi</MenuItem>
                <MenuItem value={"2"}>2 tháng tuổi</MenuItem>
                <MenuItem value={"3"}>3 tháng tuổi</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button
            variant="text"
            startIcon={<FilterAltOutlinedIcon fontSize="large" />}
          >
            Lọc
          </Button>
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
                <Tab label="Muốn nhận" {...a11yProps(1)} />
                <Tab label="Muốn cho" {...a11yProps(2)} />
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
          </div>

          <div>
            <Pagination
              count={10}
              color="primary"
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      <Footer />

      <Loading />
    </>
  );
};

export default Home;
