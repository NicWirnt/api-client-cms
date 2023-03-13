import express from "express";
import {
  getAllCategories,
  getCategories,
  getCategory,
} from "../models/category/Category.models.js";
import { getMultipleProducts } from "../models/product/Product.model.js";

const router = express.Router();

//return all active categories
router.get("/:_id?", async (req, res, next) => {
  try {
    const { _id } = req.params;
    const filter = { status: "active" };

    const result = _id
      ? await getMultipleProducts({ status: "active", catId: _id })
      : await getCategories(filter);

    if (_id) {
      const cat = await getCategory({ status: "active", _id });
      const { catName } = cat;
      return res.json({
        status: "success",
        message: "Categories result",
        result,
        catName,
      });
    }
    return res.json({
      status: "success",
      message: "Categories result",
      result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
