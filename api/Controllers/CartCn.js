import Cart from "../Models/CartMd.js";
import ProductVariant from "../Models/ProductVariantMd.js";
import catchAsync from "../Utils/catchAsync.js";

export const add = catchAsync(async (req, res, next) => {
  const { productVariantId, productId, categoryId,quantity} = req?.body;
  let add = false;
  const pr = await ProductVariant.findById(productVariantId);
  const userId = req.userId;
  const cart = await Cart.findOne({ userId });
  cart.items = cart.items.map((item) => {
    if (item.productVariantId.toString() == productVariantId) {
      item.quantity = item.quantity + quantity;
      cart.totalPrice = cart.totalPrice + item.finalPrice*quantity;
      add = true;
    }
    return item;
  });
  if (!add) {
    cart.items.push({
      productVariantId,
      productId,
      categoryId,
      quantity,
      finalPrice: pr.priceAfterDiscount,
    });
    cart.totalPrice += +pr.priceAfterDiscount *quantity;
  }
  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: "add to cart successfully",
  });
});

export const remove = catchAsync(async (req, res, next) => {
  const { productVariantId, removeAll } = req?.body;
  const userId = req.userId;
  const cart = await Cart.findOne({ userId });

  cart.items = cart.items.filter((item) => {
    if (item.productVariantId.toString() == productVariantId) {
      if (removeAll || item.quantity === 1) {
        cart.totalPrice -= item.finalPrice * item.quantity;
        return false; // حذف کامل
      } else {
        item.quantity -= 1;
        cart.totalPrice -= item.finalPrice;
      }
    }
    return true;
  });

  const newCart = await cart.save();
  return res.status(200).json({
    success: true,
    data: newCart,
    message: removeAll ? "item deleted successfully" : "item removed successfully",
  });
});



export const clear = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const cart = await Cart.findOneAndUpdate(
    { userId },
    { items: [], totalPrice: 0 },
    { new: true, runValidators: true }
  );
  return res.status(200).json({
    success: true,
    data: cart,
    message: "cart is clear",
  });
});
export const getUserCart = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const cart = await Cart.findOne({ userId }).populate('items.productId items.productVariantId')
  return res.status(200).json({
    success: true,
    data: cart,
  });
});
