import { Request, Response } from "express";
import Freebie from "../models/Freebie";
import FreebieProgress from "../models/FreebieProgress";

const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min;

// GET /api/freebies — list page (image 2 style)
export const getFreebies = async (req: Request, res: Response) => {
  try {
    const freebies = await Freebie.find({ active: true }).sort({ createdAt: -1 });
    res.json({ success: true, freebies });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch freebies" });
  }
};

// GET /api/freebies/:id — detail page, auto-creates progress on first visit
// (this is what gives the "already 59% cut" look the moment you open it)
export const getFreebieDetail = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const freebie = await Freebie.findById(req.params.id);
    if (!freebie) return res.status(404).json({ success: false, message: "Freebie not found" });

    let progress = await FreebieProgress.findOne({ user: userId, freebie: freebie._id });

    if (!progress) {
      // Starting "pre-cut" — 40% to 65% of the price already cut when first opened
      const initialCut = freebie.originalPrice * randomBetween(0.4, 0.65);
      progress = await FreebieProgress.create({
        user: userId,
        freebie: freebie._id,
        totalCutAmount: Math.round(initialCut * 100) / 100,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24hr from now
      });
    }

    const remaining = Math.max(freebie.originalPrice - progress.totalCutAmount, 0);
    const percentage = Math.min((progress.totalCutAmount / freebie.originalPrice) * 100, 100);

    res.json({
      success: true,
      freebie,
      progress: {
        totalCutAmount: Math.round(progress.totalCutAmount * 100) / 100,
        remaining: Math.round(remaining * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        expiresAt: progress.expiresAt,
        claimed: progress.claimed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch freebie detail" });
  }
};

// POST /api/freebies/:id/cut — "Share To Cut More Price" button action
export const cutFreebiePrice = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const freebie = await Freebie.findById(req.params.id);
    if (!freebie) return res.status(404).json({ success: false, message: "Freebie not found" });

    const progress = await FreebieProgress.findOne({ user: userId, freebie: freebie._id });
    if (!progress) return res.status(400).json({ success: false, message: "Open the freebie first" });

    if (progress.claimed) {
      return res.status(400).json({ success: false, message: "Already claimed" });
    }
    if (new Date() > progress.expiresAt) {
      return res.status(400).json({ success: false, message: "Freebie cutting window expired" });
    }

    const remaining = freebie.originalPrice - progress.totalCutAmount;
    if (remaining <= 0) {
      return res.status(400).json({ success: false, message: "Already fully cut — claim it!" });
    }

    // Each "share" cuts 15%–40% of whatever remains
    const cutThisTime = remaining * randomBetween(0.15, 0.4);
    progress.totalCutAmount = Math.min(progress.totalCutAmount + cutThisTime, freebie.originalPrice);
    await progress.save();

    const newRemaining = Math.max(freebie.originalPrice - progress.totalCutAmount, 0);
    const percentage = Math.min((progress.totalCutAmount / freebie.originalPrice) * 100, 100);

    res.json({
      success: true,
      cutThisTime: Math.round(cutThisTime * 100) / 100,
      progress: {
        totalCutAmount: Math.round(progress.totalCutAmount * 100) / 100,
        remaining: Math.round(newRemaining * 100) / 100,
        percentage: Math.round(percentage * 100) / 100,
        expiresAt: progress.expiresAt,
        claimed: progress.claimed,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to cut price" });
  }
};

// POST /api/freebies/:id/claim — "Get it!" once 100% cut
export const claimFreebie = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id;
    const freebie = await Freebie.findById(req.params.id);
    if (!freebie) return res.status(404).json({ success: false, message: "Freebie not found" });

    const progress = await FreebieProgress.findOne({ user: userId, freebie: freebie._id });
    if (!progress) return res.status(400).json({ success: false, message: "No progress found" });
    if (progress.claimed) return res.status(400).json({ success: false, message: "Already claimed" });

    const remaining = freebie.originalPrice - progress.totalCutAmount;
    if (remaining > 0.01) {
      return res.status(400).json({ success: false, message: "Not fully cut yet" });
    }

    progress.claimed = true;
    await progress.save();
    freebie.claimedCount += 1;
    await freebie.save();

    res.json({ success: true, message: "Freebie claimed!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to claim freebie" });
  }
};