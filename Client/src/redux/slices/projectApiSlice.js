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

export const projectApiSlice = createApi({
  baseQuery,
  tagTypes: ["Project"],
  endpoints: (builder) => ({
    fetchProjectsByUser: builder.query({
      query: (userId) => `/projects/user/${userId}`,
      providesTags: (result, error, userId) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: "Project", id: _id })),
              { type: "Project", id: "LIST" },
            ]
          : [{ type: "Project", id: "LIST" }],
    }),
    fetchProjectById: builder.query({
      query: (id) => `/projects/${id}`,
      providesTags: (result, error, id) => [{ type: "Project", id }],
    }),
    createProject: builder.mutation({
      query: (projectData) => ({
        url: "/projects/create",
        method: "POST",
        body: projectData,
      }),
      invalidatesTags: [{ type: "Project", id: "LIST" }],
    }),
    updateProject: builder.mutation({
      query: ({ id, projectData }) => ({
        url: `/projects/update/${id}`,
        method: "PUT",
        body: projectData,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Project", id }],
    }),
    deleteProject: builder.mutation({
      query: (id) => ({
        url: `/projects/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Project", id }],
    }),
  }),
});

export const {
  useFetchProjectsByUserQuery,
  useFetchProjectByIdQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} = projectApiSlice;
