import { useNavigate } from "react-router-dom";
import { useFetchWorkspacesByUserQuery } from "../redux/slices/workspaceApiSlice";
import Button from "../components/Button";
import { useSelector } from "react-redux";

const WorkspaceList = () => {
  const { user } = useSelector((state) => state.auth.user);
  const userId = user ? user._id : null;
  console.log("User object from Redux state:", user);
  console.log("User ID:", userId); // Kiểm tra xem userId có tồn tại hay không

  const {
    data: workspaces,
    isLoading,
    error,
  } = useFetchWorkspacesByUserQuery(userId);
  console.log("Workspaces data:", workspaces);

  const navigate = useNavigate();

  const handleSelectWorkspace = (workspaceId) => {
    navigate(`/workspaces/${workspaceId}/projects`); // Chuyển hướng tới trang dự án trong workspace đã chọn
  };

  const handleCreateWorkspace = () => {
    navigate("/workspaces/create"); // Chuyển hướng tới trang tạo workspace
  };

  if (isLoading) return <div>Loading workspaces...</div>;
  if (error) return <div>Error loading workspaces</div>;

  return (
    <div className="workspace-list-container">
      <h2>Select a Workspace</h2>
      <div className="workspace-list">
        {workspaces && workspaces.length > 0 ? (
          workspaces.map((workspace) => (
            <div key={workspace._id} className="workspace-item">
              <p>{workspace.name}</p>
              <Button
                label="Select"
                onClick={() => handleSelectWorkspace(workspace._id)}
              />
            </div>
          ))
        ) : (
          <p>No workspaces found.</p>
        )}
      </div>
      <Button
        label="Create New Workspace"
        onClick={handleCreateWorkspace}
        className="create-workspace-btn"
      />
    </div>
  );
};

export default WorkspaceList;
