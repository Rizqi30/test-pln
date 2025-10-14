'use client';

import CardData from '@/components/CardData';
import { DataTable } from '@/components/DataTable';
import { ChartPie } from '@/components/PieCharts';
import Layout from '@/layout';
import React, { useMemo, useState, useEffect } from 'react';
import { ClipLoader } from 'react-spinners';
import useAlertDialog from '@/components/Alert/store';
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/datepicker';
import { detailColumn } from '@/components/Column/column';
import useHome from '@/hooks/dummy/useHome';
import moment from 'moment';

const ReportsPage = () => {
  const { dataUser, dataWorklog, deleteWorklogData, dataProjectOriginal } = useHome();
  const { showAlert } = useAlertDialog();

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [monthFilter, setMonthFilter] = useState<Date>(new Date());
  const [isClient, setIsClient] = useState(false); // State untuk mencegah hydration error

  useEffect(() => {
    setIsClient(true); // Setelah render awal, set ke true
  }, []);

  const userOptions = dataUser.map((user: any) => ({
    label: user.name,
    value: user.id,
  }));

  const filteredWorklogs = useMemo(() => {
    if (!selectedUser || !dataWorklog) return [];

    const worklogsForUserAndMonth = dataWorklog.filter((w: any) =>
      w.user_id === selectedUser.id &&
      moment(w.work_date).isSame(monthFilter, 'day')
    );

    return worklogsForUserAndMonth.map((w: any) => {
      const project = dataProjectOriginal.find((p: any) => p.id === Number(w.project_id));
      return {
        ...w,
        projects: { name: project ? project.name : 'Proyek Tidak Ditemukan' },
      };
    });
  }, [dataWorklog, selectedUser, monthFilter, dataProjectOriginal]);

  // --- PERBAIKAN UTAMA DI SINI ---
  const dataDashboard = useMemo(() => {
    const totalWorkingDaysInMonth = 22; // Asumsi hari kerja

    // Selalu kembalikan objek yang lengkap, bahkan jika tidak ada data
    if (!selectedUser || filteredWorklogs.length === 0) {
      return {
        totalProjectsWorkedOn: 0,
        totalCompletedProjects: 0,
        totalAbsentDays: totalWorkingDaysInMonth,
        completionRate: 0,
        attendanceRate: 0,
      };
    }

    const workByDate = filteredWorklogs.reduce((acc, log) => {
      const date = log.work_date;
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date] += log.hours_worked;
      return acc;
    }, {} as Record<string, number>);
    
    if (!workByDate || typeof workByDate !== 'object') {
        return { totalProjectsWorkedOn: 0, /*... default values ...*/ };
    }

    const manDays = Object.values(workByDate).reduce((sum, dailyHours: number) => sum + (Math.min(dailyHours, 8) / 8), 0);
    const uniqueDatesWorked = Object.keys(workByDate).length;
    
    return {
      totalProjectsWorkedOn: new Set(filteredWorklogs.map(item => item.project_id)).size,
      totalCompletedProjects: Math.round(manDays),
      totalAbsentDays: totalWorkingDaysInMonth - uniqueDatesWorked,
      completionRate: (manDays / totalWorkingDaysInMonth) * 100,
      attendanceRate: (uniqueDatesWorked / totalWorkingDaysInMonth) * 100,
    };
  }, [filteredWorklogs, selectedUser]);

  const handleDelete = async (id: number) => { /* ... logika hapus ... */ };

  // Jangan render apapun sampai client siap (mencegah hydration error)
  if (!isClient) {
    return (
        <div className="h-full flex justify-center items-center ">
            <ClipLoader size={50} color="#10375C" />
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-bold">Employee Worklog Reports</h1>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
        <div className="w-full md:w-64">
          <label className="text-sm font-medium text-gray-700">Pilih Karyawan</label>
          <Combobox
            value={selectedUser?.id}
            onChange={(userId) => {
              const user = dataUser.find((u: any) => u.id === userId);
              setSelectedUser(user);
            }}
            options={userOptions}
            placeholder="Pilih Karyawan..."
          />
        </div>

        <div className="w-full md:w-64">
          <label className="text-sm font-medium text-gray-700">Pilih Bulan & Tahun</label>
          <DatePicker
            selected={monthFilter}
            onChange={(date: Date) => setMonthFilter(date)}
            dateFormat="dd MMMM yyyy"
            shouldCloseOnSelect={true}
            className="w-full"
          />
        </div>
      </div>

      {/* Tampilan Konten Laporan */}
      {!selectedUser ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Silakan pilih karyawan untuk melihat laporan.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <CardData
                title={dataDashboard.totalProjectsWorkedOn}
                subTitle="Projects"
                description="Yang Dikerjakan/Bulan"
                className="bg-blue-500"
            />
            <CardData
                title={dataDashboard.totalCompletedProjects}
                subTitle="Project"
                description="Selesai"
                className="bg-green-500"
            />
            <CardData
                title={dataDashboard.totalAbsentDays}
                subTitle="Tidak Hadir"
                description="Absen"
                className="bg-red-500"
            />
          </div>
          
          {/* Table Section */}
          <DataTable
            columns={detailColumn(handleDelete)}
            data={filteredWorklogs}
            title={`Detail Laporan untuk ${selectedUser.name}`}
          />
        </>
      )}
    </div>
  );
};

export default ReportsPage;

ReportsPage.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;