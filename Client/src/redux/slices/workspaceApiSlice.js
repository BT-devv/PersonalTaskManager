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

export const workspaceApiSlice = createApi({
  reducerPath: "workspaceApi",
  baseQuery,
  tagTypes: ["Workspace"],
  endpoints: (builder) => ({
    fetchWorkspacesByUser: builder.query({
      query: (userId) => `/workspaces/user/${userId}`,
      providesTags: (result, error, userId) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ _id }) => ({ type: "Workspace", id: _id })),
              { type: "Workspace", id: "LIST" },
            ]
          : [{ type: "Workspace", id: "LIST" }],
    }),
    fetchWorkspaceByUser: builder.query({
      query: ({ userId, workspaceId }) =>
        `/workspaces/user/${userId}/workspace/${workspaceId}`,
      providesTags: (result, error, { workspaceId }) => [
        { type: "Workspace", id: workspaceId },
      ],
    }),
    createWorkspace: builder.mutation({
      query: (workspaceData) => ({
        url: "/workspaces",
        method: "POST",
        body: workspaceData,
      }),
      invalidatesTags: [{ type: "Workspace", id: "LIST" }],
    }),
    updateWorkspace: builder.mutation({
      query: ({ id, workspaceData }) => ({
        url: `/workspaces/${id}`,
        method: "PUT",
        body: workspaceData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Workspace", id }],
    }),
    deleteWorkspace: builder.mutation({
      query: (id) => ({
        url: `/workspaces/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Workspace", id }],
    }),
  }),
});

export const {
  useFetchWorkspacesByUserQuery,
  useFetchWorkspaceByUserQuery,
  useCreateWorkspaceMutation,
  useUpdateWorkspaceMutation,
  useDeleteWorkspaceMutation,
} = workspaceApiSlice;
