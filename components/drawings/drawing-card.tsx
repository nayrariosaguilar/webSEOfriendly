import Image from 'next/image';
import Link from 'next/link';
import { Download, Heart } from 'lucide-react';
import { type Drawing, getPublicUrl } from '@/lib/api';

interface DrawingCardProps {
  drawing: Drawing;
}

export function DrawingCard({ drawing }: DrawingCardProps) {
  const imageUrl = getPublicUrl(drawing.imagen);
  const href = `/${drawing.category_slug || 'dibujos'}/${drawing.subcategory_slug || 'general'}/${drawing.slug}`;

  return (
    <div className="group relative bg-white border border-gray-100 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <Link href={href} className="block aspect-square relative bg-gray-50 flex-shrink-0">
        <Image
          src={imageUrl}
          alt={drawing.titulo}
          fill
          className="object-contain p-2 sm:p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
        />
      </Link>
      
      <div className="p-3 sm:p-4 flex flex-col flex-grow justify-between">
        <Link href={href}>
          <h3 className="font-bold text-gray-800 text-sm sm:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
            {drawing.titulo}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Heart className="w-3 sm:h-3.5 text-red-400" /> {drawing.likes || 0}
            </span>
          </div>
          
          <Link 
            href={href}
            className="text-[10px] sm:text-xs font-bold text-blue-500 hover:underline"
          >
            Ver →
          </Link>
        </div>
      </div>
    </div>
  );
}
