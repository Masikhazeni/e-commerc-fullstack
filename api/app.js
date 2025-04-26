import express from 'express'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import cors from 'cors'
const __filename=fileURLToPath(import.meta.url)
export const __dirname=path.dirname(__filename)


const app=express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())




export default app