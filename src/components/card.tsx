import { api } from "@/lib/api";
import { Client } from "@/types/client";
import { LockKeyholeIcon, LockKeyholeOpen } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Card({ client }: { client: Client }) {
  const [permission, setPermission] = useState(client.hasPermission);

  const handlePermission = async () => {
    const newPermission = !permission;
    setPermission(newPermission);

    await api.put(`/client/permission/${client.id}`, {
      hasPermission: newPermission,
    });

    if (newPermission) {
      return toast.success(
        `Acesso liberado para ${client.name.split(" ")[0]}`,
        {
          style: {
            background: "rgb(249 115 22)",
            color: "#ffff",
          },
          iconTheme: {
            primary: "#ffff",
            secondary: "rgb(249 115 22)",
          },
        }
      );
    } else {
      return toast.error(`Acesso bloqueado para ${client.name.split(" ")[0]}`, {
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
  };

  return (
    <div className="w-full md:w-max flex justify-between md:justify-center items-center relative gap-4 py-4 px-6 rounded-2xl shadow-md border-2 border-orange-500">
      <Image
        width={200}
        height={200}
        draggable="false"
        className="size-24 rounded-2xl object-cover"
        alt="imagem-cliente"
        src={client.faceImageUrl}
      />

      <div className="flex flex-col gap-1">
        <p className="text-base font-medium text-orange-500">{client.name}</p>
        <p className="text-sm text-zinc-400">{client.email}</p>
      </div>

      <div
        onClick={handlePermission}
        className="flex justify-center items-center p-3 md:absolute -top-4 -right-4 rounded-full text-neutral-100 cursor-pointer bg-orange-500/80 hover:bg-orange-500"
      >
        {permission ? (
          <LockKeyholeOpen className="size-5" />
        ) : (
          <LockKeyholeIcon className="size-5" />
        )}
      </div>
    </div>
  );
}
