// Copyright 2024 by P2S Software LLC.
// This file contains proprietary and confidential information.
// Unauthorized copying of this file, via any medium, is strictly prohibited.

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Draft } from "immer";
import { initialPost, PostActions, PostState } from "./store/post";
import { initialLoading, LoadingState } from "./store/loading";

export interface State {
  post: PostState;
  loading: LoadingState;
}

export type Actions = PostActions;

export type Store = State & Actions;
export type StoreGet = () => Store;
export type StoreSet = (f: (state: Draft<State>) => void) => void;

export const useStore = create<Store, [["zustand/immer", never]]>(
  immer((set, get) => ({
    post: initialPost,
    ...PostActions(set, get),
    loading: initialLoading,
  }))
);
