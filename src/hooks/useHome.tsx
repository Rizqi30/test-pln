import { getWorklogApi } from "@/api/detail";
import {
  deleteUserApi,
  getUsersApi,
  postUserApi,
  putUserApi,
} from "@/api/home";
import { getProjectsApi } from "@/api/projects";
import { toast } from "react-toastify";
import { create } from "zustand";

interface StoreState {
  dataUser: any;
  dataWorklog: any;
  dataProjects: any;
  dataProjectOriginal: any;
  getDataUser: () => Promise<void>;
  getWorklog: (param: any) => Promise<void>;
  getProjects: (param: any) => Promise<void>;
  postUserData: (data: any) => Promise<any>;
  getProjectOriginal: () => Promise<void>;
  putUserData: (data: any) => Promise<any>;
  deleteUserData: (id: number) => Promise<any>;
}

const useHome = create<StoreState>((set) => ({
  dataUser: [],
  dataWorklog: [],
  dataProjects: [],
  dataProjectOriginal: [],
  getDataUser: async () => {
    const res = await getUsersApi();
    set({ dataUser: res });
  },
  getWorklog: async (param: any) => {
    const res = await getWorklogApi(param);
    set({ dataWorklog: res });
  },
  getProjects: async (param: any) => {
    const res = await getWorklogApi(param);
    set({ dataProjects: res });
  },
  getProjectOriginal: async () => {
    const res = await getProjectsApi();
    set({ dataProjectOriginal: res });
  },
  postUserData: async (data: any) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await postUserApi(data);

      // Update toast to success
      toast.update(toastId, {
        render: "User data submitted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });

      return res;
    } catch (error) {
      console.error(error);

      // Update toast to error
      toast.update(toastId, {
        render: "Failed to submit user data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
  putUserData: async (data: any) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await putUserApi(data);
      // Update toast to success
      toast.update(toastId, {
        render: "User data updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
      return res;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update user data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
  deleteUserData: async (id: number) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await deleteUserApi(id);
      toast.update(toastId, {
        render: "User data deleted successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
      return res;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to delete user data. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
}));

export default useHome;
