import "dotenv/config";

import express from "express";

const app = express();

import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

const PORT = process.env.PORT || 5000;

//SERVER USE MIDDLEWARE
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

import { dbConnect } from "./src/config/dbConfig.js";
dbConnect();

// ROUTES
import categoryRouter from "./src/routers/categoriesRouter.js";
import userRouter from "./src/routers/userRouter.js";
import productRouter from "./src/routers/productsRouter.js";
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);

app.get("/", (req, res) => {
  res.json({
    message: "You reached the client API",
  });
});

app.use((error, req, res, next) => {
  res.status(error.status || 400);

  res.json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (err) => {
  err
    ? console.log(err)
    : console.log(`Server is running on http://localhost:${PORT}`);
});
