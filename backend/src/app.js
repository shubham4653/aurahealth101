import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(cors({
    orgin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: '16kb'}))
app.use(express.urlencoded({extended: true, limit: '16kb'}))
app.use(express.static('public'))
app.use(cookieParser())


//routes import
import patientRoutes from './routes/patient.routes.js'
import providerRoutes from './routes/provider.routes.js';



//routes declaration
app.use('/api/v1/patient', patientRoutes)
app.use('/api/v1/provider', providerRoutes)



export {app}