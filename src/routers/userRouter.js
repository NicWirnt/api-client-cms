import express from "express";
import { encryptPassword, verifyPassword } from "../helper/bycrypt.js";
import {
  getUser,
  getUserByFilter,
  insertUser,
} from "../models/users/User.model.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await getUser();
    if (result) {
      return res.json({
        status: "success",
        message: "User successfully found",
        result,
      });
    }
    return res.json({
      status: "error",
      message: "Please try again later",
    });
  } catch (error) {
    next(error);
  }
});

//create user
router.post("/", async (req, res, next) => {
  try {
    const user = req.body;

    const { password } = user;
    const passwordEncrypt = encryptPassword(password);
    user.password = passwordEncrypt;

    const result = await insertUser(user);

    if (result) {
      return res.json({
        status: "success",
        message: "User successfully added",
      });
    }

    return res.json({
      status: "error",
      message: "Failed to create user, please try again",
    });
  } catch (error) {
    next(error);
  }
});

//login User
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByFilter({ email });
    console.log(user);
    if (user?._id) {
      const verifyUser = verifyPassword(password, user.password);
      if (verifyUser) {
        return res.json({
          status: "success",
          message: "user logged in successfully",
          user,
        });
      } else {
        return res.json({
          status: "error",
          message: "password doesn't match, please try again",
        });
      }
    }
    return res.json({
      status: "error",
      message: "User not found, please try again",
    });
  } catch (error) {
    next(error);
  }
});
export default router;
