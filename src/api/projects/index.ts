import instanceBaseUrl from "@/axios/interceptor";

export const getProjectsApi = async () => {
  const response = await instanceBaseUrl.get("projects");
  return response.data;
};

export const postProjectApi = async (data: {
  name: string;
  location: string;
}) => {
  const response = await instanceBaseUrl.post("projects", data);
  return response.data;
};

export const putProjectApi = async (data: any) => {
  const response = await instanceBaseUrl.put("projects", data, {
    params: { id: data.id },
  });
  return response.data;
};

export const deleteProjectApi = async (id: number) => {
  const response = await instanceBaseUrl.delete(`projects`, {
    params: { id: id },
  });
  return response.data;
};
