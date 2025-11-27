/** @format */

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "/api/backend",
  }),

  tagTypes: [
    "User",
    "Notification",
    "Profile",
    "Privacy",
    "AboutUs",
    "Settings",
    "Court",
    "Auth",
    "SkinCondition",
    "Product",
  ],
  endpoints: () => ({}),
});

export default baseApi;
