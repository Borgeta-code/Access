"use client";

import FaceDetector from "@/components/face-detector";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function Detector() {
  return (
    <main className="flex h-screen flex-col items-center bg-neutral-100">
      <Header />
      <FaceDetector />
      <Toaster position="top-center" />
    </main>
  );
}
