import instanceBaseUrl from '@/axios/interceptor';

export const getWorklogApi = async (params: any) => {
  const response = await instanceBaseUrl.get('worklog', {
    params,
  });
  return response.data;
};

export const getOptionsApi = async () => {
  const response = await instanceBaseUrl.get('options');
  return response.data;
};

export const postWorklogApi = async (data: any) => {
  const response = await instanceBaseUrl.post('worklog', data);
  return response.data;
};

export const deleteWorklogApi = async (id: number) => {
  const response = await instanceBaseUrl.delete(`worklog`, {
    params: { id: id },
  });
  return response.data;
};

export const getDashboardApi = async (params: any) => {
  const response = await instanceBaseUrl.get('dashboard', {
    params,
  });
  return response.data;
};
