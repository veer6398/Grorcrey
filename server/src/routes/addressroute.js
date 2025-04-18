import express from "express";
import authUser from "../middleware/authMiddleware.js";
import { addAddress, getAddress } from "../controllers/addresscontroller.js";

const addressRouter = express.Router();

addressRouter.post('/add',authUser, addAddress);
addressRouter.get('/get',authUser, getAddress);

export default addressRouter