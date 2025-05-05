import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import catchError from "./Utils/catchError.js";
import HandleERROR from "./Utils/handleError.js";
import cors from "cors";
import uploadRouter from './Routes/Upload.js'
import { isLogin } from "./Middlewares/isLogin.js";
import addressRouter from "./Routes/Address.js";
import userRouter from "./Routes/User.js";
import sliderRouter from "./Routes/Slider.js";
import categoryRouter from "./Routes/Category.js";
import productRouter from "./Routes/Products.js";
import productVariantRouter from "./Routes/ProductVariant.js";


const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));
app.use('/api/address',isLogin,addressRouter)
app.use('/api/user',userRouter)
app.use('/api/slider',sliderRouter)
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use('/api/product-variant',productVariantRouter)
app.use('/api/upload',uploadRouter)

app.use("*", (req, res, next) => {
  next(new HandleERROR("Route not Found", 404));
});
app.use(catchError);

export default app;
