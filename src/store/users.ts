import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";
import { UserProfile } from "./profile";

export interface UsersState {
  users: UserProfile[] | undefined;
}

export interface LetterVolunteer {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  status: string;
  dob: string;
  cccd: string;
  experience: string;
  currentJob: string;
  reason: string;
  gender: string;
}

export interface UsersActions {
  fetchUsers: () => Promise<void>;
  getVolunteerDetail: (userId: string) => Promise<LetterVolunteer>;
  confirmVolunteer: (userId: string) => Promise<boolean>;
  deactivateUser: (userId: string) => Promise<void>;
}

export const initialUsers: UsersState = {
  users: undefined,
};

export function usersActions(set: StoreSet, get: StoreGet): UsersActions {
  const BASE_URL = `http://103.151.239.114/api`;

  return {
    fetchUsers: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          name: "",
          status: "",
          role: "",
          pageSize: 500,
          pageNumber: 1,
        };
        const response = await axios.post(`${BASE_URL}/users/list`, body);
        const userList = response.data?.data?.list || undefined;
        set((state) => {
          state.users.users = userList;
          state.loading.isLoading = false;
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
          state.loading.isLoading = false;
        });
      }
    },
    getVolunteerDetail: async (userId: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(
          `${BASE_URL}/volunteers/detail?userId=${userId}`
        );
        const letter = response.data?.data || undefined;
        set((state) => {
          state.loading.isLoading = false;
        });
        return letter;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
          state.loading.isLoading = false;
        });
      }
    },
    confirmVolunteer: async (userId: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          volunteerId: userId,
          status: "Accept", //Waiting, Reject
        };
        await axios.post(`${BASE_URL}/volunteers/confirm`, body);
        set((state) => {
          state.loading.isLoading = false;
        });
        return true;
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
          state.loading.isLoading = false;
        });
        return false;
      }
    },
    deactivateUser: async (userId: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        await axios.post(`${BASE_URL}/users/deactivate?userId=${userId}`);
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
