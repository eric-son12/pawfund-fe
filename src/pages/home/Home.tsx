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
import ClearIcon from "@mui/icons-material/Clear";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import CardPost from "../../components/card-post/CardPost";
import Footer from "../../components/footer/Footer";
import CardDonate from "../../components/card-donate/CardDonate";

import "./Home.scss";

export const PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Kạn",
  "Bắc Giang",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Dương",
  "Bình Định",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lạng Sơn",
  "Lào Cai",
  "Lâm Đồng",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

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
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchResult, setSearchResult] = useState<any>([]);

  const searchKeyword = useStore((store) => store.post.searchKeyword);
  const categories = useStore((store) => store.post.petType);
  const fetchPosts = useStore((store) => store.fetchPosts);
  const posts = useStore((store) => store.post.data);
  const totalPost = useStore((store) => store.post.totalCount);
  const donates = useStore((store) => store.post.donate);
  const fetchDonates = useStore((store) => store.fetchListDonate);

  useEffect(() => {
    fetchPosts(0, 0, 0, 0, "", 2);
    fetchDonates();
  }, []);

  useEffect(() => {
    if (searchKeyword) handleSearchPost(searchKeyword);
  }, [searchKeyword]);

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: number) => {
    setType(newValue);
    switch (newValue) {
      case 0:
        fetchPosts(0, 0, 0, 0, "", 2);
        break;
      case 1:
        fetchPosts(1, 0, 0, 0, "", 2);
        break;
      case 2:
        fetchPosts(2, 0, 0, 0, "", 2);
        break;
      default:
        fetchPosts(0, 0, 0, 0, "", 2);
        break;
    }
  };

  const handleChangeAge = (event: SelectChangeEvent) => {
    setAge(event.target.value as string);
    switch (event.target.value) {
      case "1-5":
        fetchPosts(type, Number(category), 1, 5, location, 2);
        break;
      case "5-12":
        fetchPosts(type, Number(category), 5, 12, location, 2);
        break;
      case "12+":
        fetchPosts(type, Number(category), 12, 99, location, 2);
        break;
      default:
        fetchPosts();
        break;
    }
  };

  const handleChangeLocation = (event: SelectChangeEvent) => {
    setLoation(event.target.value as string);
    fetchPosts(type, Number(category), 0, 0, event.target.value, 2);
  };

  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
    fetchPosts(type, Number(event.target.value), 0, 0, location, 2);
  };

  const clearFilter = () => {
    setLoation("");
    setCategory("");
    setAge("");
    fetchPosts(0, 0, 0, 0, "", 2);
  };

  const handleSearchPost = (keyword: string) => {
    const search = posts.filter(
      (post: any) => post.petName.toLowerCase().indexOf(keyword) > -1
    );
    if (search.length > 0) {
      setSearchResult(search);
    } else {
      setSearchResult([]);
    }
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
                {PROVINCES.map((province, index) => (
                  <MenuItem key={index} value={province}>
                    {province}
                  </MenuItem>
                ))}
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
            {searchKeyword ? (
              searchResult.length > 0 ? (
                searchResult &&
                searchResult.length > 0 &&
                searchResult.map((post: any) => (
                  <CardPost key={post.id} post={post} />
                ))
              ) : (
                <p style={{ textAlign: "center" }}>Post is empty.</p>
              )
            ) : (
              <>
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
              </>
            )}
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
