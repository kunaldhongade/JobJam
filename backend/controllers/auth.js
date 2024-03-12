import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from './../models/User.js';

// Register USER
export const register = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;// we are destructuring the req.body object
        // from frontend we have to send object that have these parameters

        // check if user already exists
        const salt = await bcrypt.genSalt(10);// this is going to generate salt random to encrypt our password

        const passwordHash = await bcrypt.hash(password, salt);// this is going to encrypt our password

        const newUser = new User({
            firstName,
            lastName,
            email,
            password: passwordHash,
            picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random() * 1000),
            impressions: Math.floor(Math.random() * 1000),
        });// we are creating new user object

        const savedUser = await newUser.save();// we are saving new user object to database

        res.status(201).json(savedUser);// we are sending saved user object to frontend
    } catch (error) {
        res.status(500).json({ error: error.message });// if there is an error we are sending error to frontend
    }
}

// Login In

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;// we are destructuring the req.body object

        const user = await User.findOne({ email: email });// we are finding user by email
        if (!user) return res.status(400).json({ msg: "User not found" });// if there is no user we are sending error to frontend

        const isMatch = await bcrypt.compare(password, user.password);// we are comparing password from frontend with password from database
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });// if passwords are not the same we are sending error to frontend
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);// we are creating token for user

        delete user.password;// we are deleting password from user object
        res.status(200).json({ user, token });// we are sending user object and token to frontend

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}