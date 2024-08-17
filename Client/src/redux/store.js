import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { userApiSlice } from "./slices/userAPISlice";
import { projectApiSlice } from "./slices/projectApiSlice";
import { taskApiSlice } from "./slices/taskApiSlice";
import { taskStatusApiSlice } from "./slices/taskStatusApiSlice";
import { workspaceApiSlice } from "./slices/workspaceApiSlice";

const store = configureStore({
  reducer: {
    [userApiSlice.reducerPath]: userApiSlice.reducer,
    [projectApiSlice.reducerPath]: projectApiSlice.reducer,
    [taskApiSlice.reducerPath]: taskApiSlice.reducer,
    [taskStatusApiSlice.reducerPath]: taskStatusApiSlice.reducer,
    [workspaceApiSlice.reducerPath]: workspaceApiSlice.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userApiSlice.middleware,
      projectApiSlice.middleware,
      taskApiSlice.middleware,
      taskStatusApiSlice.middleware,
      workspaceApiSlice.middleware
    ),
  devTools: true,
});

export default store;
