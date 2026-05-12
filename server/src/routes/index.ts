import { Router } from "express";

const router = Router();

router.get("/leads", (_req, res) => {
  res.json({
    message: "Lead route working",
  });
});

export default router;