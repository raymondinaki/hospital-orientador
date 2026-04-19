import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface MappedinMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName?: string;
  moduleDescription?: string;
}

export function MappedinMapModal({
  isOpen,
  onClose,
  moduleName = 'Hospital',
  moduleDescription = 'Mapa Digital del Hospital',
}: MappedinMapModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full h-[90vh] p-0 border-0 rounded-lg overflow-hidden">
        <div className="flex flex-col h-full bg-white">
          {/* Header */}
          <DialogHeader className="bg-blue-600 text-white p-4 border-b-0 rounded-t-lg">
            <div className="flex items-center justify-between w-full">
              <div>
                <DialogTitle className="text-white text-lg font-semibold">
                  Mapa Digital del Hospital
                </DialogTitle>
                <p className="text-blue-100 text-sm mt-1">
                  {moduleName} • {moduleDescription}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-blue-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Map Container */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            <iframe
              src="https://app.mappedin.com/map/69e4fb85e0b785000bcf5441?embedded=true"
              title="Mapa Digital del Hospital - Mappedin"
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
          <div className="bg-gray-100 px-4 py-3 border-t text-sm text-gray-600">
            <p className="text-center">
              💡 Haz clic en los módulos para ver especialidades • Usa zoom y arrastra para navegar
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
