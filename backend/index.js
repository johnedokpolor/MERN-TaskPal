import express from "express";
import path from "path";
import { connectDB } from "./db/connectDB.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import { fileURLToPath } from "url";
import taskReminder from "./utils/reminder.js";

const app = express();
const port = process.env.PORT;

//Cookie parser Middleware
app.use(cookieParser());

// JSON Parser Middleware
app.use(express.json());

// CORS Policy Middleware
const allowedOrigins = [process.env.CLIENT_URL, process.env.DEVELOPMENT_URL];
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Enables Routing from AuthRoutes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);

// Server uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connects to MONGODB, Then Listens on The Server
app.listen(port, () => {
  connectDB().then(() => {
    console.log(`Server is listening on port ${port}...`);
    // set task reminder
    taskReminder();
  });
});
