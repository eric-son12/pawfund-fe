import axios from "axios";

import type { StoreGet, StoreSet } from "../store";
import { Post } from "../components/card-post/CardPost";
import { PostDetail } from "../pages/detail/Detail";
import { Donate } from "../components/card-donate/CardDonate";

export interface PetType {
  id: number;
  name: string;
}

export interface CreatePostRequest {
  name: string;
  age: string;
  title: string;
  imageUrl: string[];
  description: string;
  address: string;
  breed: string;
  petTypeId: number;
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

export interface PostState {
  searchKeyword: string;
  petType: PetType[];
  data: Post[];
  totalCount: number;
  history: Post[];
  totalCountHistory: number;
  donate: Donate[];
  totalCountDonate: number;
}

export interface CreateEventRequest {
  title: string;
  image: string;
  description: string;
  startDate: string;
  endDate: string;
  targetAmount: string;
}

export interface PostActions {
  fetchPetType: () => Promise<void>;
  setSearchKeyword: (keyword: string) => Promise<void>;
  fetchPosts: (
    type?: number,
    petTypeId?: number,
    ageFrom?: number,
    ageTo?: number,
    address?: string,
    status?: number
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
  updatePostStatus: (id: number, statusCode: number) => Promise<void>;
  updatePostStatusGive: (id: number, statusCode: number) => Promise<void>;
  updatePostStatusReceive: (id: number, statusCode: number) => Promise<void>;
  fetchListDonate: () => Promise<void>;
  fetchDonateDetail: (id: number) => Promise<Donate>;
  createDonate: (values: CreateEventRequest) => Promise<void>;
  updateDonate: (values: CreateEventRequest) => Promise<void>;
  donateEvent: (id: number, amount: number) => Promise<string>;
}

export const initialPost: PostState = {
  searchKeyword: "",
  petType: [],
  data: [],
  totalCount: 0,
  history: [],
  totalCountHistory: 0,
  donate: [],
  totalCountDonate: 0,
};

export function postActions(set: StoreSet, get: StoreGet): PostActions {
  const BASE_URL = "https://spacesport.pro/api";

  return {
    fetchPetType: async () => {
      try {
        const response = await axios.post(
          `${BASE_URL}/public/pet/type/dropdown`
        );
        const categories = response.data?.data || [];
        set((state) => {
          state.post.petType = categories;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    setSearchKeyword: async (keyword) => {
      set((state) => {
        state.post.searchKeyword = keyword;
      });
    },
    fetchPosts: async (type, petTypeId, ageFrom, ageTo, address, status) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          type: type || 0,
          petTypeId: petTypeId || 0,
          ageFrom: ageFrom || 0,
          ageTo: ageTo || 0,
          status: status || 0,
          address: address || "",
          pageSize: 150,
          pageNumber: 1,
        };
        const response = await axios.post(
          `${BASE_URL}/public/pet/filter`,
          body
        );
        const posts = response.data?.data?.list || [];
        const totalPost = response.data?.data?.totalCount || 0;
        await get().fetchPetType();
        const petTypeList = get().post.petType;
        posts.forEach((post: any) => {
          const petTypeFound = petTypeList.find(
            (type) => type.id == post.petType
          );
          post.petType = petTypeFound?.name ?? "Pet";
        });
        posts.sort((a: any, b: any) => b.id - a.id);
        set((state) => {
          state.post.data = posts;
          state.post.totalCount = totalPost;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        const response = await axios.post(
          `${BASE_URL}/public/adopt/view?adoptId=${id}`
        );
        const postDetail = response.data?.data || undefined;
        return postDetail;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
          type: type || 0,
          petTypeId: petTypeId || 0,
          ageFrom: ageFrom || 0,
          ageTo: ageTo || 0,
          pageSize: 150,
          pageNumber: 1,
        };
        const response = await axios.post(`${BASE_URL}/adopt/history`, body);
        const posts = response.data?.data?.list || [];
        const totalPost = response.data?.data?.totalCount || 0;
        await get().fetchPetType();
        const petTypeList = get().post.petType;
        posts.forEach((post: any) => {
          const petTypeFound = petTypeList.find(
            (type) => type.id == post.petType
          );
          post.petType = petTypeFound?.name ?? "Pet";
        });
        posts.sort((a: any, b: any) => b.id - a.id);
        set((state) => {
          state.post.history = posts;
          state.post.totalCountHistory = totalPost;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Created post successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Created post successfully",
          });
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
    updatePost: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/adopt/update`, values);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Updated post successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Detele post successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePostStatus: async (id, statusCode) => {
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
        await axios.post(`${BASE_URL}/adopt/approve`, body);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update status successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePostStatusGive: async (id, statusCode) => {
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
        await axios.post(`${BASE_URL}/adopt/changeStatus`, body);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update status successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updatePostStatusReceive: async (id, statusCode) => {
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
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update post successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Create event donate successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
    updateDonate: async (values) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/event/update`, values);
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: "Update event donate successfully",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        const response = await axios.post(
          `${BASE_URL}/public/event/filter`,
          body
        );
        const listDonate = response.data?.data?.list || [];
        const totalDonate = response.data?.data?.totalCount || 0;
        set((state) => {
          state.post.donate = listDonate;
          state.post.totalCountDonate = totalDonate;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
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
        const response = await axios.post(`${BASE_URL}/event/donate`, body);
        const link = response.data?.data;
        const message = response.data?.message;
        set((state) => {
          state.notification.data.push({
            status: "SUCCESS",
            content: message,
          });
        });
        return link;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.notification.data.push({
            status: "ERROR",
            content: message,
          });
        });
      } finally {
        set((state) => {
          state.loading.isLoading = false;
        });
      }
    },
  };
}
