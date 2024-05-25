import { api } from "@/lib/api";
import * as faceapi from "face-api.js";
import { Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function FaceDetector() {
  const webcamRef = useRef<any>(null);
  const canvasRef = useRef<any>(null);

  const videoHeight = 1024;
  const videoWidth = 1280;

  const [faceImages, setFaceImages] = useState<string[]>([]);

  const [isLoadingWebcam, setIsLoadingWebcam] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    loadModels();
    startVideo();
    getFaceImagesUrl();
  }, []);

  const loadModels = async () => {
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
    ]).then(() => setModelsLoaded(true));
  };

  const getFaceImagesUrl = () => {
    api
      .get("/faces")
      .then((response) => {
        const images = response.data.map(
          (item: { faceImageName: string }) => item.faceImageName
        );
        setFaceImages(images);
      })
      .catch((error) => {
        console.error("Erro ao carregar imagens:", error);
      });
  };

  let isToastShown = false;

  const compareFaces = async (detectedFaces: any[]) => {
    if (faceImages.length == 0) {
      return toast.error("Ninguém tem acesso", {
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
        const img = await faceapi.fetchImage(`/faces/${imageName}`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        return new faceapi.LabeledFaceDescriptors(imageName, [
          detections!.descriptor,
        ]);
      })
    );

    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

    detectedFaces.forEach((df) => {
      const bestMatch = faceMatcher.findBestMatch(df.descriptor);
      if (!isToastShown) {
        if (bestMatch.label !== "unknown") {
          toast.success("Acesso liberado", {
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

          setTimeout(() => {
            isToastShown = false;
          }, 2000);
        } else {
          toast.error("Acesso não liberado", {
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

          setTimeout(() => {
            isToastShown = false;
          }, 2000);
        }
      }
    });
  };

  const handleVideoOnPlay = () => {
    if (!modelsLoaded) {
      return;
    }

    setInterval(async () => {
      if (canvasRef && canvasRef.current) {
        canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(
          webcamRef.current
        );

        const displaySize = {
          width: videoWidth,
          height: videoHeight,
        };

        faceapi.matchDimensions(canvasRef.current, displaySize);

        const detections = await faceapi
          .detectAllFaces(
            webcamRef.current,
            new faceapi.TinyFaceDetectorOptions()
          )
          .withFaceLandmarks()
          .withFaceExpressions()
          .withFaceDescriptors();

        compareFaces(detections);

        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        canvasRef &&
          canvasRef.current &&
          canvasRef.current
            .getContext("2d")
            .clearRect(0, 0, videoWidth, videoHeight);
        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawDetections(canvasRef.current, resizedDetections);

        canvasRef &&
          canvasRef.current &&
          faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedDetections);
      }
    }, 2000);
  };

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 300 },
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

  return (
    <div className="w-full h-full flex justify-center items-center">
      <div className="container flex justify-center items-center -mt-10">
        {isLoadingWebcam && (
          <div className="absolute flex flex-col justify-center items-center gap-4 z-20 animate-pulse text-orange-500 text-xl font-medium">
            <Loader2 className="animate-spin" size={64} />
            Carregando
          </div>
        )}
        <video
          ref={webcamRef}
          onPlay={handleVideoOnPlay}
          className={`relative w-[1280px] aspect-video object-cover border-2 border-orange-500 rounded-xl ${
            isLoadingWebcam || !modelsLoaded ? "invisible" : "visible"
          }`}
        />
        <canvas ref={canvasRef} className="absolute z-10" />
      </div>
    </div>
  );
}
