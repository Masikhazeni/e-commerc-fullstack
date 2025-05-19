import User from "../Models/UserMd.js";
import ApiFeatures from "../Utils/apiFeatures.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";

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
// export const update = catchAsync(async(req, res, next) => {
//     const {id}=req.params
//     if(req.role!='admin'&& req.userId!=id){
//         return next(new HandleERROR("You Don't have a permission",401))
//     }
//     const {fullname=null,username=null,role=null,favoriteProduct=null}=req.body

//     const user=await User.findById(id)
//     user.fullname=fullname || user?.fullname
//     user.username=username || user?.username
//     const existProduct=user?.favoriteProduct.map(e=>e==favoriteProduct)
//     if(existProduct){
//         return next( new HandleERROR("You alredy added this product",401))
//     }
//     user.favoriteProduct=user.favoriteProduct.push(favoriteProduct)
//     if(req.role=='admin' && role){
//         user.role=role
//     }
//     if(user.fullname && user.password && user.username){
//         user.isComplete=true
//     }
//     const newUser=await user.save()
//     return res.status(200).json({
//         success:true,
//         data:newUser
//     })
// });

export const update = catchAsync(async(req, res, next) => {
    const {id} = req.params;
    
    // بررسی مجوزهای دسترسی
    if(req.role !== 'admin' && req.userId !== id){
        return next(new HandleERROR("You don't have permission", 401));
    }
    
    const {fullname=null, username=null, role=null, favoriteProduct=null} = req.body;
    
    // پیدا کردن کاربر و بررسی وجود آن
    const user = await User.findById(id);
    if(!user) {
        return next(new HandleERROR("User not found", 404));
    }
    
    // آپدیت فیلدهای اصلی
    if(fullname !== undefined) user.fullname = fullname;
    if(username !== undefined) user.username = username;
    
    // مدیریت لیست محصولات مورد علاقه
    if(favoriteProduct !== undefined) {
        // بررسی وجود محصول در لیست علاقه‌مندی‌ها
        const productExists = user.favoriteProduct.some(
            productId => productId.equals(favoriteProduct)
        );
        
        if(productExists) {
            return next(new HandleERROR("You already added this product", 400));
        }
        
        // اضافه کردن محصول جدید
        user.favoriteProduct.push(favoriteProduct);
    }
    
    // آپدیت نقش کاربر (فقط برای ادمین)
    if(req.role === 'admin' && role !== undefined) {
        user.role = role;
    }
    
    // بررسی تکمیل بودن پروفایل
    if(user.fullname && user.password && user.username) {
        user.isComplete = true;
    }
    
    // ذخیره تغییرات
    const updatedUser = await user.save();
    
    return res.status(200).json({
        success: true,
        data: updatedUser
    });
});
