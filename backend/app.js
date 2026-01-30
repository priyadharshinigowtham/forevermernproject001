import express from 'express'
import cors from 'cors'
import 'dotenv/config'

import connectDB from './config/mongodb.js'
import './config/cloudinary.js'

import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'

const app = express()

// DB connection
connectDB()

// middlewares
app.use(express.json())
app.use(cors())

// routes (NO /api here)
app.use('/user', userRouter)
app.use('/product', productRouter)
app.use('/cart', cartRouter)
app.use('/order', orderRouter)

// health check (NO /api here)
app.get('/health', (req, res) => {
  res.json({ message: 'API Working' })
})

export default app
