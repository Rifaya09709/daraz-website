import express from "express";
import { getFreebies, getFreebieDetail, cutFreebiePrice, claimFreebie } from "../controllers/freebieController";
import { protect } from "../middleware/auth"; // unga actual auth middleware path-ku maathunga

const router = express.Router();

router.get("/", getFreebies);
router.get("/:id", protect, getFreebieDetail);
router.post("/:id/cut", protect, cutFreebiePrice);
router.post("/:id/claim", protect, claimFreebie);

export default router;