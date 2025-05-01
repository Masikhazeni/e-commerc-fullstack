import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
import HandleERROR from './Utils/handleError.js'
import catchError from './Utils/catchError.js'
import userRouter from './Routes/user.js'
const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)


const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())
app.use(express.static('Public'))
app.use(('/api/user'),userRouter)



app.use('*',(req,res,next)=>{
    return next(new HandleERROR('route not found',404))
 })
 
 
 app.use(catchError)
 
export default app