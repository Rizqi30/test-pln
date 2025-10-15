'use client';

import CardData from '@/components/CardData';
import { DataTable } from '@/components/DataTable';
import { ChartPie } from '@/components/PieCharts';
import Layout from '@/layout';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from '@/hooks/useNavigate';
import AddWorklog from './components/addWorklog';
import { ClipLoader, HashLoader } from 'react-spinners';
import useAlertDialog from '@/components/Alert/store';
import { Combobox } from '@/components/ui/combobox';
import { detailColumn } from '@/components/Column/column';
import useHome from '@/hooks/dummy/useHome';
import moment from 'moment';

const Detail = () => {
  const { readSecureData } = useNavigate();
  const [dataUser, setDataUser] = useState<any>(null);
  
  const { dataWorklog, deleteWorklogData, postWorklogData, dataProjectOriginal } = useHome();
  const { showAlert } = useAlertDialog();

  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [monthFilter, setMonthFilter] = useState({
    value:
      new Date().getMonth() + 1 < 10
        ? `0${new Date().getMonth() + 1}`
        : String(new Date().getMonth() + 1), // <-- Pastikan selalu string
    label: new Date().toLocaleString('default', { month: 'long' }),
  });

  const filteredWorklogs = useMemo(() => {
    if (!dataUser?.id || !dataWorklog) return [];

    const worklogsForUserAndMonth = dataWorklog.filter(
      (w: any) =>
        w.user_id === dataUser.id &&
        moment(w.work_date).format('MM') === monthFilter.value
    );

    return worklogsForUserAndMonth.map((w: any) => {
      const project = dataProjectOriginal.find(
        (p: any) => p.id === Number(w.project_id)
      );
      return {
        ...w,
        projects: { name: project ? project.name : 'Proyek Tidak Ditemukan' },
      };
    });
  }, [dataWorklog, dataUser, monthFilter.value, dataProjectOriginal]);

  const dataDashboard = useMemo(() => {
    if (filteredWorklogs.length === 0) {
      return {
        totalProjectsWorkedOn: 0,
        totalCompletedProjects: 0,
        totalAbsentDays: 22, // Asumsi 22 hari kerja jika tidak ada data
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
    
    const manDays = Object.values(workByDate).reduce((sum, dailyHours) => {
      return sum + (Math.min(dailyHours, 8) / 8);
    }, 0);
    
    const totalWorkingDaysInMonth = 22;
    const uniqueDatesWorked = Object.keys(workByDate).length;
    
    return {
      totalProjectsWorkedOn: new Set(filteredWorklogs.map(item => item.project_id)).size,
      totalCompletedProjects: Math.round(manDays),
      totalAbsentDays: totalWorkingDaysInMonth - uniqueDatesWorked,
      completionRate: (manDays / totalWorkingDaysInMonth) * 100,
      attendanceRate: (uniqueDatesWorked / totalWorkingDaysInMonth) * 100,
    };
  }, [filteredWorklogs]);

  const handleDelete = async (id: number) => {
    showAlert({
      title: 'Apakah anda yakin?',
      subTitle: 'Anda akan menghapus data ini',
      buttonConfirm: (
        <button
          onClick={async () => {
            await deleteWorklogData(id);
            useAlertDialog.getState().closeDialog();
          }}
          className="px-4 py-2 bg-red-500 text-white rounded border-none"
        >
          Delete
        </button>
      ),
    });
  };

  useEffect(() => {
    const userData = readSecureData('detail');
    setDataUser(userData);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (dataUser) {
      setLoading(true);
      const timer = setTimeout(() => setLoading(false), 300);
      return () => clearTimeout(timer);
    }
  }, [monthFilter, dataUser]);

  if (!dataUser || loading) {
    return (
      <div className="h-full flex justify-center items-center ">
        <ClipLoader size={50} color="#10375C" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex justify-end">
        <div className="w-[15rem]">
          <Combobox
            value={monthFilter.value + ''}
            placeholder="Pilih Bulan"
            onChange={(value, label) => {
              setMonthFilter({
                value,
                label,
              } as any);
            }}
            options={
              [
                {
                  value: '01',
                  label: 'Januari',
                },
                {
                  value: '02',
                  label: 'Februari',
                },
                {
                  value: '03',
                  label: 'Maret',
                },
                {
                  value: '04',
                  label: 'April',
                },
                {
                  value: '05',
                  label: 'Mei',
                },
                {
                  value: '06',
                  label: 'Juni',
                },
                {
                  value: '07',
                  label: 'Juli',
                },
                {
                  value: '08',
                  label: 'Agustus',
                },
                {
                  value: '09',
                  label: 'September',
                },
                {
                  value: '10',
                  label: 'Oktober',
                },
                {
                  value: '11',
                  label: 'November',
                },
                {
                  value: '12',
                  label: 'Desember',
                },
              ] as any
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <CardData
          title={(dataDashboard as any)?.totalProjectsWorkedOn || 0}
          subTitle="Projects"
          description="Yang Dikerjakan/Bulan"
          className="bg-blue-500"
        />
        <CardData
          title={(dataDashboard as any)?.totalCompletedProjects || 0}
          subTitle="Project"
          description="Selesai/Bulan"
          className="bg-green-500"
        />
        <CardData
          title={(dataDashboard as any)?.totalAbsentDays || 0}
          subTitle="Tidak Hadir"
          description="Absen/Bulan"
          className="bg-red-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ChartPie
          title="Project Completion (%)"
          subTitle={monthFilter.label}
          data={[
            {
              label: 'Complete',
              value: (dataDashboard as any)?.completionRate || 0,
              fill: '#3B82F6',
            },
            {
              label: 'Incomplete',
              value: 100 - (dataDashboard as any)?.completionRate || 0,
              fill: '#E5E7EB',
            },
          ]}
          desc={`${
            Number((dataDashboard as any)?.completionRate).toFixed(2) || 0
          }% Project Selesai`}
        />
        <ChartPie
          title="Kehadiran (%)"
          subTitle={monthFilter.label}
          data={[
            {
              label: 'Hadir',
              value: (dataDashboard as any)?.attendanceRate || 0,
              fill: '#22C55E',
            },
            {
              label: 'Tidak Hadir',
              value: 100 - (dataDashboard as any)?.attendanceRate || 0,
              fill: '#E5E7EB',
            },
          ]}
          desc={`${
            (dataDashboard as any)?.totalAbsentDays || 0
          } Hari Tidak Hadir`}
        />
      </div>

      <DataTable
        columns={detailColumn(handleDelete)}
        data={filteredWorklogs}
        title={`Worklog ${dataUser?.name}`}
        onAddProject={() => setIsOpenModal(true)}
        addButtonText="Add"
      />
      <AddWorklog
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        idUser={dataUser?.id}
        postWorklogData={postWorklogData}
        dataProjectOriginal={dataProjectOriginal}
      />
    </div>
  );
};

export default Detail;

Detail.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;