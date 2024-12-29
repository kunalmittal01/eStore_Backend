import { uploadImage } from "../middleware/cloudinary.js";
import Product from "../model/product.js";

export const addProduct = async(req, res) => {
    try {
        req.body.image = await uploadImage(eeq.body.file);
        req.body.addedBy = req.user._id;
        const product = new Product(req.body);
        const newProduct = await product.save();
        res.status(201).json({message: "added successfully", data: newProduct});
    }
    catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json({status: 'success', data: products});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({message: 'Product not found'});
        res.json({status:'success', data: product});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true});
        if (!product) return res.status(404).json({message: 'Product not found'});
        res.json({status:'success', data: product});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({message: 'Product not found'});
        res.json({status:'success', message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}