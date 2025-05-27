import express from "express";
import { isAdmin } from "../Middlewares/isAdmin.js";
import {
  changeActivity,
  create,
  getAll,
  getOne,
  getProductComments,
  remove,
  replyComment,
} from "../Controllers/CommentCn.js";
import { isLogin } from "../Middlewares/isLogin.js";
const commentRouter = express.Router();
commentRouter.route("/").get( getAll).post(isLogin, create);
commentRouter.route('/reply/:id').patch(isAdmin,replyComment)
commentRouter
  .route("/:id")
  .get(getOne)
  .get(getProductComments)
  .patch(isAdmin, changeActivity)
  .delete(isAdmin, remove);
export default commentRouter;
