import {
  getSingeUser,
  getUser,
  userLogin,
  userSignup,
  userUpdate,
} from "@/service/userServices";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserSignup = () => {
  return useMutation({
    mutationFn: (data) => userSignup(data),
  });
};

export const useUserGet = () => {
  return useQuery({
    queryFn: () => getUser(),
    queryKey: ["user"],
    refetchOnWindowFocus: false,
    retry: false,
  });
};

export const useUserLogin = () => {
  return useMutation({
    mutationFn: (data) => userLogin(data),
  });
};

export const useUserUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => userUpdate(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["user"]);
    },
  });
};

export const useUserGetSingle = ({ id }) => {
  return useQuery({
    queryFn: () => getSingeUser({ id }),
    queryKey: ["single-user", id],
    refetchOnWindowFocus: false,
    retry: false,
  });
};
