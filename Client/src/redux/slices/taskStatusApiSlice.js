import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URI = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URI,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const taskStatusApiSlice = createApi({
  baseQuery,
  tagTypes: ["TaskStatus"],
  endpoints: (builder) => ({
    fetchTaskStatusesByUser: builder.query({
      query: (userId) => `/task-statuses/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "TaskStatus", id: _id })),
              { type: "TaskStatus", id: "LIST" },
            ]
          : [{ type: "TaskStatus", id: "LIST" }],
    }),
    fetchTaskStatusById: builder.query({
      query: (id) => `/task-statuses/${id}`,
      providesTags: (result, error, id) => [{ type: "TaskStatus", id }],
    }),
    createTaskStatus: builder.mutation({
      query: (taskStatusData) => ({
        url: "/task-statuses/create",
        method: "POST",
        body: taskStatusData,
      }),
      invalidatesTags: [{ type: "TaskStatus", id: "LIST" }],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ id, taskStatusData }) => ({
        url: `/task-statuses/update/${id}`,
        method: "PUT",
        body: taskStatusData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "TaskStatus", id }],
    }),
    deleteTaskStatus: builder.mutation({
      query: (id) => ({
        url: `/task-statuses/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "TaskStatus", id }],
    }),
  }),
});

export const {
  useFetchTaskStatusesByUserQuery,
  useFetchTaskStatusByIdQuery,
  useCreateTaskStatusMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskStatusMutation,
} = taskStatusApiSlice;
