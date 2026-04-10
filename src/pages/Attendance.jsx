import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import DashboardLayout from "../components/layout/DashboardLayout";
import { recognizeAttendance } from "../services/recognitionService";

function Attendance() {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [message, setMessage] = useState("Cargando modelos...");
  const [processing, setProcessing] = useState(false);

  // cargar modelos
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

  // loop automático
  useEffect(() => {
    if (!modelsLoaded) return;

    const interval = setInterval(() => {
      detectFace();
    }, 3000);

    return () => clearInterval(interval);
  }, [modelsLoaded]);

  // detectar rostro real
  const detectFace = async () => {
    if (processing) return;

    const video = webcamRef.current.video;

    if (!video) return;

    setProcessing(true);

    try {
      const detection = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!detection) {
        setMessage("❌ No se detecta rostro");
        setProcessing(false);
        return;
      }

      const descriptor = Array.from(detection.descriptor);

      // 🚀 enviar al backend
      const res = await recognizeAttendance(descriptor);

      setMessage(`✅ ${res.message || "Asistencia registrada"}`);
    } catch (error) {
      console.error(error);
      setMessage("Error en reconocimiento ❌");
    }

    setProcessing(false);
  };

  return (
    <DashboardLayout>
      <h1>Asistencia en Vivo</h1>

      {!modelsLoaded && <p>Cargando IA...</p>}

      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={400}
      />

      <br /><br />

      <h2>{message}</h2>
    </DashboardLayout>
  );
}

export default Attendance;