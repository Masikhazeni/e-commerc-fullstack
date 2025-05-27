import express from 'express';
import { isAdmin } from '../Middlewares/isAdmin.js';
import {
  getAll,
  getFavorites,
  getOne,
  toggleFavoriteProduct,
  update
} from '../Controllers/UserCn.js';
import { isLogin } from '../Middlewares/isLogin.js';

const userRouter = express.Router();

// 🟢 ابتدا مسیرهای ثابت
userRouter
  .route('/favorites')
  .get(isLogin, getFavorites)
  .post(isLogin, toggleFavoriteProduct);

// 🟢 بعد مسیر عمومی
userRouter.route('/')
  .get(isAdmin, getAll);

// 🟢 در نهایت مسیر داینامیک
userRouter.route('/:id')
  .get(isLogin, getOne)
  .patch(isLogin, update);

export default userRouter;



// import express from 'express'
// import { isAdmin } from '../Middlewares/isAdmin.js'
// import { getAll, getFavorites, getOne, toggleFavoriteProduct, update } from '../Controllers/UserCn.js'
// import { isLogin } from '../Middlewares/isLogin.js'
// const userRouter=express.Router()
// userRouter.route('/').get(isAdmin,getAll)
// userRouter.route('/:id').get(isLogin,getOne).patch(isLogin,update)
// userRouter
//   .route('/favorites')
//   .get( getFavorites)
//   .post( toggleFavoriteProduct);
// export default userRouter


// import express from 'express';
// import { isAdmin } from '../Middlewares/isAdmin.js';
// import { 
//   getAll, 
//   getOne, 
//   update, 
//   toggleFavorite,
//   getFavorites 
// } from '../Controllers/UserCn.js';
// import { isLogin } from '../Middlewares/isLogin.js';

// const userRouter = express.Router();

// // Routes for admin
// userRouter.route('/')
//   .get(isAdmin, getAll);

// // Routes for user profile
// userRouter.route('/:id')
//   .get(isLogin, getOne)
//   .patch(isLogin, update);

// // New routes for favorites
// userRouter.route('/toggle-favorite/:productId')
//   .patch(isLogin, toggleFavorite);

// userRouter.route('/favorites')
//   .get(isLogin, getFavorites);

// export default userRouter;



// import express from 'express';
// import { isAdmin } from '../Middlewares/isAdmin.js';
// import { 
//   getAll, 
//   getOne, 
//   update, 
//   toggleFavorite,
//   getFavorites 
// } from '../Controllers/UserCn.js';
// import { isLogin } from '../Middlewares/isLogin.js';

// const userRouter = express.Router();

// // Routes for admin
// userRouter.route('/')
//   .get(isAdmin, getAll);

// // 🔁 Routes for favorites (must be above /:id)
// userRouter.route('/toggle-favorite/:productId')
//   .patch(isLogin, toggleFavorite);

// userRouter.route('/favorites')
//   .get(isLogin, getFavorites);

// // Routes for user profile
// userRouter.route('/:id')
//   .get(isLogin, getOne)
//   .patch(isLogin, update);

// export default userRouter;
