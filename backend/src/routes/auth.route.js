import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

try {
    router.post("/signup", signup);
    router.post("/login", login);
    router.post("/logout", logout);
    router.put("/update-profile", protectRoute, updateProfile);
    router.get("/check", protectRoute, checkAuth)

} catch (error) {
    console.log("ERROR --  ", error);
}

console.log("Loading auth.routes.js");

export default router;