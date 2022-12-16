import express from "express";
import { getAllCategories } from "../models/category/Category.models.js";

const router = express.Router();

//return all active categories
router.get("/", async (req, res, next) => {
  try {
    const filter = { status: "active" };
    const result = await getAllCategories(filter);

    res.json({
      status: "success",
      message: "Categories result",
      result,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
