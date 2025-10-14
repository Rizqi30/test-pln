import { useEffect, useState } from 'react'
import moment from "moment";

const USER_DATA_KEY = 'worklog_dummy_users';
const PROJECT_DATA_KEY = 'worklog_dummy_projects';
const WORKLOG_DATA_KEY = 'worklog_dummy_worklogs';

export default function useHome() {
  const [dataUser, setDataUser] = useState(() => {
    try {
      const storedData = window.localStorage.getItem(USER_DATA_KEY);
      return storedData
        ? JSON.parse(storedData)
        : [
            { id: 1, name: 'Diyah', email: 'diyah@gmail.com', role: 'Admin' },
            { id: 2, name: 'Fitri', email: 'kupritos@gmail.com', role: 'QA Tester' },
            { id: 3, name: 'Rizqi', email: 'rizqi@gmail.com', role: 'Developer' },
          ];
    } catch (error) {
      console.error('Gagal mengambil data dari local storage', error);
      return [
        { id: 1, name: 'Diyah', email: 'diyah@gmail.com', role: 'Admin' },
        { id: 2, name: 'Fitri', email: 'kupritos@gmail.com', role: 'QA Tester' },
        { id: 3, name: 'Rizqi', email: 'rizqi@gmail.com', role: 'Developer' },
      ];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(USER_DATA_KEY, JSON.stringify(dataUser));
  }, [dataUser]);

  const getDataUser = async () => {
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const deleteUserData = async (id: number) => {
    setDataUser((prev) => prev.filter((u) => u.id !== id))
  }

  const postUserData = async (payload: any) => {
    const newUser = {
      ...payload,
      id: new Date().getTime(),
      role: 'New User',
      created_at: new Date().toISOString(),
    };
    setDataUser((prev) => [...prev, newUser]);
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const putUserData = async (payload: any) => {
    setDataUser((prev) =>
      prev.map((user) =>
        user.id === payload.id ? { ...user, ...payload } : user
      )
    );
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const [dataProjectOriginal, setDataProjectOriginal] = useState(() => {
    try {
      const storedData = window.localStorage.getItem(PROJECT_DATA_KEY);
      return storedData
        ? JSON.parse(storedData)
        : [
            { id: 1, name: 'Situbondo 01', location: 'Situbondo' },
            { id: 2, name: 'Situbondo 02', location: 'Situbondo' },
            { id: 3, name: 'Semarang Sky Piercer', location: 'Semarang' },
          ];
    } catch (error) {
      console.error('Gagal mengambil data proyek dari local storage', error);
      return [
        { id: 1, name: 'Situbondo 01', location: 'Situbondo' },
        { id: 2, name: 'Situbondo 02', location: 'Situbondo' },
        { id: 3, name: 'Semarang Sky Piercer', location: 'Semarang' },
      ];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(PROJECT_DATA_KEY, JSON.stringify(dataProjectOriginal));
  }, [dataProjectOriginal]);

  const getProjectOriginal = async () => {
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const postProjects = async (payload: { name: string; location: string }) => {
    const newProject = {
      ...payload,
      id: new Date().getTime(),
    };
    setDataProjectOriginal((prev) => [...prev, newProject]);
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const putProjects = async (payload: { id: number; name: string; location: string }) => {
    setDataProjectOriginal((prev) =>
      prev.map((project) =>
        project.id === payload.id ? { ...project, ...payload } : project
      )
    );
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const deleteProjects = async (id: number) => {
    setDataProjectOriginal((prev) => prev.filter((project) => project.id !== id));
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  const [dataWorklog, setDataWorklog] = useState(() => {
    try {
      const storedData = window.localStorage.getItem(WORKLOG_DATA_KEY);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Gagal mengambil data worklog dari local storage', error);
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(WORKLOG_DATA_KEY, JSON.stringify(dataWorklog));
  }, [dataWorklog]);

  const postWorklogData = async (payload: any) => {
    const newWorklog = {
      ...payload,
      id: new Date().getTime(),
    };
    setDataWorklog((prev) => [...prev, newWorklog]);
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };
  
  const deleteWorklogData = async (id: number) => {
    setDataWorklog((prev) => prev.filter((w) => w.id !== id));
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  // const putWorklogData = async (payload: any) => {
  //   setDataWorklog((prev) =>
  //     prev.map((worklog) =>
  //       worklog.id === payload.id ? { ...worklog, ...payload } : worklog
  //     )
  //   );
  //   return new Promise<void>((resolve) => setTimeout(resolve, 300));
  // };

  return {
    dataUser,
    setDataUser,
    getDataUser,
    deleteUserData,
    postUserData,
    putUserData,

    dataProjectOriginal,
    setDataProjectOriginal,
    getProjectOriginal,
    postProjects,
    putProjects,
    deleteProjects,

    dataWorklog,
    postWorklogData,
    deleteWorklogData,
    // putWorklogData,
  };
}