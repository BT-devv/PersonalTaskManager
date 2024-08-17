import { Routes, Route, Navigate, useLocation, Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useSelector } from "react-redux";
import Sidebar from "./components/Sidebar";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import WorkSpaces from "./pages/WorkSpaces";
import ProjectList from "./pages/ProjectList";
import ProjectDetail from "./pages/ProjectDetail";
import AddProject from "./pages/AddProject";
import Search from "./pages/Search";
import Notification from "./pages/Notification";
import AssignToMe from "./pages/AssignToMe";
import UserProfile from "./pages/User";
import WorkspaceList from "./pages/WorkspaceList";
import CreateWorkspace from "./pages/CreateWorkspace";

// Layout Component
function Layout() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return user ? (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <div className="w-full md:w-1/6 h-screen bg-white sticky top-0 hidden md:block">
        <Sidebar />
      </div>
      <div className="w-full md:w-5/6">
        <Outlet />
      </div>
    </div>
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

// Main App Component
function App() {
  return (
    <div>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Default redirect to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          {/* Dashboard */}
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Workspaces and Projects */}
          <Route path="/workspaces" element={<WorkSpaces />} />
          <Route
            path="/workspaces/:workspaceId/projects"
            element={<ProjectList />}
          />
          <Route
            path="/workspaces/:workspaceId/projects/:projectId"
            element={<ProjectDetail />}
          />
          <Route
            path="/workspaces/:workspaceId/projects/add"
            element={<AddProject />}
          />
          <Route path="/workspacesList" element={<WorkspaceList />} />{" "}
          {/* Workspace selection */}
          <Route path="/workspaces/create" element={<CreateWorkspace />} />{" "}
          {/* Create new workspace */}
          {/* Tasks */}
          <Route path="/projects/:projectId/tasks" element={<TaskList />} />
          <Route
            path="/projects/:projectId/tasks/:taskId"
            element={<TaskDetail />}
          />
          {/* Miscellaneous */}
          <Route path="/search" element={<Search />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/assign-to-me" element={<AssignToMe />} />
          <Route path="/user/:userId" element={<UserProfile />} />
        </Route>
      </Routes>
      <Toaster richColors />
    </div>
  );
}

export default App;
