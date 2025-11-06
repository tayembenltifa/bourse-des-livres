import express from "express";
import { query } from "../db";
const router = express.Router();

/**
 * GET /api/books
 * query params: q, author, category, min_price, max_price, page, limit
 */
router.get("/", async (req, res) => {
  const { q, author, category, min_price, max_price, page = 1, limit = 12 } = req.query as any;
  const offset = (Number(page) - 1) * Number(limit);
  let base = "SELECT id, seller_id, title, author, condition, price_cents, currency, status FROM books WHERE status = 'available'";
  const params: any[] = [];
  if (q) {
    params.push(`%${q}%`);
    base += ` AND (title ILIKE $${params.length} OR author ILIKE $${params.length})`;
  }
  if (author) {
    params.push(author);
    base += ` AND author = $${params.length}`;
  }
  if (category) {
    params.push(category);
    base += ` AND category_id = $${params.length}`;
  }
  if (min_price) {
    params.push(Number(min_price));
    base += ` AND price_cents >= $${params.length}`;
  }
  if (max_price) {
    params.push(Number(max_price));
    base += ` AND price_cents <= $${params.length}`;
  }
  params.push(limit);
  params.push(offset);
  base += ` ORDER BY created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
  try {
    const result = await query(base, params);
    res.json({ books: result.rows });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/books/:id
 */
router.get("/:id", async (req, res) => {
  try {
    const result = await query("SELECT * FROM books WHERE id = $1", [req.params.id]);
    const book = result.rows[0];
    if (!book) return res.status(404).json({ error: "Not found" });
    const imgs = await query("SELECT url FROM book_images WHERE book_id = $1 ORDER BY \"order\"", [req.params.id]);
    res.json({ book, images: imgs.rows.map((r) => r.url) });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;