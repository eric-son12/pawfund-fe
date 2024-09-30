import React, { useEffect } from "react";
import { Pagination } from "@mui/material";

import { useStore } from "../../store";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import CardPost from "../../components/card-post/CardPost";

import "./Listing.scss";

const Listing: React.FC = () => {
  const fetchPosts = useStore((store) => store.fetchPosts);
  const posts = useStore((store) => store.post.data);

  useEffect(() => {
    fetchPosts();
  }, []);

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
    </>
  );
};

export default Listing;
