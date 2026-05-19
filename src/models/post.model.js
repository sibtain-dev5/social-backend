import mongoose, { mongo, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    title: {
      type: String,
      required: false,
      index: true,
    },
    description: {
      type: String,
      length: 300,
    },
    image: {
      type: String, //cloudinary url
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
  },
  {
    timestamps: true,
  }
);

postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema);
