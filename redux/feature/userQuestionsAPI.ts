/** @format */

import baseApi from "../api/baseAPI";

const questionsAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuestions: builder.query<any, any>({
      query: ({ page = 1, limit = 10 }) => ({
        url: `/quesntion/get-all-question?page=${page}&limit=${limit}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    updateQuestion: builder.mutation({
      query: ({ id, data }) => ({
        url: `/quesntion/update-question/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetAllQuestionsQuery, useUpdateQuestionMutation } =
  questionsAPI;
