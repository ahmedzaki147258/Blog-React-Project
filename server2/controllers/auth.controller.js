import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ status: 'fail', message: 'Incorrect data' });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) return res.status(401).json({ status: 'fail', message: 'Incorrect data' });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ status: 'success', token });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const register = async (req, res) => {
  try {
    await registerValidation.parseAsync(req.body);
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json({ status: 'success', data: newUser });
  } catch (err) {
    if (err.code === 11000 && err.keyPattern && err.keyPattern.username === 1) {
      res.status(409).json({ status: 'fail', message: 'Email already exists' });
    } else {
      res.status(422).json({ status: 'fail', message: err.errors || err.message });
    }
  }
};

export const me = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.status(200).json({ status: 'success', data: user });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.status(200).json({ status: 'success', message: 'Logged out' });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err.message });
  }
}
