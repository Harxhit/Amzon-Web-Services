import mongoose, { Schema , Types } from "mongoose";

const messageSchema = new Schema(
  {
    senderId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    receiverId: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },

    chatId: {
      type: String,
      required: true, 
    },  

    content: {
      type: String,
      required: true
    },

    isEdited: {
      type: Boolean,
      default: false
    },

    readAt: {
      type: Date,
      default: null
    },

    deliveredAt: {
      type: Date,
      default: null
    },

    status: {
      type: String,
      enum: ["send", "delivered", "read", "failed"],
      default: "send"
    }
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
