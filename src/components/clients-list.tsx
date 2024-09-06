"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { UserPlus } from "lucide-react";
import { useEffect, useState } from "react";

import Card from "./card";

import NewCLientForm from "./new-client-form";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getClients = async () => {
    try {
      const response = await api.get("/client/list");
      setClients(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  return (
    <div className="container h-full flex flex-col justify-center items-center gap-5 px-8 py-4 mb-2">
      <div className="w-full flex items-center justify-between">
        <p className="text-base font-medium md:text-lg text-zinc-300">
          Clientes
        </p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost">
              Novo cliente <UserPlus className="ml-2 size-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-200">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-normal text-orange-500">
                Novo cliente <UserPlus className="size-5" />
              </DialogTitle>
            </DialogHeader>
            <NewCLientForm />
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full flex flex-wrap gap-6">
        {isLoading
          ? [...Array(15)].map((_, index) => <Skeleton key={index} />)
          : clients.map((client) => <Card key={client.id} client={client} />)}
      </div>
    </div>
  );
}
