import express from "express";
import expressAsyncHandler from "express-async-handler";
import { isAuth, isAdmin } from "../utils";
import Product from "../models/productModel";

const productRouter = express.Router();
productRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  })
);
productRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.send(product);
  })
);

productRouter.post(
  "/",
  // isAuth,
  // isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = new Product({
      name: "Glorious Dress",
      description:
        " This is the best suit for all occasions.. Having a white glories color it is impressive ",
      category: "Shirts",
      brand: "Khadi",
      image:
        "https://img5.cfcdn.club/8a/e6/8ab8e6b4ae2344f51603ba13a1e66ee6_350x350.jpg",
      price: 5000,
      countInStock: 0,
      rating: 4.5,
      numReviews: 44,
    });
    const createdProduct = await product.save();
    if (createdProduct) {
      res
        .status(201)
        .send({ message: "Product Created", product: createdProduct });
    } else {
      res.status(500).send({ message: "Error in creating product" });
    }
  })
);
productRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (product) {
      product.name = req.body.name;
      product.price = req.body.price;
      product.image = req.body.image;
      product.brand = req.body.brand;
      product.category = req.body.category;
      product.countInStock = req.body.countInStock;
      product.description = req.body.description;
      const updatedProduct = await product.save();
      if (updatedProduct) {
        res.send({ message: "Product Updated", product: updatedProduct });
      } else {
        res.status(500).send({ message: "Error in updaing product" });
      }
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);
productRouter.delete(
  "/:id",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
      const deletedProduct = await product.remove();
      res.send({ message: "Product Deleted", product: deletedProduct });
    } else {
      res.status(404).send({ message: "Product Not Found" });
    }
  })
);

export default productRouter;
