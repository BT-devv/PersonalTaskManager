import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    team: [{ type: Schema.Types.ObjectId, ref: "User" }], // nhiều-nhiều với User
    text: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task" }, // liên kết với Task
    notiType: { type: String, enum: ["alert", "message"], default: "alert" },
    isRead: [{ type: Schema.Types.ObjectId, ref: "User" }], // User nào đã đọc
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);
export default Notice;
