import express from "express";
import upload from "../config/multer.js";
import authSeller from "../middleware/authseller.js";
import { addProduct, changeStock, productById, productList } from "../controllers/productControler.js";

const productRouter = express.Router();

productRouter.post('/add', upload.array(["images"]), authSeller, addProduct);
productRouter.get('/list', productList);
productRouter.get('/id', productById);
productRouter.post('/stock',authSeller, changeStock);

export default productRouter;