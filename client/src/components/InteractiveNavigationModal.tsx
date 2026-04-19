import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InteractiveNavigationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InteractiveNavigationModal({
  isOpen,
  onClose,
}: InteractiveNavigationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full h-[90vh] p-0 border-0 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <DialogHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 border-b border-blue-800">
            <div className="flex items-center justify-between w-full">
              <DialogTitle className="text-xl font-bold text-white">
                Navegación Interactiva del Hospital
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-blue-700 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Map Container */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            <iframe
              src="https://app.mappedin.com/map/69e516a190b035000b818fc6?embedded=true"
              title="Navegación Interactiva del Hospital - Mappedin"
              allow="clipboard-write 'self' https://app.mappedin.com; web-share 'self' https://app.mappedin.com"
              scrolling="no"
              width="100%"
              height="100%"
              frameBorder="0"
              style={{ border: 0 }}
              loading="lazy"
              className="w-full h-full"
            />
          </div>

          {/* Footer Instructions */}
          <div className="bg-gray-100 px-6 py-3 border-t text-sm text-gray-600">
            <p className="text-center">
              Usa el mapa para explorar todas las áreas del hospital • Busca especialidades y ubicaciones • Obtén instrucciones de navegación
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
