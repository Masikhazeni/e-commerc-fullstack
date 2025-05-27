// import mongoose from "mongoose";
// const commentSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//       required: [true, "content is required"],
//       trim: true,
//     },
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
// reply: {
//   type: String,
// },
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: [true, "ProductId is required"],

//     },
//     isActive: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );
// const Comment = mongoose.model("Comment", commentSchema);
// export default Comment;

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
