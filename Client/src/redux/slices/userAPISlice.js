import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:8800/api"; // Adjust this URL to match your actual API base URL

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Get the token from Redux state

    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Set token in headers
    }
    return headers;
  },
});

export const userApiSlice = createApi({
  reducerPath: "apiOne",
  baseQuery,
  tagTypes: ["User"], // Use "User" to refresh cache when user data changes
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/users/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (loginData) => ({
        url: "/users/login",
        method: "POST",
        body: loginData,
      }),
      invalidatesTags: (result, error, { userId }) =>
        result ? [{ type: "User", id: userId }] : [],
    }),
    fetchUser: builder.query({
      query: (userId) => `/users/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/users/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"], // Refresh all user data on logout
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
  useLogoutMutation,
} = userApiSlice;
