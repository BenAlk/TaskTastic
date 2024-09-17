import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

import { userRouter } from './routes/users.js'

dotenv.config({ path: '.env.local' })

const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD
const app = express()

app.use(express.json())
app.use(cors())

app.use("/auth", userRouter)

mongoose.connect(
    `mongodb+srv://benalkureishi:${MONGO_DB_PASSWORD}@tasktastic.qyi3u.mongodb.net/tasktastic?retryWrites=true&w=majority`,
)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB', err))

app.listen(3001, () => console.log('Server is running on port 3001'))
