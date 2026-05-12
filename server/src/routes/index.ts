import { Router } from "express";
import { leadController } from "../controllers/leadController";
import { discussionController } from "../controllers/discussionController";

const router = Router();

router.get("/leads", leadController.list);
router.post("/leads", leadController.create);
router.patch("/leads/:id", leadController.update);

router.get(
  "/leads/:id/discussions",
  discussionController.list
);

router.post(
  "/leads/:id/discussions",
  discussionController.create
);

export default router;