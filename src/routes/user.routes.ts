import { Router } from "express";
import { createExpense, getExpenses, getExpensesByCategory, getUserData, leaderboard, login, update } from "../controllers/user.controller";
import { auth } from "../middlewares/auth.middleware";
import { getLearningModules, markModuleAsCompleted } from "../controllers/learningmodule.controller";
import { getLearningsVideo } from "../controllers/learningvideos.controller";
import { getTasks } from "../controllers/task.controller";

const router = Router();

router.post('/login', login);
router.get('/userdata', auth, getUserData)
router.post('/update', auth, update);

router.get('/learning/modules', auth, getLearningModules);
router.post('/learnings/module/complete', auth, markModuleAsCompleted);
router.get('/learning/videos', auth, getLearningsVideo);
router.get('/leaderboard', auth, leaderboard);

router.get('/tasks', auth, getTasks);

router.post('/expenses/add', auth, createExpense);
router.get('/expenses', auth, getExpenses);
router.get('/expenses/cat', auth, getExpensesByCategory)

export default router;