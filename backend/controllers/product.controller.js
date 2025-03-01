import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const getProducts = async (req,res) => {
    try{
        const products = await Product.find({});
        res.status(200).json({success: true ,data: products});
    }
    catch(error){
        console.log("Error in fetching products: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const createProducts = async (req,res) => {
    const product = req.body;

    if(!product.name || !product.price || !product.image){
        return res.status(400).send({ success: false, message: "Please Fill All Fields"});
    }

    const newProduct = new Product(product);

    try{
        await newProduct.save();
        res.status(201).json({success: true, data: newProduct});
    }
    catch(error){
        console.log("Error in creating product: ", error.message);
        res.status(500).json({success: false, message: "Server Error"});
    }
};

export const updateProduct = async (req, res) => {
    const { id } = req.params;
    const product = req.body;
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("Invalid ID:", id);
        return res.status(404).json({ success: false, message: "Invalid Product ID" });
    }
    try {
        const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
        if (!updatedProduct) {
            console.log("Product not found with ID:", id);
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        console.log("Product updated successfully:", updatedProduct);
        res.status(200).json({ success: true, data: updatedProduct });
    } catch (error) {
        console.error("Error in updating product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteProduct =  async (req, res) => {
    const { id } = req.params;
    console.log("Received DELETE request for ID:", id);

    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            console.log("Product not found with ID:", id);
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        console.log("Product deleted successfully:", deletedProduct);
        res.status(200).json({ success: true, message: "Product Deleted Successfully" });
    } catch (error) {
        console.error("Error in deleting product:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};