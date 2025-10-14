import { getWorklogApi } from "@/api/detail";
import { getUsersApi, postUserApi } from "@/api/home";
import {
  deleteProjectApi,
  getProjectsApi,
  postProjectApi,
  putProjectApi,
} from "@/api/projects";
import { toast } from "react-toastify";
import { create } from "zustand";

interface UseProjectInterface {
  postProjects: (data: any) => Promise<any>;
  deleteProjects: (id: number) => Promise<any>;
  putProjects: (data: any) => Promise<any>;
}

const useProjects = create<UseProjectInterface>((set) => ({
  postProjects: async (data: any) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await postProjectApi(data);
      toast.update(toastId, {
        render: "Project created successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
      return res;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to create project. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
  putProjects: async (data: any) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await putProjectApi(data);
      toast.update(toastId, {
        render: "Project updated successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
      return res;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to update project. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
  deleteProjects: async (id: number) => {
    const toastId = toast.loading("Processing request...");
    try {
      const res = await deleteProjectApi(id);
      toast.update(toastId, {
        render: "Project deleted successfully.",
        type: "success",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
      return res;
    } catch (error) {
      console.error(error);
      toast.update(toastId, {
        render: "Failed to delete project. Please try again.",
        type: "error",
        isLoading: false,
        autoClose: 3000, // Toast will close after 3 seconds
      });
    }
  },
}));

export default useProjects;
