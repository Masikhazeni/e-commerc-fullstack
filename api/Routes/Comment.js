// import express from "express";
// import { isAdmin } from "../Middlewares/isAdmin.js";
// import {
//   changeActivity,
//   create,
//   getAll,
//   getOne,
//   getProductComments,
//   remove,
//   replyComment,
// } from "../Controllers/CommentCn.js";
// import { isLogin } from "../Middlewares/isLogin.js";
// const commentRouter = express.Router();
// commentRouter.route("/").get(isAdmin, getAll).post(isLogin, create);
// commentRouter.route('/reply/:id').patch(isAdmin,replyComment)
// commentRouter
//   .route("/:id")
//   .get(getOne)
//   .get(getProductComments)
//   .patch(isAdmin, changeActivity)
//   .delete(isAdmin, remove);
// export default commentRouter;

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

// همه کامنت‌ها (فقط برای ادمین)
commentRouter.route("/").get(isAdmin, getAll).post(isLogin, create);

// پاسخ به کامنت (فقط ادمین)
commentRouter.route("/reply/:id").patch(isAdmin, replyComment);

// گرفتن کامنت‌های یک محصول خاص (کاربرد در فرانت)
commentRouter.get("/product/:id", getProductComments);

// عملیات روی یک کامنت خاص
commentRouter
  .route("/:id")
  .get(getOne)
  .patch(isAdmin, changeActivity)
  .delete(isAdmin, remove);

export default commentRouter;

