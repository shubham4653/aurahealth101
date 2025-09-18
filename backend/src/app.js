import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


//routes import
import patientRoutes from './routes/patient.routes.js'
import providerRoutes from './routes/provider.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';

const app = express();

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Add a generic logging middleware to catch all requests
app.use((req, res, next) => {
    console.log(`[DEBUG] Request received: ${req.method} ${req.originalUrl}`);
    next();
});



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



export {app}
