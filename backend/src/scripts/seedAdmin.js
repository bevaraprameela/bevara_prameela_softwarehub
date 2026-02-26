// import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
// dotenv.config({ path: "../../.env" });
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve("../.env") }); // adjust path if necessary

async function run() {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error("MONGO_URI is required");
    process.exit(1);
  }
  await connectDB(MONGO_URI);
  const email = process.env.ADMIN_EMAIL || "admin@prameela.com";
  const password = process.env.ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.ADMIN_NAME || "admin";

  let admin = await User.findOne({ email });
  if (admin) {
    console.log("Admin already exists:", admin.email);
  } else {
    admin = await User.create({ name, email, password, role: "Admin", companyName: "Prameela Software Solutions" });
    console.log("Admin created:", admin.email);
  }
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});

