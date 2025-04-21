import cookieParser from "cookie-parser";
import express from "express";
import cors from 'cors';
import connectDB from "./src/config/db.js";
import 'dotenv/config'
import userRouter from "./src/routes/userRoutes.js";
import sellerRouter from "./src/routes/sellerRoutes.js";
import connectCloudniary from "./src/config/CLOUDINARY.js";
import productRouter from "./src/routes/productRoutes.js";
import cartRouter from "./src/routes/cartRoutes.js";
import addressRouter from "./src/routes/addressroute.js";
import orderRouter from "./src/routes/orderroute.js";
import { stripeWebhooks } from "./src/controllers/orderController.js";


const app = express();
const port = process.env.PORT || 8000;

await connectDB();
await connectCloudniary();

//origns
const allowedOrigins = ['http://localhost:5173', 'https://grorcrey-backend.vercel.app']

app.post('/stripe', express.raw({type: 'application/json'}), stripeWebhooks)

//midleware config
app.use(express.json()); 
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get('/', (req, res)=> res.send("api is working"));
app.use('/api/user', userRouter)
app.use('/api/seller', sellerRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter)
app.use('/api/address', addressRouter)
app.use('/api/order', orderRouter)

app.listen(port, ()=>{
    console.log(`Server is running on http:localhost:${port}`)
})