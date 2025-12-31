"use client";

interface ShareButtonsProps {
  titulo: string;
  imagen: string;
}

export function ShareButtons({ titulo, imagen }: ShareButtonsProps) {
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`Mira este dibujo para colorear: ${titulo}`);
    const url = encodeURIComponent(currentUrl);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  const sharePinterest = () => {
    const url = encodeURIComponent(currentUrl);
    const media = encodeURIComponent(imagen);
    const desc = encodeURIComponent(titulo);
    window.open(
      `https://pinterest.com/pin/create/button/?url=${url}&media=${media}&description=${desc}`,
      "_blank"
    );
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imagen;
    link.download = titulo.replace(/\s+/g, "_");
    link.click();
  };

  const printImage = () => {
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(
      `<img src="${imagen}" onload="window.print();window.close();" />`
    );
  };

  return (
    <div className="flex flex-wrap gap-3 mt-6">
      <button
        onClick={shareWhatsApp}
        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        WhatsApp
      </button>

      <button
        onClick={sharePinterest}
        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
      >
        Pinterest
      </button>

      <button
        onClick={downloadImage}
        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Descargar
      </button>

      <button
        onClick={printImage}
        className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition"
      >
        Imprimir
      </button>
    </div>
  );
}
