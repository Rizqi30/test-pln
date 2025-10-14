'use client';

import { DataTable } from '@/components/DataTable';
import Layout from '@/layout';
import React, { useEffect, useState } from 'react';
import AddProjects from './components/addProjects';
import { ClipLoader, HashLoader } from 'react-spinners';
import useAlertDialog from '@/components/Alert/store';
import { projectColumn } from '@/components/Column/column';
import useHome from '@/hooks/dummy/useHome';

const Project = () => {
  const { dataProjectOriginal, getProjectOriginal, postProjects, putProjects, deleteProjects } = useHome();
  const { showAlert } = useAlertDialog();

  const [loading, setLoading] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dataDetail, setDataDetail] = useState<any>([]);
  const [mounted, setMounted] = useState(false);

  const getData = async () => {
    setLoading(true);
    await getProjectOriginal();
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    showAlert({
      title: 'Apakah anda yakin?',
      subTitle: 'Anda akan menghapus data ini',
      buttonConfirm: (
        <button
          onClick={async () => {
            await deleteProjects(id);
            await getProjectOriginal();
            useAlertDialog.getState().closeDialog(); // Close the dialog
          }}
          className="px-4 py-2 bg-red-500 text-white rounded border-none"
        >
          Delete
        </button>
      ),
    });
  };

  const handleEdit = (data: any) => {
    setDataDetail(data);
    setIsOpenModal(true);
  };

  useEffect(() => {
    setMounted(true);
    getData();
  }, []);

  if (!mounted) return null

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center ">
        <ClipLoader size={50} color="#10375C" />
      </div>
    );
  }

  return (
    <div>
      <DataTable
        columns={projectColumn(handleEdit, handleDelete)}
        data={dataProjectOriginal || []}
        onAddProject={() => {
          setIsOpenModal(true);
          setDataDetail([]);
        }}
        title="Projects"
      />
      <AddProjects
        isOpen={isOpenModal}
        onClose={() => {
          setIsOpenModal(false);
          setDataDetail([]);
        }}
        data={dataDetail}
        postProjects={postProjects}
        putProjects={putProjects}
      />
    </div>
  );
};

export default Project;

Project.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
