import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    status: { type: Schema.Types.ObjectId, ref: "TaskStatus", required: true }, // một-nhiều với TaskStatus
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    due_date: { type: Date },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true }, // một-nhiều với Project
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // nhiều-nhiều với User
  },
  { timestamps: true }
);

// Middleware to update user task assignments
taskSchema.pre("save", async function (next) {
  if (this.isModified("users")) {
    const User = mongoose.model("User");
    const users = this.users;
    for (const userId of users) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { tasks: this._id },
      });
    }
  }
  next();
});

const Task = mongoose.model("Task", taskSchema);
export default Task;
