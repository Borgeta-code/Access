"use client";

import ClientsList from "@/components/clients-list";
import Header from "@/components/header";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-neutral-200">
      <Header variant="home" />
      <ClientsList />
      <Toaster position="top-center" />
    </main>
  );
}
