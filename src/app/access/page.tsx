"use client";

import FaceDetector from "@/components/face-detector";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function Access() {
  return (
    <main className="flex h-screen flex-col items-center bg-neutral-200">
      <Header variant="access" />
      <FaceDetector />
      <Toaster position="top-center" />
    </main>
  );
}
