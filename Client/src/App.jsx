import React from "react";
import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";

// Import pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import User from "./pages/User";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import WorkSpaces from "./pages/WorkSpaces";
import Project from "./pages/Project";
import TaskDetail from "./pages/TaskDetail";
import Search from "./pages/Search";
import Notification from "./pages/Notification";
import AssignToMe from "./pages/AssignToMe";

const Layout = () => {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/log-in" state={{ from: location }} replace />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full md:w-1/6 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route
            index
            element={<Navigate to="/workspaces/project/dashboard" />}
          />
          <Route path="search" element={<Search />} />
          <Route path="notification" element={<Notification />} />
          <Route path="assign-to-me" element={<AssignToMe />} />
          <Route path="workspaces" element={<WorkSpaces />} />
          <Route path="space/space-setting" element={<WorkSpaces />} />
          <Route path="workspaces/project" element={<Project />} />
          <Route path="workspaces/add-project" element={<Project />} />
          <Route path="workspaces/project/dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Task />} />
          <Route path="tasks/:id" element={<TaskDetail />} />
          <Route path="to-do/:status" element={<Task />} />
          <Route path="in-progress/:status" element={<Task />} />
          <Route path="complete/:status" element={<Task />} />
          <Route path="user" element={<User />} />
        </Route>
        <Route path="log-in" element={<Login />} />
        <Route path="register" element={<Register />} />
      </Routes>
      <Toaster richColors />
    </>
  );
};

export default App;
