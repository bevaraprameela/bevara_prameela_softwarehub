import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const seedAdmin = async () => {
  try {

    const existingAdmin = await User.findOne({ email: "admin@prameela.com" });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit();
    }

    const admin = new User({
      name: "Admin",
      email: "admin@prameela.com",
      password: "Admin@12345",
      role: "Admin",
      companyName: "Prameela Software Solutions"
    });

    await admin.save(); // ⚠️ THIS TRIGGERS BCRYPT HASHING

    console.log("Admin created successfully");
    process.exit();

  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedAdmin();
