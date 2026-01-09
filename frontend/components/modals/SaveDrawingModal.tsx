"use client";

import { useState } from "react";
import { Modal } from "@/frontend/components/ui/modal";
import { Button } from "@/frontend/components/ui/button";
import {
  Bookmark,
  FolderPlus,
  Check,
  Sparkles,
  Heart,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Collection {
  id: string;
  name: string;
  icon: React.ReactNode;
  count: number;
}

interface SaveDrawingModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  onSave?: (collectionId: string) => void;
}

// Mock collections data
const mockCollections: Collection[] = [
  { id: "favorites", name: "Mis Favoritos", icon: <Heart className="w-5 h-5 text-red-500" />, count: 24 },
  { id: "later", name: "Ver Despues", icon: <Clock className="w-5 h-5 text-blue-500" />, count: 12 },
  { id: "kids", name: "Para los Ninos", icon: <Sparkles className="w-5 h-5 text-yellow-500" />, count: 45 },
];

export function SaveDrawingModal({
  isOpen,
  onClose,
  imageUrl,
  title,
  onSave,
}: SaveDrawingModalProps) {
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    if (!selectedCollection) return;

    setSaving(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSaving(false);
    setSaved(true);

    onSave?.(selectedCollection);

    setTimeout(() => {
      onClose();
      setSaved(false);
      setSelectedCollection(null);
    }, 1000);
  };

  const handleCreateCollection = async () => {
    if (!newCollectionName.trim()) return;

    // Mock creating collection
    await new Promise((resolve) => setTimeout(resolve, 500));
    setShowNewCollection(false);
    setNewCollectionName("");
    // In real implementation, add to collections list
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Guardar Dibujo" size="md">
      <div className="space-y-4">
        {/* Preview */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
          <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 truncate">{title}</h3>
            <p className="text-sm text-gray-500">Selecciona una coleccion</p>
          </div>
        </div>

        {/* Collections List */}
        <div className="space-y-2">
          {mockCollections.map((collection) => (
            <button
              key={collection.id}
              onClick={() => setSelectedCollection(collection.id)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition",
                selectedCollection === collection.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center">
                {collection.icon}
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900">{collection.name}</p>
                <p className="text-sm text-gray-500">{collection.count} dibujos</p>
              </div>
              {selectedCollection === collection.id && (
                <Check className="w-5 h-5 text-blue-500" />
              )}
            </button>
          ))}
        </div>

        {/* Create New Collection */}
        {!showNewCollection ? (
          <button
            onClick={() => setShowNewCollection(true)}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-700 transition"
          >
            <FolderPlus className="w-5 h-5" />
            <span>Crear nueva coleccion</span>
          </button>
        ) : (
          <div className="p-3 border-2 border-blue-200 bg-blue-50 rounded-xl space-y-3">
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="Nombre de la coleccion"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowNewCollection(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleCreateCollection}
                className="flex-1"
              >
                Crear
              </Button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="pt-2">
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedCollection || saving}
            className={cn(
              "w-full flex items-center justify-center gap-2",
              saved && "bg-green-500 hover:bg-green-500"
            )}
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Check className="w-5 h-5" />
                Guardado!
              </>
            ) : (
              <>
                <Bookmark className="w-5 h-5" />
                Guardar en coleccion
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
