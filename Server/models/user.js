import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    workspaces: [{ type: Schema.Types.ObjectId, ref: "Workspace" }], // nhiều-nhiều với Workspace
    projects: [{ type: Schema.Types.ObjectId, ref: "Project" }], // nhiều-nhiều với Project
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }], // nhiều-nhiều với Task
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

// Encrypt password before saving user to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
