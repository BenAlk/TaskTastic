import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { authRouter } from './routes/auth.js'
import { userRouter } from './routes/users.js'
import { projectRouter } from './routes/projects.js'
import { taskRouter } from './routes/tasks.js'
import { messageRouter } from './routes/messages.js'

dotenv.config({ path: '.env.local' })
const MONGO_DB_PASSWORD = process.env.MONGO_DB_PASSWORD

const app = express()
app.use(express.json())

app.use(cors({
    origin: ['https://tasktastic-testing.netlify.app', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/projects", projectRouter)
app.use("/tasks", taskRouter)
app.use("/messages", messageRouter)

mongoose.connect(
    `${MONGO_DB_PASSWORD}`,
)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log('Error connecting to MongoDB', err))

app.listen(3001, () => console.log('Server is running on port 3001'))
