import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useCreateWorkspaceMutation } from "../redux/slices/workspaceApiSlice";
import Button from "../components/Button";
import Textbox from "../components/Textbox";

const CreateWorkspace = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [createWorkspace, { isLoading }] = useCreateWorkspaceMutation();
  const navigate = useNavigate();

  const submitHandler = async (data) => {
    try {
      const newWorkspace = await createWorkspace(data).unwrap();
      navigate(`/workspaces/${newWorkspace._id}/projects`);
    } catch (error) {
      console.error("Workspace creation failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Textbox
        placeholder="Workspace Name"
        label="Name"
        register={register("name", { required: "Name is required!" })}
        error={errors.name ? errors.name.message : ""}
      />
      <Textbox
        placeholder="Workspace Description"
        label="Description"
        register={register("description")}
      />
      <Button
        type="submit"
        label={isLoading ? "Creating..." : "Create Workspace"}
      />
    </form>
  );
};

export default CreateWorkspace;
