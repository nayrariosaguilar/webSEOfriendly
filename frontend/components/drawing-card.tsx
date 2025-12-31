"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, Download, Share2, Pin } from "lucide-react";
import { ShareButtons } from "@/frontend/components/share-buttons";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";
export function publicUrl(path: string) {
  return `${BASE}/storage/v1/object/public/${path}`;
}

interface DrawingCardProps {
  slug: string;
  titulo: string;
  descripcion: string;
  imagen: string;
  category: string;
  subcategory: string;
  likes?: number;
  downloads?: number;
}

export function DrawingCard({
  slug,
  titulo,
  descripcion,
  imagen,
  category,
  subcategory,
  likes = 0,
  downloads = 0,
}: DrawingCardProps) {
  const [liked, setLiked] = useState(false);
  const [showShare, setShowShare] = useState(false);

  return (
    <div
      className="
        relative w-full rounded-xl overflow-hidden shadow-md bg-white 
        hover:shadow-xl transition cursor-pointer group
      "
    >
      {/* LINK - RUTA CORRECTA */}
      <Link href={`/${category}/${subcategory}/${slug}`}>
        <div className="relative aspect-[9/16] w-full bg-gray-100">
          <Image
            src={publicUrl(imagen)}
            alt={titulo}
            fill
            priority={false}
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      </Link>

      {/* OVERLAY BOTONES */}
      <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none">

        {/* TOP */}
        <div className="flex justify-between">
          {/* GUARDAR PINTEREST */}
          <button
            aria-label="Guardar en Pinterest"
            className="pointer-events-auto bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <Pin className="w-5 h-5 text-red-600" />
          </button>

          {/* DESCARGAR */}
          <a
            href={publicUrl(imagen)}
            download
            aria-label="Descargar"
            className="pointer-events-auto bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>

        {/* BOTTOM */}
        <div className="flex justify-between">
          {/* LIKE */}
          <button
            aria-label="Me gusta"
            onClick={() => setLiked(!liked)}
            className="pointer-events-auto bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <Heart className={`w-5 h-5 ${liked ? "text-red-600 fill-red-600" : ""}`} />
          </button>

          {/* COMPARTIR */}
          <button
            aria-label="Compartir"
            onClick={() => setShowShare(!showShare)}
            className="pointer-events-auto bg-white/90 backdrop-blur p-2 rounded-full shadow hover:bg-white"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* SHARE POPUP */}
      {showShare && (
        <div className="absolute bottom-3 right-3 bg-white rounded-lg shadow-lg p-2 z-50">
          <ShareButtons titulo={titulo} imagen={publicUrl(imagen)} />
        </div>
      )}

      {/* BODY */}
      <div className="p-3">
        <h3 className="text-lg font-semibold line-clamp-1">{titulo}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{descripcion}</p>

        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>❤️ {likes}</span>
          <span>⬇️ {downloads}</span>
        </div>
      </div>
    </div>
  );
}
