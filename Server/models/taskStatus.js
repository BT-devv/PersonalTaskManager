import mongoose, { Schema } from "mongoose";

const taskStatusSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
  },
  { timestamps: true }
);

const TaskStatus = mongoose.model("TaskStatus", taskStatusSchema);
export default TaskStatus;
