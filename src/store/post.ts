import axios from "axios";
import type { StoreGet, StoreSet } from "../store";
import { Post } from "../components/card-post/CardPost";
import { PostDetail } from "../pages/detail/Detail";
import { Donate } from "../components/card-donate/CardDonate";

export interface PostState {
  data: Post[];
  totalCount: number;
  history: Post[];
  totalCountHistory: number;
  donate: Donate[];
  totalCountDonate: number;
}
export interface CreatePostRequest {
  name: string;
  age: string;
  title: string;
  imageUrl: string[];
  description: string;
  address: string;
  breed: string;
}

export interface CreatePostReceiveRequest {
  name: string;
  age: string;
  title: string;
  imageUrl: string[];
  description: string;
  address: string;
  breed: string;
  houseType: string;
  houseOwner: number;
  isAllergic: number;
  experience: string;
  reason: string;
}

export interface EditPostRequest {
  adoptId: number;
  type: string;
  images: string[];
  age: number;
  title: string;
  description: string;
  address: string;
  breed: string;
}

export interface PostActions {
  fetchPosts: (
    type?: number,
    petTypeId?: number,
    ageFrom?: number,
    ageTo?: number,
    address?: string
  ) => Promise<void>;
  postDetailFetch: (id: number) => Promise<PostDetail | undefined>;
  postFetchByProfile: (
    type?: number,
    petTypeId?: number,
    ageFrom?: number,
    ageTo?: number
  ) => Promise<void>;
  createPost: (values: CreatePostRequest) => Promise<void>;
  createPostReceive: (values: CreatePostReceiveRequest) => Promise<void>;
  updatePost: (values: EditPostRequest) => Promise<void>;
  deletePost: (id: number) => Promise<void>;
  updatePostGive: (id: number, statusCode: number) => Promise<void>;
  updatePostReceive: (id: number, statusCode: number) => Promise<void>;
  fetchListDonate: () => Promise<void>;
  fetchDonateDetail: (id: number) => Promise<Donate>;
  createDonate: (values: any) => Promise<void>;
  donateEvent: (id: number, amount: number) => Promise<void>;
}

export const initialPost: PostState = {
  data: [],
  totalCount: 0,
  history: [],
  totalCountHistory: 0,
  donate: [],
  totalCountDonate: 0,
};

export function postActions(set: StoreSet, get: StoreGet): PostActions {
  const BASE_URL = "http://103.151.239.114/api";

  return {
    fetchPosts: async (type, petTypeId, ageFrom, ageTo, address) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          type: type || 0, //0 cả 2, 1 đem cho, 2 nhận nuôi
          petTypeId: petTypeId || 0, //type truyền lên id đại diện cho chó, mèo, ...
          ageFrom: ageFrom || 0,
          ageTo: ageTo || 0,
          address: address || "",
          pageSize: 10,
          pageNumber: 1,
        };
        const response = await axios.post(
          `${BASE_URL}/public/pet/filter`,
          body
        );
        const posts = response.data?.data?.list || [];
        const totalPost = response.data?.data?.totalCount || 0;
        set((state) => {
          state.post.data = posts;
          state.post.totalCount = totalPost;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    postDetailFetch: async (id: number) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        // const posts = get().post.data;
        // const response = posts.find((post) => post.id === id);
        const response = await axios.post(
          `${BASE_URL}/public/adopt/view?adoptId=${id}`
        );
        const postDetail = response.data?.data || undefined;
        return postDetail;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    postFetchByProfile: async (type, petTypeId, ageFrom, ageTo) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          type: type || 0, //0 cả 2, 1 đem cho, 2 nhận nuôi
          petTypeId: petTypeId || 0, //type truyền lên id đại diện cho chó, mèo, ...
          ageFrom: ageFrom || 0,
          ageTo: ageTo || 0,
          pageSize: 10,
          pageNumber: 1,
        };
        const response = await axios.post(`${BASE_URL}/adopt/history`, body);
        const posts = response.data?.data?.list || [];
        const totalPost = response.data?.data?.totalCount || 0;
        set((state) => {
          state.post.history = posts;
          state.post.totalCountHistory = totalPost;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    createPost: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/pet/create`, values);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    createPostReceive: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/adopt/create`, values);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePost: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/adopt/update`, values);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    deletePost: async (id) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/adopt/delete?adoptId=${id}`);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePostGive: async (id, statusCode) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        //status:
        //1: Pending (Đang xem xét)
        //2: Available (Chờ nhận nuôi)
        //3: Review (Chờ xét duyệt)
        //4: Approved (Đã phê duyệt)
        //5: Rejected (Đã từ chối)
        const body = {
          adoptId: id,
          status: statusCode,
        };
        await axios.post(`${BASE_URL}/adopt/changeStatus`);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePostReceive: async (id, statusCode) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        //1: Pending (Đang xem xét)
        //2: Approved (Đã phê duyệt)
        //3: Rejected (Đã từ chối)
        const body = {
          adoptId: id,
          status: statusCode,
        };
        await axios.post(`${BASE_URL}/adopt/application/changeStatus`);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    createDonate: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/event/create`, values);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    fetchListDonate: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          title: "",
          status: 0,
          fromTarget: 0,
          toTarget: 2000000,
          pageSize: 100,
          pageNumber: 1,
        };
        const response = await axios.post(`${BASE_URL}/event/filter`, body);
        const listDonate = response.data?.data?.list || [];
        const totalDonate = response.data?.data?.totalCount || 0;
        set((state) => {
          state.post.donate = listDonate;
          state.post.totalCountDonate = totalDonate;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    fetchDonateDetail: async (id) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(
          `${BASE_URL}/public/event/view?eventId=${id}`
        );
        const donateDetail = response.data?.data;
        return donateDetail;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    donateEvent: async (id, amount) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          eventId: id,
          amount: amount,
        };
        await axios.post(`${BASE_URL}/event/donate`, body);
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
  };
}
