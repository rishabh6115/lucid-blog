import AxiosClient from "./AxiosClient";

export const createPost = async (post) => {
  const { data } = await AxiosClient.post("/post", post);
  return data;
};

export const getPosts = async ({ search, page }) => {
  const { data } = await AxiosClient.get("/post", {
    params: { search, page },
  });
  return data;
};

export const getSinglePost = async (id) => {
  const { data } = await AxiosClient.get(`/post/${id}`);
  return data;
};

export const deletePost = async (id) => {
  const { data } = await AxiosClient.delete(`/post/${id}`);
  return data;
};

export const updatePost = async ({ id, post }) => {
  const { data } = await AxiosClient.post(`/post/${id}`, post);
  return data;
};

export const addCommentsToPost = async (comment) => {
  const { data } = await AxiosClient.put(`/post/addcomment`, comment);
  return data;
};

export const getUserPosts = async ({ page }) => {
  const { data } = await AxiosClient.get(`/post/singleuserpost`, {
    params: { page },
  });
  return data;
};
