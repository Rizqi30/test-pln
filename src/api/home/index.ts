import instanceBaseUrl from "@/axios/interceptor";

export const getUsersApi = async () => {
  const response = await instanceBaseUrl.get("users");
  return response.data;
};

export const postUserApi = async (data: any) => {
  const response = await instanceBaseUrl.post("users", data);
  return response.data;
};

export const putUserApi = async (data: any) => {
  const response = await instanceBaseUrl.put("users", data, {
    params: { id: data.id },
  });
  return response.data;
};

export const deleteUserApi = async (id: number) => {
  const response = await instanceBaseUrl.delete(`users`, {
    params: { id: id },
  });
  return response.data;
};
