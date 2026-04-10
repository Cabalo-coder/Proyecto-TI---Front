import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import DashboardLayout from "../components/layout/DashboardLayout";
import { recognizeAttendance, recognizeGroup } from "../services/recognitionService";

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
      <h1>Asistencia Inteligente</h1>

      {/* SELECTOR */}
      <div>
        <button onClick={() => setMode("live")}>📹 En Vivo</button>
        <button onClick={() => setMode("single")}>📸 Individual</button>
        <button onClick={() => setMode("group")}>🧑‍🤝‍🧑 Grupal</button>
      </div>

      <br />

      {!modelsLoaded && <p>Cargando IA...</p>}

      {/* CAMARA */}
      {(mode === "live" || mode === "single") && (
        <>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={400}
          />

          {mode === "single" && (
            <>
              <br />
              <button onClick={captureSingle}>Tomar Foto</button>
            </>
          )}
        </>
      )}

      {/* GRUPAL */}
      {mode === "group" && (
        <>
          <input type="file" onChange={handleFileChange} />
          <br /><br />
          <button onClick={sendGroupImage}>
            Enviar Foto Grupal
          </button>
        </>
      )}

      <br /><br />
      <h2>{message}</h2>
    </DashboardLayout>
  );
}

export default Attendance;