import AxiosClient from "./AxiosClient";

export const userSignup = async (user) => {
  const { data } = await AxiosClient.post("/api/user", user);
  return data;
};

export const getUser = async () => {
  const { data } = await AxiosClient.get("/api/user");
  return data;
};

export const userLogin = async (user) => {
  const { data } = await AxiosClient.post("/api/user/login", user);
  return data;
};

export const userUpdate = async (user) => {
  const { data } = await AxiosClient.put("/api/user", user);
  return data;
};

export const getSingeUser = async ({ id }) => {
  const { data } = await AxiosClient.get(`/api/user/${id}`);
  return data;
};

export const followUser = async ({ id }) => {
  const { data } = await AxiosClient.put(`/api/user/follow/${id}`);
  return data;
};

export const unfollowUser = async ({ id }) => {
  const { data } = await AxiosClient.put(`/api/user/unfollow/${id}`);
  return data;
};

export const getFollowedUsers = async () => {
  const { data } = await AxiosClient.get("/api/user/followed-users");
  return data;
};

export const getUserSlackChannels = async () => {
  const { data } = await AxiosClient.get(`/api/slack`);
  return data;
};

export const saveChannelId = async ({ channel_id }) => {
  console.log(channel_id);
  const { data } = await AxiosClient.post(
    `/api/slack?channel_id=${channel_id}`
  );
  return data;
};
