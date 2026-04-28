const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(
  "mongodb+srv://suhani:suhani2410@cluster0.hvftdzy.mongodb.net/test?retryWrites=true&w=majority"
)
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.log("❌ Mongo Error:", err));

// =======================
// SCHEMAS
// =======================

// Users → Posts (One-to-Many)
const User = mongoose.model("User", new mongoose.Schema({
  name: String,
}));

const Post = mongoose.model("Post", new mongoose.Schema({
  title: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}));

// Students ↔ Courses (Many-to-Many)
const Student = mongoose.model("Student", new mongoose.Schema({
  name: String,
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}));

const Course = mongoose.model("Course", new mongoose.Schema({
  title: String,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
}));

// =======================
// ROUTES
// =======================

app.get("/", (req, res) => {
  res.send("✅ API running");
});

// ---------- USERS ----------
app.get("/users", async (req, res) => {
  const users = await User.find();
  const posts = await Post.find();

  const result = users.map(u => ({
    ...u._doc,
    posts: posts.filter(p => p.userId.toString() === u._id.toString())
  }));

  res.json(result);
});

app.post("/users", async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
});

app.put("/users/:id", async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted" });
});

// ---------- POSTS ----------
app.post("/posts", async (req, res) => {
  const post = await Post.create(req.body);
  res.json(post);
});

// ---------- STUDENTS ----------
app.get("/students", async (req, res) => {
  const students = await Student.find().populate("courses");
  res.json(students);
});

app.post("/students", async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student deleted" });
});

// ---------- COURSES ----------
app.get("/courses", async (req, res) => {
  const courses = await Course.find().populate("students");
  res.json(courses);
});

app.post("/courses", async (req, res) => {
  const course = await Course.create(req.body);
  res.json(course);
});

app.delete("/courses/:id", async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.json({ message: "Course deleted" });
});

// ---------- ENROLL ----------
app.post("/enroll", async (req, res) => {
  const { studentId, courseId } = req.body;

  await Student.findByIdAndUpdate(studentId, {
    $addToSet: { courses: courseId }
  });

  await Course.findByIdAndUpdate(courseId, {
    $addToSet: { students: studentId }
  });

  res.json({ message: "Enrolled successfully" });
});

// =======================
// SERVER
// =======================
const PORT = 8000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});