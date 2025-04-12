const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const googleCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`https://blog-ezequielpera.netlify.app//login?token=${token}`);
};

const githubCallback = (req, res) => {
  const token = generateToken(req.user);
  res.redirect(`https://blog-ezequielpera.netlify.app/login?token=${token}`);
};

module.exports = { googleCallback, githubCallback };
