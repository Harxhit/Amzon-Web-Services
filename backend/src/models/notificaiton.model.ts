import mongoose, { Schema, Types } from "mongoose";

const notificationSchema = new Schema(
  {
    receiverId: { type: Types.ObjectId, ref: "User", required: true }, 
    senderId: { type: Types.ObjectId, ref: "User", required: true }, 

    type: {
      type: String,
      enum: ["follow", "like", "comment", "reply", "mention"],
      required: true
    },

    tweetId: { type: Types.ObjectId, ref: "Tweet", default: null }, 
    isRead: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
