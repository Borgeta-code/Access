import { api } from "@/lib/api";
import * as faceapi from "face-api.js";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FaceDetector() {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const videoHeight = 576;
  const videoWidth = 1024;

  const [faceImages, setFaceImages] = useState<string[]>([]);
  const [isLoadingWebcam, setIsLoadingWebcam] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ]);
    setModelsLoaded(true);
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: videoWidth, height: videoHeight },
      });
      if (webcamRef.current) {
        webcamRef.current.srcObject = stream;
        webcamRef.current.play();
      }
    } catch (err) {
      console.error("error:", err);
    } finally {
      setIsLoadingWebcam(false);
    }
  };

  const getFaceImagesUrl = async () => {
    try {
      const response = await api.get("/faces");
      const images = response.data.map(
        (item: { faceImageName: string }) => item.faceImageName
      );
      setFaceImages(images);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    }
  };

  const compareFaces = async (detectedFaces: any[]) => {
    if (faceImages.length === 0) {
      return toast.error("Nenhum cliente tem acesso!", {
        style: {
          background: "rgb(249 115 22)",
          color: "#ffff",
        },
        iconTheme: {
          primary: "#ffff",
          secondary: "rgb(249 115 22)",
        },
      });
    }

    const labeledFaceDescriptors = await Promise.all(
      faceImages.map(async (imageName) => {
        try {
          const img = await faceapi.fetchImage(`/faces/${imageName}`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!detections) {
            throw new Error(`Detecção falhou para a imagem: ${imageName}`);
          }

          return new faceapi.LabeledFaceDescriptors(imageName, [
            detections.descriptor,
          ]);
        } catch (error) {
          console.error(error);
          return null;
        }
      })
    );

    const validLabeledDescriptors = labeledFaceDescriptors.filter(
      (descriptor) => descriptor !== null
    );

    if (validLabeledDescriptors.length === 0) {
      console.error("Nenhum rosto foi detectado nas imagens de referência");
      return toast.error("Erro ao detectar rostos de referência", {
        style: {
          background: "rgb(249 115 22)",
          color: "#ffff",
        },
        iconTheme: {
          primary: "#ffff",
          secondary: "rgb(249 115 22)",
        },
      });
    }

    const faceMatcher = new faceapi.FaceMatcher(validLabeledDescriptors);

    detectedFaces.forEach(async (df) => {
      const bestMatch = faceMatcher.findBestMatch(df.descriptor);
      if (bestMatch.label !== "unknown") {
        const response = await api.get(`/client/find/${bestMatch.label}`);
        const client = response.data;

        toast.success(`Acesso liberado para ${client.name.split(" ")[0]}`, {
          style: {
            background: "rgb(249 115 22)",
            color: "#ffff",
          },
          iconTheme: {
            primary: "#ffff",
            secondary: "rgb(249 115 22)",
          },
        });
      } else {
        toast.error("Acesso bloqueado", {
          style: {
            background: "rgb(249 115 22)",
            color: "#ffff",
          },
          iconTheme: {
            primary: "#ffff",
            secondary: "rgb(249 115 22)",
          },
        });
      }
    });
  };

  const handleVideoOnPlay = async () => {
    if (!modelsLoaded || !webcamRef.current) {
      return;
    }

    const displaySize = {
      width: videoWidth,
      height: videoHeight,
    };

    faceapi.matchDimensions(canvasRef.current, displaySize);

    let isToastShown = false;
    let lastMatch = "";

    const detectionInterval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          webcamRef.current,
          new faceapi.TinyFaceDetectorOptions()
        )
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const match: any = await compareFaces(detections);

        if (match && !isToastShown && match.label !== lastMatch) {
          toast.success(`Acesso liberado`, {
            style: {
              background: "rgb(249 115 22)",
              color: "#ffff",
            },
            iconTheme: {
              primary: "#ffff",
              secondary: "rgb(249 115 22)",
            },
          });
          isToastShown = true;
          lastMatch = match.label;

          setTimeout(() => {
            isToastShown = false;
          }, 2000);
        }
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      const context = canvasRef.current.getContext("2d");
      context.clearRect(0, 0, videoWidth, videoHeight);
      faceapi.draw.drawDetections(canvasRef.current, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
    }, 3000); // Aumentar o intervalo para 3 segundos para evitar sobrecarga

    return () => clearInterval(detectionInterval);
  };

  useEffect(() => {
    loadModels();
    startVideo();
    getFaceImagesUrl();

    let detectionInterval: NodeJS.Timeout | null = null;

    const currentWebcamRef = webcamRef.current;

    return () => {
      const stream = currentWebcamRef?.srcObject;
      if (stream) {
        const tracks = (stream as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }

      if (detectionInterval) {
        clearInterval(detectionInterval);
      }
    };
  }, []);

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="container flex justify-center items-center -mt-10">
        {isLoadingWebcam || !modelsLoaded ? (
          <div className="w-[1024px] aspect-video flex justify-center items-center absolute rounded-xl animate-pulse bg-zinc-300 text-zinc-400">
            <Loader2 className="animate-spin size-16" />
          </div>
        ) : (
          <>
            <video
              ref={webcamRef}
              onPlay={handleVideoOnPlay}
              className="w-[1024px] aspect-video relative object-cover border-2 border-orange-500 rounded-xl"
            />
            <canvas ref={canvasRef} className="absolute z-10" />
          </>
        )}
      </div>
    </div>
  );
}
