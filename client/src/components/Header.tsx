import { MapPin, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Header() {
  const [favorites, setFavorites] = useState<string[]>([]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo y Título */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Orientador Hospital</h1>
              <p className="text-xs text-slate-500 font-medium">Encuentra especialidades al instante</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-600 hover:text-blue-600"
              title="Favoritos"
            >
              <Heart className="w-5 h-5" />
              {favorites.length > 0 && (
                <span className="ml-1 text-xs font-semibold">{favorites.length}</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
