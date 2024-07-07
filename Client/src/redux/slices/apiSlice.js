import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const APT_URI = "http://localhost:8800/api";

const baseQuery = fetchBaseQuery({ baseUrl: APT_URI });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});
