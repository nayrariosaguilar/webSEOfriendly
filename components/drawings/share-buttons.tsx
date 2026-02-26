'use client';

import { useState, useEffect } from 'react';
import { Share2, Facebook, Link as LinkIcon, Pin } from 'lucide-react';

interface ShareButtonsProps {
  titulo: string;
  imagen: string;
}

export function ShareButtons({ titulo, imagen }: ShareButtonsProps) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);
  
  const shareLinks = [
    {
      name: 'Pinterest',
      icon: <Pin className="w-4 h-4" />,
      href: `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(url)}&media=${encodeURIComponent(imagen)}&description=${encodeURIComponent(titulo)}`,
      color: 'bg-[#E60023] hover:bg-[#ad001a]'
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-4 h-4" />,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      color: 'bg-[#1877F2] hover:bg-[#0d65d9]'
    },
    {
      name: 'Copiar',
      icon: <LinkIcon className="w-4 h-4" />,
      onClick: () => {
        navigator.clipboard.writeText(url);
        alert('Enlace copiado al portapapeles');
      },
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];

  return (
    <div className="flex flex-wrap gap-3 items-center">
      <span className="text-sm font-medium text-gray-500 flex items-center gap-2">
        <Share2 className="w-4 h-4" /> Compartir:
      </span>
      {shareLinks.map((link) => (
        link.href ? (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${link.color}`}
          >
            {link.icon}
            {link.name}
          </a>
        ) : (
          <button
            key={link.name}
            onClick={link.onClick}
            className={`flex items-center gap-2 text-white px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${link.color}`}
          >
            {link.icon}
            {link.name}
          </button>
        )
      ))}
    </div>
  );
}
