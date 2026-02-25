import { type Drawing } from '@/lib/api';
import { DrawingCard } from './drawing-card';

interface DrawingListProps {
  dibujos: Drawing[];
}

export function DrawingList({ dibujos }: DrawingListProps) {
  if (dibujos.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
        <p className="text-gray-400">No se encontraron dibujos. ¡Vuelve pronto!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
      {dibujos.map((drawing) => (
        <DrawingCard key={drawing.id} drawing={drawing} />
      ))}
    </div>
  );
}
