import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import DashboardLayout from "../components/layout/DashboardLayout";
import { recognizeAttendance, recognizeGroup } from "../services/recognitionService";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import GroupsIcon from "@mui/icons-material/Groups";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

function Attendance() {
  const webcamRef = useRef(null);

  const [mode, setMode] = useState("live"); // live | single | group
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [message, setMessage] = useState("Cargando modelos...");
  const [processing, setProcessing] = useState(false);
  const [image, setImage] = useState(null);

  // =============================
  // CARGAR MODELOS
  // =============================
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";

      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);

      setModelsLoaded(true);
      setMessage("Modelos cargados");
    };

    loadModels();
  }, []);

  // =============================
  // MODO EN VIVO (AUTO)
  // =============================
  useEffect(() => {
    if (!modelsLoaded || mode !== "live") return;

    const interval = setInterval(() => {
      detectLive();
    }, 3000);

    return () => clearInterval(interval);
  }, [modelsLoaded, mode]);

  const detectLive = async () => {
    if (processing) return;

    const video = webcamRef.current?.video;
    if (!video) return;

    setProcessing(true);

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("No se detecta rostro");
        setProcessing(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      const res = await recognizeAttendance(descriptor);

      setMessage(` ${res.message}`);
    } catch (err) {
      console.error(err);
      setMessage("Error ");
    }

    setProcessing(false);
  };


  // FOTO INDIVIDUAL

  const captureSingle = async () => {
    if (processing) return;

    const screenshot = webcamRef.current.getScreenshot();
    if (!screenshot) return;

    setProcessing(true);

    const img = await faceapi.fetchImage(screenshot);

    try {
      const detection = await faceapi
        .detectSingleFace(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("No se detecta rostro");
        setProcessing(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);
      const res = await recognizeAttendance(descriptor);

      setMessage(`📸 ${res.message}`);
    } catch (err) {
      console.error(err);
      setMessage("Error en foto ");
    }

    setProcessing(false);
  };


  // FOTO GRUPAL

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const sendGroupImage = async () => {
    if (!image) return;

    setProcessing(true);

    try {
      const res = await recognizeGroup(image);
      setMessage(`🧑‍🤝‍🧑 ${res.message}`);
    } catch (err) {
      console.error(err);
      setMessage("Error en grupo ❌");
    }

    setProcessing(false);
  };


  // UI

  return (
    <DashboardLayout>
      <Box sx={{ display: "grid", gap: 3, maxWidth: 1100, mx: "auto" }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Asistencia inteligente
          </Typography>
          <Typography color="text.secondary">
            Elige el modo de captura y marca asistencia con un flujo más claro.
          </Typography>
        </Box>

        <Card className="glass-surface lift-on-hover animate-fade-up">
          <CardContent>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              justifyContent="center"
              alignItems="center"
              sx={{ flexWrap: "wrap" }}
            >
              <Button
                variant={mode === "live" ? "contained" : "outlined"}
                startIcon={<VideocamIcon />}
                onClick={() => setMode("live")}
                sx={{ minWidth: 160 }}
              >
                En vivo
              </Button>
              <Button
                variant={mode === "single" ? "contained" : "outlined"}
                color="secondary"
                startIcon={<PhotoCameraIcon />}
                onClick={() => setMode("single")}
                sx={{ minWidth: 160 }}
              >
                Individual
              </Button>
              <Button
                variant={mode === "group" ? "contained" : "outlined"}
                color="inherit"
                startIcon={<GroupsIcon />}
                onClick={() => setMode("group")}
                sx={{
                  minWidth: 160,
                  borderColor: "rgba(41,50,65,0.16)",
                  color: "text.primary",
                }}
              >
                Grupal
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <Card className="glass-surface lift-on-hover animate-fade-up" sx={{ animationDelay: "90ms" }}>
          <CardContent>
            <Box sx={{ textAlign: "center", mb: 2 }}>
              {!modelsLoaded ? (
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
                  <CircularProgress size={18} />
                  <Typography>Cargando IA...</Typography>
                </Stack>
              ) : (
                <Alert severity="success" sx={{ justifyContent: "center" }}>
                  Modelos cargados
                </Alert>
              )}
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={3} alignItems="center">
              {(mode === "live" || mode === "single") && (
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 520,
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 16px 34px rgba(41,50,65,0.16)",
                  }}
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    width="100%"
                    style={{ display: "block", width: "100%", height: "auto" }}
                  />
                </Box>
              )}

              {mode === "single" && (
                <Button
                  onClick={captureSingle}
                  variant="contained"
                  startIcon={<PhotoCameraIcon />}
                >
                  Tomar foto
                </Button>
              )}

              {mode === "live" && (
                <Button
                  onClick={detectLive}
                  variant="contained"
                  startIcon={<PlayArrowIcon />}
                >
                  Analizar ahora
                </Button>
              )}

              {mode === "group" && (
                <Stack spacing={2} sx={{ width: "100%", maxWidth: 520 }} alignItems="center">
                  <Button
                    component="label"
                    variant="outlined"
                    startIcon={<UploadFileIcon />}
                    sx={{ width: "100%" }}
                  >
                    Seleccionar foto grupal
                    <input type="file" hidden onChange={handleFileChange} />
                  </Button>

                  <Button
                    onClick={sendGroupImage}
                    variant="contained"
                    color="secondary"
                    startIcon={<GroupsIcon />}
                    disabled={!image}
                    sx={{ width: "100%" }}
                  >
                    Enviar foto grupal
                  </Button>
                </Stack>
              )}

              <Typography
                variant="h6"
                sx={{
                  textAlign: "center",
                  p: 2,
                  borderRadius: 3,
                  width: "100%",
                  background: "rgba(61,90,128,0.08)",
                  color: "text.primary",
                }}
              >
                {message}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default Attendance;