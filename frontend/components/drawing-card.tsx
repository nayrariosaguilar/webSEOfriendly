"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Heart, Download, Printer, ChevronDown } from "lucide-react";

const BASE = "https://dpvulchbiygiidolzrjl.supabase.co";
function getImageUrl(path: string) {
  // Si el path ya incluye el bucket (drawings/), usarlo directamente
  // Si no, agregar el prefijo drawings/
  if (path.startsWith("drawings/")) {
    return `${BASE}/storage/v1/object/public/${path}`;
  }
  return `${BASE}/storage/v1/object/public/drawings/${path}`;
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
  imagen,
  category,
  subcategory,
  likes = 0,
}: DrawingCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  const imageUrl = getImageUrl(imagen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setShowDownloadMenu(false);
      }
    };
    if (showDownloadMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDownloadMenu]);
  const pageUrl = typeof window !== "undefined"
    ? `${window.location.origin}/${category}/${subcategory}/${slug}`
    : "";

  const handleLike = async () => {
    if (!liked) {
      setLiked(true);
      setLikeCount(prev => prev + 1);
      try {
        await fetch(`/api/trending/${slug}/like`, { method: "POST" });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handlePinterest = () => {
    const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(pageUrl)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(titulo)}`;
    window.open(pinterestUrl, "_blank", "width=600,height=400");
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${titulo}</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;">
            <img src="${imageUrl}" style="max-width:100%;max-height:100vh;" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = async (format: string) => {
    setShowDownloadMenu(false);

    try {
      await fetch(`/api/trending/${slug}/download`, { method: "POST" });
    } catch (e) {
      console.error(e);
    }

    if (format === "png" || format === "jpg") {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = `${slug}.${format}`;
      link.click();
    } else if (format === "pdf") {
      window.open(imageUrl, "_blank");
    }
  };

  return (
    <div className="group relative">
      {/* Card Container */}
      <div className="relative rounded-2xl overflow-hidden bg-gray-100">
        {/* Image */}
        <Link href={`/${category}/${subcategory}/${slug}`}>
          <div className="relative aspect-[3/4] w-full">
            <Image
              src={imageUrl}
              alt={titulo}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>
        </Link>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200" />

        {/* Action Buttons - Visible on Hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">

          {/* Top Row */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
            {/* Pinterest Save */}
            <button
              onClick={handlePinterest}
              className="flex items-center gap-1.5 bg-[#E60023] hover:bg-[#ad081b] text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg transition-colors"
            >
              Guardar
            </button>

            {/* Download Dropdown */}
            <div className="relative" ref={downloadRef}>
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="flex items-center gap-1 bg-white hover:bg-gray-100 p-2.5 rounded-full shadow-lg transition-colors"
              >
                <Download className="w-5 h-5" />
                <ChevronDown className="w-4 h-4" />
              </button>

              {showDownloadMenu && (
                <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl py-2 min-w-[140px] z-50">
                  <button
                    onClick={() => handleDownload("png")}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm font-medium"
                  >
                    PNG
                  </button>
                  <button
                    onClick={() => handleDownload("jpg")}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm font-medium"
                  >
                    JPG
                  </button>
                  <button
                    onClick={() => handleDownload("pdf")}
                    className="w-full px-4 py-2.5 text-left hover:bg-gray-100 text-sm font-medium"
                  >
                    PDF
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Row */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
            {/* Like Button */}
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-full shadow-lg transition-all ${
                liked
                  ? "bg-red-500 text-white"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-white" : ""}`} />
              {likeCount > 0 && (
                <span className="text-sm font-medium">{likeCount}</span>
              )}
            </button>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="bg-white hover:bg-gray-100 p-2.5 rounded-full shadow-lg transition-colors"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Title Below Image */}
      <Link href={`/${category}/${subcategory}/${slug}`}>
        <h3 className="mt-2 px-1 text-sm font-medium text-gray-800 line-clamp-2 hover:text-gray-600 transition-colors">
          {titulo}
        </h3>
      </Link>
    </div>
  );
}

