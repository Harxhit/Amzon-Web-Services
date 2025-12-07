import mongoose, { Schema, Types, Document } from "mongoose";

export interface CommentDocument extends Document {
  tweetId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  likes: number;
}

const commentSchema = new Schema<CommentDocument>(
  {
    tweetId: {
      type: Schema.Types.ObjectId,
      ref: "Tweet",
      required: true
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 280
    },
    
  },
  { timestamps: true }
);

const Comment = mongoose.model<CommentDocument>("Comment", commentSchema);

export default Comment;
