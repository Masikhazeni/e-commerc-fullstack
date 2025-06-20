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
import variantRouter from "./Routes/Variant.js";
import commentRouter from "./Routes/Comment.js";
import brandRouter from "./Routes/Brand.js";
import discountRouter from "./Routes/DiscountCode.js";
import searchRouter from "./Routes/Search.js";
import cartRouter from "./Routes/Cart.js";
import authRouter from "./Routes/Auth.js";
import reportRouter from "./Routes/Report.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express'

const option={
  definition:{
    openapi:'3.0.0',
    info:{
      title:'Raya Plus E-commerce',
      version:'1.0.0',
      description:'final projecct'
    },
    server:[
      {
        url:'http://localhost:5000'
      }
    ]

  },
  apis:['./Routes/*.js']
}

const swaggerSpec=swaggerJSDoc(option)



const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("Public"));
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
app.use('/api/auth',authRouter)
app.use('/api/address',isLogin,addressRouter)
app.use('/api/user',userRouter)
app.use('/api/slider',sliderRouter)
app.use('/api/category',categoryRouter)
app.use('/api/product',productRouter)
app.use('/api/product-variant',productVariantRouter)
app.use('/api/variant',variantRouter)
app.use('/api/comment',commentRouter)
app.use('/api/brand',brandRouter)
app.use('/api/discount',discountRouter)
app.use('/api/search',searchRouter)
app.use('/api/cart',isLogin,cartRouter)
app.use('/api/report', reportRouter);
app.use('/api/upload',uploadRouter)

app.use("*", (req, res, next) => {
  next(new HandleERROR("Route not Found", 404));
});
app.use(catchError);

export default app;
