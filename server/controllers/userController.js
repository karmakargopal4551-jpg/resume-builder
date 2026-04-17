import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = generateToken(newUser._id);

        newUser.password = undefined;

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: newUser
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!user || !isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);
        user.password = undefined;

        return res.status(200).json({
            message: "Login successfully",
            token,
            user
        });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET USER
export const getUserById = async (req, res) => {
    try {
        const id = req.user.id;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.password = undefined;

        return res.status(200).json({ user });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};

// GET USER RESUMES
export const getUserResumes = async (req, res) => {
    try {
        const userId = req.user.id;

        const resumes = await Resume.find({ userId });

        return res.status(200).json({ resumes });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};