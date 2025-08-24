
import express from "express";
import Item from "../models/Item.js";
import auth from "../middleware/authMiddleware.js";
import { createNotification } from "./notifications.js";

const router = express.Router();

// Get items reported by current user
router.get("/my", auth, async (req, res) => {
  const items = await Item.find({ createdBy: req.user.id })
    .populate("createdBy", "username")
    .populate("claimedBy", "username");
  res.json(items);
});

// Approve a lost item (admin action, auth required)
router.post('/:id/approve', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.type !== 'lost') return res.status(400).json({ error: 'Not a lost item' });
  item.approved = true;
  await item.save();
  res.json({ message: 'Lost item approved' });
});

// Verify a found item (admin action, auth required)
router.post('/:id/verify', auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.type !== 'found') return res.status(400).json({ error: 'Not a found item' });
  item.verified = true;
  await item.save();
  res.json({ message: 'Found item verified' });
});

// Get all items (optionally filter by type)
router.get("/", async (req, res) => {
  const { type } = req.query;
  const filter = type ? { type } : {};
  const items = await Item.find(filter)
    .populate("createdBy", "username")
    .populate("claimedBy", "username");
  res.json(items);
});

// Get single item by ID
router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate("createdBy", "username")
      .populate("claimedBy", "username");
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
});

// Add new item (auth required)
router.post("/", auth, async (req, res) => {
  const { title, description, type, contact, location } = req.body;

  if (
    !title || title.length < 3 ||
    !description || description.length < 10 ||
    !["lost", "found"].includes(type) ||
    !contact
  ) {
    return res.status(400).json({ error: "Validation error" });
  }

  const item = new Item({
    title,
    description,
    type,
    date: new Date(), // Always use current timestamp when item is created
    contact,
    location,
    createdBy: req.user.id
  });
  await item.save();

  // Create notification for the user
  try {
    await createNotification(
      req.user.id,
      `${type === 'lost' ? 'Lost' : 'Found'} Item Posted`,
      `Your ${type} item "${title}" has been posted successfully and is awaiting ${type === 'lost' ? 'approval' : 'verification'}.`,
      'success',
      item._id
    );
  } catch (err) {
    console.error("Error creating notification:", err);
  }

  res.status(201).json(item);
});

// Claim an item (auth required)
router.post("/:id/claim", auth, async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  if (item.claimed) return res.status(400).json({ error: "Item already claimed" });

  item.claimed = true;
  item.claimedBy = req.user.id;
  await item.save();
  res.json({ message: "Item claimed" });
});

// Update item location (auth required)
router.put("/:id/location", auth, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    
    // Check if user owns this item
    if (item.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this item" });
    }

    const { location } = req.body;
    item.location = location;
    await item.save();
    
    res.json({ message: "Location updated successfully", item });
  } catch (err) {
    res.status(500).json({ error: "Failed to update location" });
  }
});

export default router;