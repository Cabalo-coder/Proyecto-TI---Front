import { useEffect, useState, useRef } from "react";
import Webcam from "react-webcam";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  createStudent,
  getSections,
  getTeacherStructure,
} from "../services/studentService";
import { uploadFace } from "../services/faceService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CameraAltIcon from "@mui/icons-material/CameraAlt";

function Students() {
  const [sections, setSections] = useState([]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [carne, setCarne] = useState("");
  const [sectionId, setSectionId] = useState("");

  const [file, setFile] = useState(null);
  const [useCamera, setUseCamera] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const webcamRef = useRef(null);

  const collectCarnes = (node, result = new Set()) => {
    if (!node) return result;

    if (Array.isArray(node)) {
      node.forEach((item) => collectCarnes(item, result));
      return result;
    }

    if (typeof node === "object") {
      if (typeof node.carne === "string" && node.carne.trim()) {
        result.add(node.carne.trim());
      }

      Object.values(node).forEach((value) => collectCarnes(value, result));
    }

    return result;
  };

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
    setError("");
    setSuccess("");

    if (!sectionId) {
      setError("Selecciona una sección");
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !carne.trim()) {
      setError("Completa nombre, apellido y carné");
      return;
    }

    if (!file) {
      setError("Debes subir o tomar una foto");
      return;
    }

    try {
      const existingStructure = await getTeacherStructure();
      const existingCarnes = collectCarnes(existingStructure);

      if (existingCarnes.has(carne.trim())) {
        setError("El carné ya existe. Usa uno diferente.");
        return;
      }

      // 🔹 1. Crear estudiante
      const studentData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        carne: carne.trim(),
        section_id: parseInt(sectionId),
      };

      const newStudent = await createStudent(studentData);

      const studentId = newStudent.student_id;

      if (!studentId) {
        setError("Error obteniendo ID del estudiante");
        return;
      }

      // 🔹 2. Subir rostro automáticamente
      await uploadFace(studentId, file);

      setSuccess("Estudiante y rostro registrados correctamente");

      // limpiar
      setFirstName("");
      setLastName("");
      setCarne("");
      setSectionId("");
      setFile(null);
    } catch (error) {
      console.error(error);
      setError(error?.message || "Error al registrar estudiante");
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3, maxWidth: 1200, mx: "auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Estudiantes
          </Typography>
          <Typography color="text.secondary">
            Registra alumnos y captura su rostro con una interfaz más clara.
          </Typography>
        </Box>

        {error ? <Alert severity="error">{error}</Alert> : null}
        {success ? <Alert severity="success">{success}</Alert> : null}

        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
              <PersonAddAltIcon color="primary" />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Crear estudiante
              </Typography>
            </Stack>

            <Box component="form" onSubmit={handleCreateStudent} sx={{ display: "grid", gap: 2 }}>
              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Nombre"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Apellido"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <TextField
                  label="Carné"
                  value={carne}
                  onChange={(e) => setCarne(e.target.value)}
                  fullWidth
                />

                <TextField
                  select
                  label="Sección"
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  fullWidth
                >
                  <MenuItem value="">Selecciona una sección</MenuItem>
                  {sections.map((s) => (
                    <MenuItem key={s.section_id} value={s.section_id}>
                      Sección {s.section_name} ({s.course_name})
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Divider sx={{ my: 1 }} />

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <Button
                  type="button"
                  variant={!useCamera ? "contained" : "outlined"}
                  startIcon={<UploadFileIcon />}
                  onClick={() => setUseCamera(false)}
                  sx={{ flex: 1 }}
                >
                  Subir imagen
                </Button>
                <Button
                  type="button"
                  variant={useCamera ? "contained" : "outlined"}
                  color="secondary"
                  startIcon={<CameraAltIcon />}
                  onClick={() => setUseCamera(true)}
                  sx={{ flex: 1 }}
                >
                  Usar cámara
                </Button>
              </Stack>

              {!useCamera && (
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadFileIcon />}
                  sx={{ justifyContent: "center", py: 1.4 }}
                >
                  Seleccionar foto
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </Button>
              )}

              {useCamera && (
                <Stack spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: "100%",
                      maxWidth: 360,
                      overflow: "hidden",
                      borderRadius: 4,
                      boxShadow: "0 16px 34px rgba(41,50,65,0.16)",
                    }}
                  >
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      width="100%"
                      style={{ display: "block", width: "100%" }}
                    />
                  </Box>

                  <Button
                    type="button"
                    onClick={capturePhoto}
                    variant="contained"
                    startIcon={<PhotoCameraIcon />}
                  >
                    Tomar foto
                  </Button>
                </Stack>
              )}

              <Button type="submit" variant="contained" color="secondary" size="large">
                Crear estudiante y registrar rostro
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Students;