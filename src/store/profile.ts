import type { StoreGet, StoreSet } from "../store";
import axios from "../utils/axiosConfig";

export interface User {
  role: string;
  token: string;
  username: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
}
export interface ProfileState {
  user: User | undefined;
  userProfile: UserProfile | undefined;
  error: string | undefined;
}

export interface ProfileActions {
  fetchProfile: () => Promise<void>;
  register: (userBody: any, type: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

export const initialProfile: ProfileState = {
  user: undefined,
  userProfile: undefined,
  error: undefined,
};

export function profileActions(set: StoreSet, get: StoreGet): ProfileActions {
  const BASE_URL = "http://103.151.239.114/api";

  return {
    fetchProfile: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/users/profile`);
        const profile = response.data?.data || undefined;
        set((state) => {
          state.profile.userProfile = profile;
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
    register: async (userBody: any, type: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        let response;
        const body = userBody;
        if (type === "volunteer") {
          response = await axios.post(
            `${BASE_URL}/public/volunteers/register`,
            body
          );
        } else {
          response = await axios.post(`${BASE_URL}/register`, body);
        }
        const status = response?.data?.code;
        const message = response?.data?.message;
        set((state) => {
          if (status === "USER_ALREADY_EXIST") {
            state.loading.error = message;
          } else {
            // TODO: Notify
          }
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
    login: async (username: string, password: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/login`, {
          username,
          password,
        });
        const token = response.data?.data?.token;
        const user = response.data?.data;
        if (token) {
          localStorage.setItem("token", token);
        }
        set((state) => {
          state.profile.user = user;
          state.loading.isLoading = false;
          state.notification.data.push({
            content: response.data.message,
            status: "SUCCESS",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.profile.error = message;
          state.loading.isLoading = false;
        });
      }
    },
    logout: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const response = await axios.post(`${BASE_URL}/logout`);
        set((state) => {
          if (response.data.code === "LOGOUT_SUCCESS") {
            localStorage.setItem("token", "");
            state.profile.user = undefined;
          }
          state.loading.isLoading = false;
          state.notification.data.push({
            content: response.data.message,
            status: "SUCCESS",
          });
        });
      } catch (error: any) {
        set((state) => {
          const message = error?.response?.data?.message || error?.message;
          state.loading.error = message;
          state.loading.isLoading = false;
        });
      }
    },
    changePassword: async (oldPassword: string, newPassword: string) => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        const body = {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: newPassword,
        };
        const response = await axios.post(
          `${BASE_URL}/users/changePassword`,
          body
        );
        set((state) => {
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
  };
}
