import { useState } from "react";

export default function useDetail() {
  // === data proyek dummy (opsi combobox) ===
  const [dataOptions, setDataOptions] = useState({
    project: [
      { value: 1, label: "Situbondo 01" },
      { value: 2, label: "Situbondo 02" },
      { value: 3, label: "Semarang" },
    ],
  });

  // === data dashboard ===
  const [dataDashboard, setDataDashboard] = useState({
    totalProjectsWorkedOn: 2,
    totalCompletedProjects: 1,
    totalAbsentDays: 2,
    completionRate: 60, // dalam persen
    attendanceRate: 90, // dalam persen
  });

  // === ambil opsi proyek ===
  const getDataOptions = async () => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 300);
    });
  };

  // === ambil summary dashboard ===
  const getDashboarData = async ({
    user_id,
    month,
  }: {
    user_id: number;
    month: string;
  }) => {
    // simulasi perhitungan realistik
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        const totalProjectsWorkedOn = user_id === 1 ? 2 : 1;
        const totalCompletedProjects = user_id === 1 ? 1 : 1;
        const totalAbsentDays = user_id === 1 ? 1 : 0;

        const completionRate =
          (totalCompletedProjects / totalProjectsWorkedOn) * 100;
        const attendanceRate = 100 - totalAbsentDays * 5; // dummy hitungan absen

        setDataDashboard({
          totalProjectsWorkedOn,
          totalCompletedProjects,
          totalAbsentDays,
          completionRate,
          attendanceRate,
        });
        resolve();
      }, 300);
    });
  };

  // === tambah worklog baru ===
  const postWorklogData = async (payload: any) => {
    console.log("Worklog saved (dummy):", payload);
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  // === hapus worklog ===
  const deleteWorklogData = async (id: number) => {
    console.log("Worklog deleted (dummy):", id);
    return new Promise<void>((resolve) => setTimeout(resolve, 300));
  };

  return {
    dataOptions,
    getDataOptions,
    postWorklogData,
    deleteWorklogData,
    getDashboarData,
    dataDashboard,
  };
}
