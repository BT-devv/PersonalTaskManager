import mongoose, { Schema } from "mongoose";

const projectSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    }, // một-nhiều với Workspace
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // nhiều-nhiều với User
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // một-nhiều với Task
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
