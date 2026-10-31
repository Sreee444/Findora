
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import auth from "../middleware/authMiddleware.js";
import { sendWelcomeEmail, sendPasswordResetEmail } from "../services/emailService.js";

const router = express.Router();

const ADMIN_EMAILS = [
  'admin@campus.edu',
  'findoraofficial101@gmail.com',
  'recoveraofficial101@gmail.com',
  'gotchaofficial101@gmail.com',
  (process.env.ADMIN_EMAIL || '').toLowerCase()
].filter(Boolean);

const checkIsAdmin = (user) => {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const email = (user.email || '').toLowerCase();
  return ADMIN_EMAILS.some(e => e.toLowerCase() === email);
};

// Get all users (admin only)
router.get('/users', auth, async (req, res) => {
  if (!checkIsAdmin(req.user)) {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
  const users = await User.find({}, '-password');
  res.json(users);
});

// Delete a user (admin only)
router.delete('/users/:id', auth, async (req, res) => {
  if (!checkIsAdmin(req.user)) {
    return res.status(403).json({ error: 'Access denied: Admin privileges required' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
});

// Get current user profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  if (!user) return res.status(404).json({ error: "User not found" });
  const isAdminUser = checkIsAdmin(user);
  res.json({ ...user.toObject(), role: isAdminUser ? 'admin' : (user.role || 'user') });
});

// Update current user profile (email and/or username)
router.put("/me", auth, async (req, res) => {
  const { email, username } = req.body;
  if (email && email.length < 3) {
    return res.status(400).json({ error: "Invalid email" });
  }
  if (username && username.length < 3) {
    return res.status(400).json({ error: "Invalid username" });
  }
  if (email) {
    const existing = await User.findOne({ email });
    if (existing && existing._id.toString() !== req.user.id) {
      return res.status(400).json({ error: "Email already taken" });
    }
  }
  const update = {};
  if (email) update.email = email;
  if (username) update.username = username;
  const user = await User.findByIdAndUpdate(req.user.id, update, { new: true, select: "-password" });
  res.json(user);
});

// Change password (with old password)
router.put("/change-password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: "Invalid password" });
  }
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  const match = await bcrypt.compare(oldPassword, user.password);
  if (!match) return res.status(400).json({ error: "Old password is incorrect" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: "Password changed successfully" });
});



// Request password reset - send email with reset token
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user by email or username
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.findOne({ username: email });
    }
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return res.json({ message: 'If the email exists, a reset link has been sent' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send reset email
    await sendPasswordResetEmail(user.email, user.username, resetToken);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Failed to send reset email' });
  }
});

// Verify reset token
router.get('/verify-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    res.json({ message: 'Reset token is valid', email: user.email });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ error: 'Failed to verify reset token' });
  }
});

// Reset password with token
router.post('/reset-password-with-token', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    if (!token || !newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Invalid token or password' });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Update password and clear reset token
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Password reset (simple version: update password by email) - DEPRECATED
router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }
  const user = await User.findOne({ username: email });
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ message: 'Password updated successfully' });
});


// Signup route
router.post("/signup", async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || password.length < 6) {
      return res.status(400).json({ error: "Invalid email or password" });
    }
    if (username && username.length < 3) {
      return res.status(400).json({ error: "Invalid username" });
    }
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email exists" });

    const hash = await bcrypt.hash(password, 10);
    const role = checkIsAdmin({ email }) ? 'admin' : 'user';
    const user = new User({ email, password: hash, username, role });
    await user.save();
    
    // Send welcome email (don't block registration if email fails)
    try {
      await sendWelcomeEmail(email, username);
      console.log(`Welcome email sent to ${email}`);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError.message);
      // Don't fail registration if email fails
    }
    
    res.json({ 
      message: "User created successfully", 
      emailSent: true
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login route (accepts email or username)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user && email) {
    // Try username if not found by email
    user = await User.findOne({ username: email });
  }
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ error: "Invalid credentials" });

  const isAdminUser = checkIsAdmin(user);
  const role = isAdminUser ? 'admin' : (user.role || 'user');

  const token = jwt.sign(
    { id: user._id, email: user.email, username: user.username, role },
    process.env.JWT_SECRET || "mysecret",
    { expiresIn: "7d" }
  );
  res.json({ 
    token, 
    user: { 
      id: user._id, 
      email: user.email, 
      username: user.username,
      role 
    } 
  });
});

export default router;