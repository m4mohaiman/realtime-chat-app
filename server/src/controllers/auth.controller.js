import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../lib/utils.js";

export const signup = async (req, res) => {
  const { email, fullName, password } = req.body;
  try {
    if (password.length < 6) {
      return res
        .status(400)
        .send("Password must be at least 6 characters long.");
    }
    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists." });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ email, fullName, password: hashedPassword });

    if (newUser) {
      //generate token
      generateToken(newUser._id, res);
      await newUser.save();
      res
        .status(201)
        .json({
          _id: newUser._id,
          fullName: newUser.fullName,
          email: newUser.email,
          message: "User created successfully.",
        });
    } else {
      console.log("Something went wrong.", error.message);
      res.status(400).json({ message: "Something went wrong." });
    }
  } catch (error) {
    console.log(error);
  }
};

export const login = (req, res) => {
  res.send("login route");
};

export const logout = (req, res) => {
  res.send("logout route");
};
