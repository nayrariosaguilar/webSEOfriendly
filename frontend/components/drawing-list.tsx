import { DrawingCard } from "./drawing-card";

interface DrawingListProps {
  dibujos: Array<{
    slug: string;
    titulo: string;
    descripcion: string;
    imagen: string;
    category: string;
    subcategory: string;
  }>;
}

export function DrawingList({ dibujos }: DrawingListProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {dibujos.map((d) => (
        <DrawingCard
          key={d.slug}
          slug={d.slug}
          titulo={d.titulo}
          descripcion={d.descripcion}
          imagen={d.imagen}
          category={d.category}
          subcategory={d.subcategory}
        />
      ))}
    </div>
  );
}
