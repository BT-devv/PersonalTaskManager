import mongoose, { Schema } from "mongoose";

const workspaceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // nhiều-nhiều với User
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }], // một-nhiều với Project
  },
  { timestamps: true }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);
export default Workspace;
