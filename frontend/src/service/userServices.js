import AxiosClient from "./AxiosClient";

export const userSignup = async (user) => {
  const { data } = await AxiosClient.post("/user", user);
  return data;
};

export const getUser = async () => {
  const { data } = await AxiosClient.get("/user");
  return data;
};

export const userLogin = async (user) => {
  const { data } = await AxiosClient.post("/user/login", user);
  return data;
};

export const userUpdate = async (user) => {
  const { data } = await AxiosClient.put("/user", user);
  return data;
};

export const getSingeUser = async ({ id }) => {
  const { data } = await AxiosClient.get(`/user/${id}`);
  return data;
};
