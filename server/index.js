import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js"; // costumized router
import expenseRoutes from "./routes/expenseRoutes.js"; // costumized router

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// use costumized router
app.use("/api", userRoutes);
app.use("/api", expenseRoutes);

app.get("/test-cors", (req, res) => {
  res.json({ msg: "CORS OK" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
