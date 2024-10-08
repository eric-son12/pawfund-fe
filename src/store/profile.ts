// Copyright 2024 by P2S Software LLC.
// This file contains proprietary and confidential information.
// Unauthorized copying of this file, via any medium, is strictly prohibited.

import type { StoreGet, StoreSet } from "../store";
import axios from "axios";

export interface ProfileState {
  user: UserProfile | undefined;
  privileges: UserPrivileges | undefined;
}

export interface UserProfile {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  birthdayDay: number;
  birthdayMonth: number;
  birthdayYear: number;
  timestampCreated: Long;
  avatarUrl: string;
  phoneNumber: string;
}

export interface UpdatedUserProfile {
  firstName: string;
  lastName: string;
  birthdayDay?: number;
  birthdayMonth?: number;
  birthdayYear?: number;
}

export interface UserPrivileges {
  isHost: boolean;
  isAdmin: boolean;
  isPayout: boolean;
}

export interface ProfileActions {
  profileFetch: () => Promise<void>;
  profileUpdate: (updatedUser: UpdatedUserProfile) => Promise<void>;
}

export const initialProfile: ProfileState = {
  user: undefined,
  privileges: undefined,
};

export function profileActions(set: StoreSet, get: StoreGet): ProfileActions {
  return {
    profileFetch: async () => {
      set((state) => {
        state.loading.isLoading = true;
      });
      try {
        // const response = await axios.post(
        //   "https://api.npoint.io/a2862f5a0d3205b2bba4/login",
        //   {
        //     username: "admin",
        //     password: "admin",
        //   }
        // );
        set((state) => {
          //   state.post.data = response.data;
          state.loading.isLoading = false;
        });
      } catch (error) {
        set((state) => {
          state.loading.error = "Error fetching data";
        });
      }
    },
    profileUpdate: async () => {
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
  };
}
