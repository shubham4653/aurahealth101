import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


//routes import
import patientRoutes from './routes/patient.routes.js'
import providerRoutes from './routes/provider.routes.js';

const app = express();


app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));



app.use(express.json({limit: '16kb'}));
app.use(express.urlencoded({extended: true, limit: '16kb'}));
app.use(express.static('public'))
app.use(cookieParser())


// Simple test route
app.post('/api/v1/test', (req, res) => {
  console.log('--- TEST ROUTE HIT ---');
  console.log('Body:', req.body);
  res.status(200).json({ message: 'Test route is working!' });
});


// app.post('/debug', (req, res) => {
//   console.log('🧪 DEBUG BODY:', req.body);
//   res.json({ received: req.body });
// });







//routes declaration
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/provider', providerRoutes);



export {app}
