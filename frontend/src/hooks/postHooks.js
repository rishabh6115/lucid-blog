import {
  addCommentsToPost,
  createPost,
  deletePost,
  getPosts,
  getSinglePost,
  getUserPosts,
  updatePost,
} from "@/service/postServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePostCreate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (post) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries(["post"]);
    },
  });
};

export const usePostGet = ({ search, page }) => {
  return useQuery({
    queryFn: () => getPosts({ search, page }),
    queryKey: ["post", search, page],
    refetchOnWindowFocus: false,
  });
};

export const usePostGetSingle = (id) => {
  return useQuery({
    queryFn: () => getSinglePost(id),
    queryKey: ["single-post", id],
    refetchOnWindowFocus: false,
  });
};

export const usePostUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, post }) => updatePost({ id, post }),
    onSuccess: () => {
      queryClient.invalidateQueries(["single-post", "post", "user-posts"]);
    },
  });
};

export const usePostDelete = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["post", "user-posts"]);
    },
  });
};

export const usePostAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (comment) => addCommentsToPost(comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["single-post"]);
    },
  });
};

export const usePostGetUserPosts = ({ page }) => {
  return useQuery({
    queryFn: () => getUserPosts({ page }),
    queryKey: ["user-posts", page],
    refetchOnWindowFocus: false,
  });
};
