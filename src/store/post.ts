import axios from "axios";
import type { StoreGet, StoreSet } from "../store";
import { Post } from "../components/card-post/CardPost";

export interface PostState {
  data: Post[];
}

export interface PostActions {
  fetchPosts: () => Promise<void>;
  postDetailFetch: (id: number) => Promise<Post | undefined>;
}

export const initialPost: PostState = {
  data: [],
};

export function PostActions(set: StoreSet, get: StoreGet): PostActions {
  return {
    fetchPosts: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.get(
          "https://api.npoint.io/a2862f5a0d3205b2bba4"
        );
        set((state) => {
          state.post.data = response.data;
          state.loading.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.loading.error = "Error fetching data";
        });
      }
    },
    postDetailFetch: async (id: number) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const posts = get().post.data;
        const response = posts.find((post) => post.id === id);
        return response;
      } catch (error) {
        set((state) => {
          state.loading.error = "Error fetching data";
        });
      }
    },
  };
}
