/** @format */

import baseApi from "../api/baseAPI";

const uploadLinksAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLinks: builder.query({
      query: ({ page = 1, limit = 10, search = "" }) => ({
        url: `/link-info/get-all?page=${page}&limit=${limit}${
          search ? `&search=${search}` : ""
        }`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["Link"],
    }),
    createLink: builder.mutation({
      query: (data) => ({
        url: `/link-info/create`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Link"],
    }),
    updateLink: builder.mutation({
      query: ({ id, data }) => ({
        url: `/link-info/update/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: data,
      }),
      invalidatesTags: ["Link"],
    }),
    deleteLink: builder.mutation({
      query: (id) => ({
        url: `/link-info/delete/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Link"],
    }),
  }),
});

export const {
  useGetAllLinksQuery,
  useCreateLinkMutation,
  useUpdateLinkMutation,
  useDeleteLinkMutation,
} = uploadLinksAPI;
