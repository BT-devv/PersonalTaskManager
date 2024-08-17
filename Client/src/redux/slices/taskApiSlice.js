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

export const taskApiSlice = createApi({
  baseQuery,
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    fetchTasksByProject: builder.query({
      query: (projectId) => `/tasks/project/${projectId}`,
      providesTags: (result, error, projectId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Task", id: _id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    fetchTaskById: builder.query({
      query: (id) => `/tasks/${id}`,
      providesTags: (result, error, id) => [{ type: "Task", id }],
    }),
    createTask: builder.mutation({
      query: (taskData) => ({
        url: "/tasks/create",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation({
      query: ({ id, taskData }) => ({
        url: `/tasks/update/${id}`,
        method: "PUT",
        body: taskData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation({
      query: (id) => ({
        url: `/tasks/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Task", id }],
    }),
  }),
});

export const {
  useFetchTasksByProjectQuery,
  useFetchTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApiSlice;
