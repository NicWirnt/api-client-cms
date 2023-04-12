import express from "express";
import { encryptPassword, verifyPassword } from "../helper/bycrypt.js";
import {
  getUser,
  getUserByFilter,
  insertUser,
  updateUser,
} from "../models/users/User.model.js";
import { v4 as uuidv4 } from "uuid";
import {
  emailVerificaitonValidaiton,
  newUserValidation,
} from "../helper/joiValidation.js";
import { sendVerificationMail } from "../helper/emailHelper.js";
import isemail from "isemail";
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
router.post("/", newUserValidation, async (req, res, next) => {
  try {
    const user = req.body;

    const { password } = user;
    const passwordEncrypt = encryptPassword(password);
    user.emailValidationCode = uuidv4();

    user.password = passwordEncrypt;

    const result = await insertUser(user);

    if (result?._id) {
      //create Unique URL and send it to the user
      const url = `${process.env.ROOT_URL}/user/verify-email/?c=${result.emailValidationCode}&e=${result.email}`;

      sendVerificationMail({ fName: result.fName, url, email: result.email });
      return res.json({
        status: "success",
        message:
          "User successfully added, please check your email and verify your account to login",
      });
    }

    return res.json({
      status: "error",
      message: "Failed to create user, please try again",
    });
  } catch (error) {
    error.status = 500;
    if (error.message.includes("E11000 duplicate key")) {
      (error.message =
        "Email already exists, please login using your current email"),
        (error.status = 200);
    }
    next(error);
  }
});

//user emaili verificaiton
router.post(
  "/email-verification",
  emailVerificaitonValidaiton,
  async (req, res, next) => {
    try {
      const { email, emailValidationCode } = req.body;
      const result = await getUserByFilter({ email });

      if (result.emailValidationCode === emailValidationCode) {
        res.json({
          status: "success",
          message: "Your email has been verified. You may login now",
        });
        const update = { status: "active", emailValidationCode: "" };
        const userVerified = await updateUser({ email }, update);
        return;
      }
      res.json({
        status: "error",
        message: "Invalid or expired verificaiton link",
      });
    } catch (error) {
      next(error);
    }
  }
);

//login User
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await getUserByFilter({ email });

    if (user?._id) {
      if (user?.status === "active") {
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
      } else {
        return res.json({
          status: "error",
          message: "user email have not been verified, please check your email",
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
