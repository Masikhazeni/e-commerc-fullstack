import mongoose from "mongoose";
const commentSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required:[true,'userId is required']
    },
    content: {
      type: String,
      required: [true, "content is required"],
      maxlength: [150, "max length is 150 character"],
      //  trim:true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    reply: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
