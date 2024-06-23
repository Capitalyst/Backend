import { Router } from "express";
import { adminLogin } from "../controllers/admin.controller";
import { createLearningModule } from "../controllers/learningmodule.controller";
import { adminAuth, auth } from "../middlewares/auth.middleware";
import { createLearningVideo } from "../controllers/learningvideos.controller";
import { createTask } from "../controllers/task.controller";

const router = Router();

router.post("/login", adminLogin);
router.post("/learning/createmodule", adminAuth, createLearningModule);
router.post("/learning/addvideo", adminAuth, createLearningVideo);
router.post("/tasks/create", adminAuth, createTask);

export default router;
