import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./pages/Login";
import User from "./pages/User";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import WorkSpaces from "./pages/WorkSpaces";
import Project from "./pages/Project";
import TaskDetail from "./pages/TaskDetail";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Search from "./pages/Search";
import Notification from "./pages/Notification";
// import Navbar from "./components/Navbar";
import AssignToMe from "./pages/AssignToMe";
// import { useState } from "react";

function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="w-full h-screen overflow-hidden flex flex-col md:flex-row">
      <div className="w-80 h-screen bg-[#ffffff] sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      {/* <MobileSidebar/> */}
      <div className="flex-1  ">
        {/* <Navbar /> */}
        <div className=" 2x1:px-10 ">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <Navigate to="/log-in" state={{ from: location }} replace />
  );
}

function App() {
  return (
    <div>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={<Navigate to="/workspaces/project/dashboard" />}
          />
          <Route path="/search" element={<Search />} />
          <Route path="/notification" element={<Notification />} />
          <Route path="/assign-to-me" element={<AssignToMe />} />
          <Route path="/workspaces" element={<WorkSpaces />} />
          <Route path="/space/space-setting" element={<WorkSpaces />} />
          <Route path="/workspaces/project/" element={<Project />} />
          <Route path="/workspaces/add-project/" element={<Project />} />
          <Route path="/workspaces/project/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Task />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/to-do/:status" element={<Task />} />
          <Route path="/in-progress/:status" element={<Task />} />
          <Route path="/complete/:status" element={<Task />} />
          <Route path="/user" element={<User />} />
        </Route>
        <Route path="/log-in" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <Toaster richColors />
    </div>
  );
}

export default App;
