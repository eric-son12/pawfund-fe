import React, { useEffect, useState } from "react";
import { Pagination, TablePagination } from "@mui/material";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardPost from "../../components/card-post/CardPost";

import "./Listing.scss";

const Listing: React.FC = () => {
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const fetchPosts = useStore((store) => store.postFetchByProfile);
  const posts = useStore((store) => store.post.history);
  const totalPost = useStore((store) => store.post.totalCountHistory);

  useEffect(() => {
    fetchPosts();
  }, []);

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

      <div className="listing-page">
        <div className="listing-container">
          <h1>Quản lý bài đăng</h1>

          <div className="posts-list">
            {posts &&
              posts.length > 0 &&
              posts.map((post) => (
                <CardPost key={post.id} post={post} isOwner={true} />
              ))}
          </div>

          {posts.length > 0 ? (
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
          ) : (
            <p style={{ textAlign: "center" }}>No post found.</p>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Listing;
