import User from "../Models/UserMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import mongoose from "mongoose";

export const getAll = catchAsync(async(req, res, next) => {
    const features = new ApiFeatures(User,req.query,req?.role)
    .filter()
    .sort()
    .limitFields()
    .paginate()
    .populate()
    const data=await features.execute()
    return res.status(200).json(data);
});
export const getOne = catchAsync(async(req, res, next) => {
    const {id}=req.params
    if(req.role!='admin'&& req.userId!=id){
        return next(new HandleERROR("You Don't have a permission",401))
    }
    const user=await User.findById(id)
    return res.status(200).json({
        success:true,
        data:user
    })
});





export const update = catchAsync(async(req, res, next) => {
    const { id } = req.params;

    if (req.role !== 'admin' && req.userId !== id) {
        return next(new HandleERROR("You don't have permission", 401));
    }

    const { fullname = null, username = null, role = null, favoriteProduct = null } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return next(new HandleERROR("User not found", 404));
    }

    user.fullname = fullname || user.fullname;
    user.username = username || user.username;

    if (req.role === 'admin' && role) {
        user.role = role;
    }

    // ✔️ بروزرسانی موردعلاقه‌ها
    if (favoriteProduct && mongoose.Types.ObjectId.isValid(favoriteProduct)) {
        const index = user.favoriteProduct.findIndex(
            (prodId) => prodId.toString() === favoriteProduct
        );

        if (index === -1) {
            user.favoriteProduct.push(favoriteProduct); // ➕ اضافه کن
        } else {
            user.favoriteProduct.splice(index, 1); // ➖ حذف کن
        }
    }

    if (user.fullname && user.password && user.username) {
        user.isComplete = true;
    }

    const newUser = await user.save();

    return res.status(200).json({
        success: true,
        data: newUser
    });
});



export const getFavorites = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  
  const user = await User.findById(userId).populate({
    path: 'favoriteProduct',
    select: 'title defaultProductVariantId imagesUrl'
  });

  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  return res.status(200).json({
    success: true,
    data: user.favoriteProduct
  });
});

export const toggleFavoriteProduct = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { productId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new HandleERROR("Invalid product ID", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new HandleERROR("User not found", 404));
  }

  // جلوگیری از ارور toString روی null
  const index = user.favoriteProduct.findIndex(
    (id) => id && id.toString() === productId
  );

  let action = "";
  if (index === -1) {
    user.favoriteProduct.push(productId);
    action = "added";
  } else {
    user.favoriteProduct.splice(index, 1);
    action = "removed";
  }

  // حذف آیتم‌های null
  user.favoriteProduct = user.favoriteProduct.filter((id) => id);

  await user.save();

  return res.status(200).json({
    success: true,
    message: `Product successfully ${action} from favorites`,
    data: user.favoriteProduct,
  });
});



















