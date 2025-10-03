import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


//routes import
import patientRoutes from './routes/patient.routes.js'
import providerRoutes from './routes/provider.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import contractRoutes from './routes/contract.routes.js';
import permissionRoutes from './routes/permission.routes.js';
import medicalRecordRoutes from './routes/medicalRecord.routes.js';
import chatRoutes from './routes/chat.routes.js';
import carePlanRoutes from './routes/carePlan.routes.js';

const app = express();

// CORS configuration for production and development
const allowedOrigins = [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // Alternative dev port
    'https://aurahealth101.vercel.app', // Your production frontend URL
    process.env.FRONTEND_URL, // Additional frontend URL from environment
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null, // Vercel preview URLs
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) { 
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        
        // For development, allow any localhost origin
        if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
            return callback(null, true);
        }
        
        // For production, be more strict
        console.log('🚫 CORS blocked origin:', origin);
        return callback(new Error('Not allowed by CORS'), false);
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200
}));


app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'))
app.use(cookieParser())



// app.post('/debug', (req, res) => {
//   console.log('🧪 DEBUG BODY:', req.body);
//   res.json({ received: req.body });
// });



//routes declaration
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/provider', providerRoutes);
app.use('/api/v1/appointment', appointmentRoutes);
app.use('/api/v1/contract', contractRoutes);
app.use('/api/v1/permission', permissionRoutes);
app.use('/api/v1/medical-record', medicalRecordRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/care-plan', carePlanRoutes);


export {app}
