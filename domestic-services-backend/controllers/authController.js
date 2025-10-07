
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Worker from "../models/Worker.js";
import crypto from "crypto";
import nodemailer from "nodemailer";

const signToken = (user) =>
  jwt.sign(
    { user: { id: user._id, role: user.role, name: user.name, email: user.email } },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// In-memory store for reset tokens (for demo; use DB/Redis in production)
const resetTokens = {};

// Configure nodemailer (for demo, use ethereal)
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.ETHEREAL_USER,
    pass: process.env.ETHEREAL_PASS,
  },
});

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "No user with that email" });
    const token = crypto.randomBytes(32).toString("hex");
    resetTokens[token] = { userId: user._id, expires: Date.now() + 1000 * 60 * 15 };
    // Send email (simulate)
    const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${token}`;
    await transporter.sendMail({
      from: 'no-reply@domesticservices.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Reset your password: ${resetUrl}`,
      html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 15 minutes.</p>`
    });
    res.json({ message: "Password reset link sent to your email." });
  } catch (err) {
    console.error("Password reset request error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;
  try {
    const data = resetTokens[token];
    if (!data || data.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
    const user = await User.findById(data.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = password;
    await user.save();
    delete resetTokens[token];
    res.json({ message: "Password has been reset successfully." });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    // Check if user/worker already exists in either collection
    const existingUser = await User.findOne({ email });
    const existingWorker = await Worker.findOne({ email });

    if (existingUser || existingWorker) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let user;
    if (role === 'worker') {
      // Create worker in separate collection
      user = new Worker({
        name,
        email,
        password,
        role: 'worker',
        phone: req.body.mobile || '',
        address: req.body.location || '',
        skills: req.body.skills || [],
        experience: req.body.experience || 0
      });
    } else {
      // Create regular user or admin
      user = new User({
        name,
        email,
        password,
        role: ['user', 'admin'].includes(role) ? role : 'user'
      });
    }

    await user.save();
    console.log('New user saved:', user);
    const token = signToken(user);
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token,
      msg: 'User registered successfully!'
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).send('Server error');
  }
};

export const loginUser = async (req, res) => {
  // Extract email and password from the request body (no role parameter needed)
  const { email, password } = req.body;

  try {
    // Initialize user variable
    let user = null;

    // First check in User collection
    user = await User.findOne({ email });

    // If not found in User collection, check in Worker collection
    if (!user) {
      user = await Worker.findOne({ email });
    }

    // If user not found in either collection, return invalid credentials
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = signToken(user);

    // Send successful response with user data and token
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      token
    });
  } catch (err) {
    // Log the error and send server error response
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

export const getMe = async (req, res) => {
    try {
        // Try to find user in User collection first
        let user = await User.findById(req.user.id).select('-password');

        // If not found in User collection, try Worker collection
        if (!user) {
            user = await Worker.findById(req.user.id).select('-password');
        }

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
