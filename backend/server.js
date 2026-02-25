import dotenv from "dotenv";
import connectDB from "./config/db.js";
import app from "./app.js";
import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  })
);

dotenv.config();
connectDB();

const PORT = process.env.PORT || 3100;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
