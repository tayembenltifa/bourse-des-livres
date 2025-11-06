import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { query } from "../db";
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "devsecret";

/**
 * POST /api/auth/register
 * body: { email, password, name }
 */
router.post("/register", async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Email and password required" });
    const existing = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (existing.rows.length) return res.status(400).json({ error: "Email already used" });
    const hashed = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (email, password_hash, name, created_at) VALUES ($1, $2, $3, now()) RETURNING id, email, name",
      [email, hashed, name]
    );
    const user = result.rows[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ user, token });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await query("SELECT id, email, password_hash, name FROM users WHERE email = $1", [email]);
    const user = result.rows[0];
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "30d" });
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;