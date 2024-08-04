import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: Schema.Types.ObjectId, ref: "TaskStatus", required: true },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    due_date: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

taskSchema.pre("save", async function (next) {
  if (this.isModified("users")) {
    const User = mongoose.model("User");
    const users = this.users;
    for (const userId of users) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { assignedTasks: this._id },
      });
    }
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
