import express from "express";

const router = express.Router();

// FAKE DATA
const FAKE_USER = {
  name: "Demo User",
  email: "demo@example.com",
  password: "asdfg",
  avatar: "https://i.pravatar.cc/100?img=31",
};

router.post("/users/login", (req, res) => {
  const { email, password } = req.body;
  if (email === FAKE_USER.email && password === FAKE_USER.password) {
    const { password, ...userWithoutPassword } = FAKE_USER;
    res.json(userWithoutPassword);
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
});

export default router;
