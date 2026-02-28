import User from "./models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();
// import cors from "cors";
import express from "express";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/users.routes.js";
import serviceRoutes from "./routes/services.routes.js";
import serviceRequestRoutes from "./routes/serviceRequests.routes.js";
import projectRoutes from "./routes/projects.routes.js";
import messageRoutes from "./routes/messages.routes.js";
import lookupRoutes from "./routes/lookup.routes.js";

const app = express();
// app.use(cors());
app.use(cors({
  origin: "https://your-netlify-site-name.netlify.app",
  credentials: true
}));
app.use(express.json());
app.use(morgan("dev"));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static serving for uploaded files
app.use("/uploads", express.static(path.join(process.cwd(), "backend", "uploads")));

app.get("/", (_req, res) => {
  res.json({ name: "Prameela Software Solutions API", status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-requests", serviceRequestRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api", lookupRoutes);
const createAdminIfNotExists = async () => {
  const adminEmail = "admin@prameela.com";

  const existingAdmin = await User.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("Admin@12345", 10);

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: hashedPassword,
      role: "Admin",
      companyName: "Prameela Software Solutions"
    });

    console.log("Admin created in Atlas DB");
  } else {
    console.log("Admin already exists");
  }
};
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

// connectDB(MONGO_URI)
//   .then(() => {
  connectDB(MONGO_URI)
  .then(async () => {

    await createAdminIfNotExists();
    const server = http.createServer(app);
    const io = new SocketIOServer(server, {
      cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] }
    });

    io.use((socket, next) => {
      try {
        const token =
          socket.handshake.auth?.token ||
          socket.handshake.headers?.authorization?.replace("Bearer ", "");
        if (!token) return next(new Error("no token"));

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id || decoded._id;
        if (!userId) return next(new Error("invalid token"));

        socket.data.userId = String(userId);
        next();
      } catch {
        next(new Error("unauthorized"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.data.userId;
      if (userId) socket.join(userId);
    });

    app.set("io", io);

    server.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("Failed to connect DB:", err.message);
    process.exit(1);
  });