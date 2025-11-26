import mongoose, { Schema, Types, Document } from "mongoose";

export interface TweetDocument extends Document {
  author: Types.ObjectId;
  content: string;
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  isRetweet: boolean;
  retweetOf: Types.ObjectId | null;
  isReply: boolean;
  replyTo: Types.ObjectId | null;
}

const tweetSchema = new Schema<TweetDocument>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: function () {
        return !this.isRetweet;
      },
      trim: true,
      maxlength: 280,
    },

    likeCount: { 
      type: Number, 
      default: 0 
    },
    retweetCount: {
       type: Number, 
       default: 0 
      },
    replyCount: { 
      type: Number,
       default: 0 
      },

    isRetweet: { 
      type: Boolean,
       default: false
       },
    retweetOf: { 
      type: Schema.Types.ObjectId,
       ref: "Tweet",
        default: null
       },

    isReply: { 
      type: Boolean,
       default: false
       },
    replyTo: { type: Schema.Types.ObjectId,
       ref: "Tweet",
        default: null
       },
  },
  { timestamps: true }
);

const Tweet = mongoose.model<TweetDocument>("Tweet", tweetSchema);

export default Tweet;
