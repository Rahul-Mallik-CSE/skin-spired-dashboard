import baseApi from "../api/baseAPI";

const notificationManagementAPI = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationManagement: builder.query({
      query: () => ({
        url: `/notification-management/get-notification-management`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Notification"],
    }),
    updateNotificationManagement: builder.mutation({
      query: (data) => ({
        url: `/notification-management/update`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: data,
      }),
      invalidatesTags: ["Notification"],
    }),
  }),
});

export const {
  useGetNotificationManagementQuery,
  useUpdateNotificationManagementMutation,
} = notificationManagementAPI;
