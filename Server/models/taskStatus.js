import mongoose from "mongoose";

const taskStatusSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
  },
  { timestamps: true }
);

export default mongoose.model("TaskStatus", taskStatusSchema);
