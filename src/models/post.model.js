import mongoose, { mongo, Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"


const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: false,
      index: true,
    },
    description: {
      type: String,
      maxlength: [1000, "Post content cannot exceed 1000 characters"]
    },
    image: {
      type: String, //cloudinary url
    },
        author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    like: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdAt:{
      type: Date,
      default: Date.now
    },
    likesCount: {
        type: Number,
        default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ createdAt: -1 });

// Update likes count when likes array changes
postSchema.pre("save", function(next){
  this.likesCount = this.like.length;
  next();

})


postSchema.plugin(mongooseAggregatePaginate)

export const Post = mongoose.model("Post", postSchema);
