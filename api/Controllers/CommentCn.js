import Comment from "../Models/CommentMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import jwt from 'jsonwebtoken';

export const getOne = catchAsync(async (req, res, next) => {
  let role = null;
  if (req?.headers?.authorization) {
    role = jwt?.verify(req?.headers?.authorization.split(' ')[1], process.env.JWT_SECRET).role;
  }
  
  const features = new ApiFeatures(Comment, req.query, role)
    .addManualFilters({ productId: req.params.id })
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "username fullname phoneNumber" },
      { path: "productId" },
    ]);

  const data = await features.execute();
  return res.status(200).json(data);
});

export const replyComment = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  const { reply } = req.body;
  comment.reply = reply;
  const newComment = await comment.save();
  return res.status(200).json({
    success: true,
    data: newComment,
    message: "Comment Reply Successfully"
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const features = new ApiFeatures(Comment, req?.query, req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate([
      { path: "userId", select: "username fullname phoneNumber" },
      { path: "productId" },
    ]);
  
  const data = await features.execute();
  return res.status(200).json(data);
});

export const getProductComments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comments = await Comment.find({
    $and: [{ productId: id }, { isActive: true }],
  }).populate('userId', 'username fullname phoneNumber');
  
  return res.status(200).json({
    success: true,
    data: comments,
  });
});

export const create = catchAsync(async (req, res, next) => {
  const userId  = req.userId;
  const comment = await Comment.create({ ...req.body, userId });
  return res.status(201).json({
    success: true,
    data: comment,
    message: "Comment Created successfully",
  });
});

export const changeActivity = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const comment = await Comment.findById(id);
  comment.isActive = !comment.isActive;
  const newComment = await comment.save();
  return res.status(200).json({
    success: true,
    data: newComment,
    message: "change activity successfully",
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  await Comment.findByIdAndDelete(id);
  return res.status(200).json({
    success: true,
    message: "Comment remove successfully",
  });
});


















