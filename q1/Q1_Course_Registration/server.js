/*
BYTEXL NIMBUS EXECUTION:
1. Create a Node.js workspace and place these files in the project root.
2. Place index.html inside the public/ folder.
3. Copy .env.example to .env and configure MONGODB_URI.
4. Run: npm install
5. Ensure MongoDB is reachable, then run: npm start
6. Open the application URL provided by ByteXL.
7. For deployment, set MONGODB_URI and PORT in the host's environment settings.

GIT EXAMPLE:
git init
git add .
git commit -m "Implement course registration"
git switch -c feature/course-registration
*/
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const allowedCourses = [
  "Full Stack Development",
  "Machine Learning",
  "Cloud Computing"
];

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, minlength: 8 },
  course: { type: String, required: true, enum: allowedCourses }
});

const Student = mongoose.model("Student", studentSchema);

app.post("/api/registrations", async (req, res) => {
  try {
    const { name, email, username, password, course } = req.body;
    if (!name?.trim() || !email?.trim() || !username?.trim() || !password || !course) {
      return res.status(400).json({ error: "All fields are required" });
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Enter a valid email address" });
    }
    if (password.length < 8) {
      return res.status(400).json({ error: "Password must have at least 8 characters" });
    }
    if (!allowedCourses.includes(course)) {
      return res.status(400).json({ error: "Invalid course selected" });
    }
    const existing = await Student.findOne({
      $or: [{ email: email.toLowerCase().trim() }, { username: username.trim() }]
    });
    if (existing) return res.status(409).json({ error: "Email or username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = await Student.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      username: username.trim(),
      password: hashedPassword,
      course
    });
    res.status(201).json({ message: "Registration successful", registrationId: student._id });
  } catch (error) {
    console.error(error);
    if (error.code === 11000) return res.status(409).json({ error: "Email or username already exists" });
    res.status(500).json({ error: "Unable to complete registration" });
  }
});

app.get("/api/registrations", async (req, res) => {
  try {
    const students = await Student.find().select("-password");
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Unable to retrieve registrations" });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "Server running" }));

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");
    const port = process.env.PORT || 3000;
    app.listen(port, "0.0.0.0", () => console.log(`Server running on port ${port}`));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}
startServer();