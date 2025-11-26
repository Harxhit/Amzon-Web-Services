import mongoose, { Schema, Types } from "mongoose";

const likeSchema = new Schema({
  userId: {
     type: Types.ObjectId,
      ref: "User", 
      required: true
     },
  tweetId: { 
    type: Types.ObjectId, 
    ref: "Tweet",
     required: true 
    }
}, { timestamps: true });

const LikeModel = mongoose.model("Like", likeSchema);
export default LikeModel