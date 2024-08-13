import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:8800/api"; // Thay thế bằng URL API thực tế của bạn

// Định nghĩa baseQuery với prepareHeaders
const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; // Lấy token từ Redux state

    console.log("Token being sent:", token);
    if (token) {
      headers.set("Authorization", `Bearer ${token}`); // Đặt token vào headers
    }
    return headers;
  },
});
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User"], // Sử dụng "User" để làm mới cache khi dữ liệu người dùng thay đổi
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (userData) => ({
        url: "/user/register",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (loginData) => ({
        url: "/user/login",
        method: "POST",
        body: loginData,
      }),
    }),
    // Fetch projects by user ID
    fetchProjectsByUser: builder.query({
      query: (userId) => `/project/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Project", id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),

    // Create new project
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/project/create",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    fetchUser: builder.query({
      query: (userId) => `/user/${userId}`,
      providesTags: (result, error, userId) => [{ type: "User", id: userId }],
    }),
    updateUser: builder.mutation({
      query: ({ userId, userData }) => ({
        url: `/user/${userId}`,
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "User", id: userId },
      ],
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/user/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"], // Làm mới tất cả dữ liệu người dùng khi đăng xuất
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useFetchUserQuery,
  useUpdateUserMutation,
  useLogoutMutation,
  useFetchProjectsByUserQuery, // Hook cho việc lấy dự án
  useCreateProjectMutation, // Hook cho việc tạo dự án mới
} = apiSlice;
