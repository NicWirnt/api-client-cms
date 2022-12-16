import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: "inactive",
    },
    fName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "First name must be less than 20 characters"],
    },
    lName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "Last name must be less than 20 character"],
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Phone number must be at least 10 characters"],
      maxlength: [15, "Phone number must be less than 15 characters"],
    },
    email: {
      unique: true,
      index: 1,
      type: String,
      required: true,
      trim: true,
    },
    emailValidationCode: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", UserSchema);
