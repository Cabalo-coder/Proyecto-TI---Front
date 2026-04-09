import { useEffect, useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  getCourses,
  createCourse,
  createSection,
  getSectionsByCourse,
} from "../services/courseService";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [sections, setSections] = useState({});
  const [openCourse, setOpenCourse] = useState(null);

  const [courseName, setCourseName] = useState("");
  const [sectionName, setSectionName] = useState("A");
  const [selectedCourse, setSelectedCourse] = useState("");

  // 🔄 Cargar cursos
  const fetchCourses = async () => {
    const data = await getCourses();
    setCourses(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 📌 Crear curso
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    await createCourse(courseName);
    setCourseName("");
    fetchCourses();
  };

  // 📌 Crear sección
  const handleCreateSection = async (e) => {
    e.preventDefault();

    if (!selectedCourse) {
      alert("Selecciona un curso");
      return;
    }

    await createSection(sectionName, parseInt(selectedCourse));
    alert("Sección creada");

    loadSections(selectedCourse);
  };

  // 🔄 Cargar secciones de un curso
  const loadSections = async (course_id) => {
    const data = await getSectionsByCourse(course_id);

    setSections((prev) => ({
      ...prev,
      [course_id]: data,
    }));
  };

  // 📌 Expandir curso
  const handleToggle = (course_id) => {
    if (openCourse === course_id) {
      setOpenCourse(null);
    } else {
      setOpenCourse(course_id);
      loadSections(course_id);
    }
  };

  return (
    <DashboardLayout>
      <h1>Cursos</h1>

      {/* 🔹 Crear Curso */}
      <h3>Crear Curso</h3>
      <form onSubmit={handleCreateCourse}>
        <input
          type="text"
          placeholder="Nombre del curso"
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
        />
        <button type="submit">Crear</button>
      </form>

      <hr />

      {/* 🔹 Crear Sección */}
      <h3>Crear Sección</h3>
      <form onSubmit={handleCreateSection}>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
        >
          <option value="">Selecciona un curso</option>
          {courses.map((c) => (
            <option key={c.course_id} value={c.course_id}>
              {c.course_name}
            </option>
          ))}
        </select>

        <select
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
        >
          {["A", "B", "C", "D", "E", "F", "G"].map((letter) => (
            <option key={letter} value={letter}>
              Sección {letter}
            </option>
          ))}
        </select>

        <button type="submit">Crear Sección</button>
      </form>

      <hr />

      {/* 🔥 CURSOS + SECCIONES */}
      <h3>Mis Cursos</h3>

      {courses.map((course) => (
        <div key={course.course_id} style={{ marginBottom: "10px" }}>
          
          {/* 📦 Curso */}
          <div
            style={{
              background: "#e2e8f0",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleToggle(course.course_id)}
          >
            📦 {course.course_name}
          </div>

          {/* 📂 Secciones */}
          {openCourse === course.course_id && (
            <div style={{ marginLeft: "20px", marginTop: "5px" }}>
              {sections[course.course_id]?.length > 0 ? (
                sections[course.course_id].map((sec) => (
                  <div key={sec.section_id}>
                    ├── Sección {sec.section_name}
                  </div>
                ))
              ) : (
                <p>No hay secciones</p>
              )}
            </div>
          )}
        </div>
      ))}
    </DashboardLayout>
  );
}

export default Courses;