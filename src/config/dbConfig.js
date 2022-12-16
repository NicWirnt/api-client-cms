import mongoose from "mongoose";

export const dbConnect = () => {
  try {
    const con = mongoose.connect(process.env.MONGO_CLIENT);

    con && console.log("mongoDB connected");
  } catch (error) {
    console.log(error);
  }
};
