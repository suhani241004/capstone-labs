import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8000";

function App() {
  // ================= USERS =================
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [postTitle, setPostTitle] = useState("");

  // ================= STUDENTS/COURSES =================
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  // ================= FETCH =================
  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/users`);
    const data = await res.json();
    setUsers(data);
  };

  const fetchStudents = async () => {
    const res = await fetch(`${BASE_URL}/students`);
    const data = await res.json();
    setStudents(data);
  };

  const fetchCourses = async () => {
    const res = await fetch(`${BASE_URL}/courses`);
    const data = await res.json();
    setCourses(data);
  };

  useEffect(() => {
    fetchUsers();
    fetchStudents();
    fetchCourses();
  }, []);

  // ================= USERS =================
  const addUser = async () => {
    await fetch(`${BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setName("");
    fetchUsers();
  };

  const deleteUser = async (id) => {
    await fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" });
    fetchUsers();
  };

  const addPost = async (userId) => {
    if (!postTitle) return alert("Enter post title");

    await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: postTitle, userId }),
    });

    setPostTitle("");
    fetchUsers();
  };

  // ================= STUDENTS =================
  const addStudent = async () => {
    await fetch(`${BASE_URL}/students`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: studentName }),
    });

    setStudentName("");
    fetchStudents();
  };

  const addCourse = async () => {
    await fetch(`${BASE_URL}/courses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: courseTitle }),
    });

    setCourseTitle("");
    fetchCourses();
  };

  const enroll = async () => {
    await fetch(`${BASE_URL}/enroll`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: selectedStudent,
        courseId: selectedCourse,
      }),
    });

    fetchStudents();
    fetchCourses();
  };

  // ================= UI =================
  return (
    <div style={{ padding: "20px" }}>
      <h1> FULL CRUD + RELATIONS</h1>

      {/* USERS */}
      <h2>Users + Posts (One-to-Many)</h2>

      <input
        placeholder="User name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={addUser}>Add User</button>

      {users.map((u) => (
        <div key={u._id} style={{ border: "1px solid gray", margin: "10px" }}>
          <b>{u.name}</b>
          <button onClick={() => deleteUser(u._id)}>Delete</button>

          <br />
          <input
            placeholder="Post title"
            value={postTitle}
            onChange={(e) => setPostTitle(e.target.value)}
          />
          <button onClick={() => addPost(u._id)}>Add Post</button>

          <ul>
            {u.posts?.map((p) => (
              <li key={p._id}>{p.title}</li>
            ))}
          </ul>
        </div>
      ))}

      <hr />

      {/* STUDENTS + COURSES */}
      <h2>Students ↔ Courses (Many-to-Many)</h2>

      <input
        placeholder="Student name"
        value={studentName}
        onChange={(e) => setStudentName(e.target.value)}
      />
      <button onClick={addStudent}>Add Student</button>

      <input
        placeholder="Course title"
        value={courseTitle}
        onChange={(e) => setCourseTitle(e.target.value)}
      />
      <button onClick={addCourse}>Add Course</button>

      <h3>Enroll Student</h3>

      <select onChange={(e) => setSelectedStudent(e.target.value)}>
        <option>Select Student</option>
        {students.map((s) => (
          <option value={s._id}>{s.name}</option>
        ))}
      </select>

      <select onChange={(e) => setSelectedCourse(e.target.value)}>
        <option>Select Course</option>
        {courses.map((c) => (
          <option value={c._id}>{c.title}</option>
        ))}
      </select>

      <button onClick={enroll}>Enroll</button>

      <h3>Students</h3>
      {students.map((s) => (
        <div key={s._id}>
          <b>{s.name}</b>
          <ul>
            {s.courses?.map((c) => (
              <li key={c._id}>{c.title}</li>
            ))}
          </ul>
        </div>
      ))}

      <h3>Courses</h3>
      {courses.map((c) => (
        <div key={c._id}>
          <b>{c.title}</b>
          <ul>
            {c.students?.map((s) => (
              <li key={s._id}>{s.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;