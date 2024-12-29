import express from 'express';
import upload from '../middleware/multer.js';
import { addProduct, deleteProduct, getProducts, getSingleProduct, updateProduct } from '../controller/product.js';
import { verifyCookies } from '../middleware/protectedRoute.js';
const productRouter = express.Router();

productRouter.post('/add', verifyCookies, upload.single('image'), addProduct)
productRouter.get('/getall', getProducts);
productRouter.get('/get/:id', getSingleProduct);
productRouter.put('/update/:id', verifyCookies, updateProduct);
productRouter.delete('/delete/:id', verifyCookies, deleteProduct);
export default productRouter;