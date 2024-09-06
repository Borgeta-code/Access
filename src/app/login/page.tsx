"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, LogIn } from "lucide-react";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import logo from "/public/logo-white.svg";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setIsLoading(true);

    if (!user || !password) {
      setIsLoading(false);
      setUser("");
      setPassword("");
      return toast.error("Preencha usuário e senha", {
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

    if (user != "admin" || password != "admin") {
      setIsLoading(false);
      setUser("");
      setPassword("");
      return toast.error("Usuário ou senha está incorreto", {
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

    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <main className="h-screen flex justify-center items-center text-zinc-800">
      <Toaster position="bottom-right" />

      <div className="w-full h-full flex-1 justify-center items-center bg-orange-500 hidden md:flex">
        <Image
          draggable="false"
          src={logo}
          alt="logo-sportstook"
          className="w-72"
        />
      </div>

      <div className="w-full h-full flex  flex-col flex-1 justify-center items-center bg-neutral-100 px-4 md:px-0">
        <div className="w-full max-w-96 flex flex-col justify-center items-center gap-5">
          <h1 className="w-full text-3xl font-medium text-orange-500">Login</h1>
          <div className="w-full flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Usuário"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button onClick={handleLogin}>
              {isLoading ? (
                <Loader2 className="size-5 text-neutral-200 animate-spin" />
              ) : (
                <>
                  Entrar <LogIn className="ml-2 size-4" />
                </>
              )}
            </Button>
          </div>
          <div className="w-full flex justify-center items-center gap-4">
            <div className="w-full h-0.5 bg-zinc-300 bg-opacity-50" />
            <p className="text-sm text-zinc-400">ou</p>
            <div className="w-full h-0.5 bg-zinc-300 bg-opacity-50" />
          </div>
          <p className="text-sm text-zinc-400 cursor-pointer hover:text-orange-500 transition-colors">
            Esqueceu a senha?
          </p>
        </div>
      </div>
    </main>
  );
}
