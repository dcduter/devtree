import { CorsOptions } from 'cors'

export const corsConfig : CorsOptions = {
    origin: function(origin, callback) {
        const whiteList = []

        // Add frontend URL if it exists
        if (process.env.FRONTEND_URL) {
            whiteList.push(process.env.FRONTEND_URL)
        }

        // Add common development URLs
        if (process.env.NODE_ENV !== 'production') {
            whiteList.push(
                'http://localhost:3000',
                'http://localhost:5173',
                'http://localhost:4173',
                'http://127.0.0.1:3000',
                'http://127.0.0.1:5173'
            )
        }

        // Allow API testing when --api flag is used
        if (process.argv[2] === '--api') {
            return callback(null, true)
        }

        // Allow requests with no origin (mobile apps, same origin, Postman, etc.)
        if (!origin) {
            return callback(null, true)
        }

        // Check if origin is in whitelist
        if (whiteList.includes(origin)) {
            callback(null, true)
        } else {
            console.log(`CORS blocked origin: ${origin}`)
            console.log(`Allowed origins: ${whiteList.join(', ')}`)
            callback(new Error('Not allowed by CORS'))
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}