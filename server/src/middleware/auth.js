import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables')
    process.exit(1)
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(401).json({ message: "No token provided" })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.id
        req.isDemo = decoded.isDemo || false
        next()
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token expired" })
        }
        return res.status(401).json({ message: "Invalid token" })
    }
}

const preventDemoModification = (req, res, next) => {
    if (req.isDemo) {
        return res.status(403).json({
            message: "This action is not available in demo mode"
        })
    }
    next()
}

export { verifyToken, preventDemoModification }
