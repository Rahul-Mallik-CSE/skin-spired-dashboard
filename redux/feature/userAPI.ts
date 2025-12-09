/** @format */

import baseApi from "../api/baseAPI";

const authAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<any, any>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/user/get-all-users?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    getUserProfile: builder.query<any, string>({
      query: () => ({
        url: `/user/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getProfile: builder.query({
      query: () => ({
        url: `/user/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateUserData: builder.mutation({
      query: ({ id, data }) => ({
        url: `/user/update-user-data/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getAnswersByUser: builder.query<any, string>({
      query: (userId) => ({
        url: `/ans/get-ans-by-user/${userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserProfileQuery,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useUpdateUserDataMutation,
  useGetAnswersByUserQuery,
} = authAPI;
