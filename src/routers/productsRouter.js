import express from "express";
import { getAllProducts, getProduct } from "../models/product/Product.model.js";

const router = express.Router();

router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;

    const result = _id ? await getProduct({ _id }) : await getAllProducts();

    return res.json({
      status: "success",
      message: "Products list",
      result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
