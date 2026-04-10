import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  createStudent,
  getSections,
} from "../services/studentService";
import { uploadFace } from "../services/faceService";

function Students() {
  const [sections, setSections] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [carne, setCarne] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [file, setFile] = useState(null);
  const [useCamera, setUseCamera] = useState(false);

  const webcamRef = useRef(null);

  // cargar secciones
  useEffect(() => {
    const fetchSections = async () => {
      const data = await getSections();
      setSections(Array.isArray(data) ? data : []);
    };

    fetchSections();
  }, []);

  // tomar foto
  const capturePhoto = () => {
    const imageSrc = webcamRef.current.getScreenshot();

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "photo.jpg", {
          type: "image/jpeg",
        });
        setFile(file);
      });
  };

  // CREAR ESTUDIANTE + SUBIR ROSTRO
  const handleCreateStudent = async (e) => {
    e.preventDefault();

    if (!sectionId) {
      alert("Selecciona una sección");
      return;
    }

    if (!file) {
      alert("Debes subir o tomar una foto");
      return;
    }

    try {
      // 🔹 1. Crear estudiante
      const studentData = {
        first_name: firstName,
        last_name: lastName,
        carne: carne,
        section_id: parseInt(sectionId),
      };

      const newStudent = await createStudent(studentData);

      const studentId = newStudent.student_id;

      if (!studentId) {
        alert("Error obteniendo ID del estudiante");
        return;
      }

      // 🔹 2. Subir rostro automáticamente
      await uploadFace(studentId, file);

      alert("Estudiante + rostro registrados");

      // limpiar
      setFirstName("");
      setLastName("");
      setCarne("");
      setSectionId("");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Error al registrar estudiante");
    }
  };

  return (
    <DashboardLayout>
      <h1>Estudiantes</h1>

      {/* CREAR + ROSTRO */}
      <form onSubmit={handleCreateStudent}>
        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Carné"
          value={carne}
          onChange={(e) => setCarne(e.target.value)}
        />

        <select
          value={sectionId}
          onChange={(e) => setSectionId(e.target.value)}
        >
          <option value="">Selecciona una sección</option>
          {sections.map((s) => (
            <option key={s.section_id} value={s.section_id}>
              Sección {s.section_name} ({s.course_name})
            </option>
          ))}
        </select>

        <br /><br />

        {/* elegir modo */}
        <button type="button" onClick={() => setUseCamera(false)}>
          Subir Imagen
        </button>

        <button type="button" onClick={() => setUseCamera(true)}>
          Usar Cámara
        </button>

        <br /><br />

        {/* subir archivo */}
        {!useCamera && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        {/* 📷 cámara */}
        {useCamera && (
          <div>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={300}
            />

            <button type="button" onClick={capturePhoto}>
              Tomar Foto
            </button>
          </div>
        )}

        <br /><br />

        <button type="submit">
          Crear Estudiante + Registrar Rostro
        </button>
      </form>
    </DashboardLayout>
  );
}

export default Students;