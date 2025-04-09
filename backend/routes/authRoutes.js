const express = require("express");
const { register, login, getMe, verify } = require("../controllers/authControllers");
const { googleCallback, githubCallback } = require("../controllers/oauthControllers");
const passport = require("../services/passport");

const router = express.Router();

// Rutas de autenticación tradicional
router.post("/register", register);
router.post("/login", login);
router.get("/me", getMe);
router.get("/verify-email",verify)

// Rutas de autenticación con Google OAuth
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  googleCallback
);

// Rutas de autenticación con GitHub OAuth
router.get("/auth/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get(
  "/auth/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/login" }),
  githubCallback
);

module.exports = router;