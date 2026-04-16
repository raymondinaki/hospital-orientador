import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, MapPin } from "lucide-react";
import { findPath, smoothPath } from "@/lib/pathfinding";

interface RoutePoint {
  x: number;
  y: number;
  label: string;
}

interface InteractiveMapNavigatorProps {
  mapUrl: string;
  startPoint?: RoutePoint;
  endPoint?: RoutePoint;
  onLocationSelect?: (point: RoutePoint) => void;
}

export default function InteractiveMapNavigator({
  mapUrl,
  startPoint,
  endPoint,
  onLocationSelect,
}: InteractiveMapNavigatorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapImage, setMapImage] = useState<HTMLImageElement | null>(null);
  const [routePath, setRoutePath] = useState<Array<{ x: number; y: number }>>([]);

  // Cargar imagen del mapa
  useEffect(() => {
    const img = new Image();
    img.src = mapUrl;
    img.onload = () => {
      setMapImage(img);
      drawMap(img, zoom, pan);
    };
  }, [mapUrl]);

  // Dibujar mapa en canvas
  const drawMap = (img: HTMLImageElement, currentZoom: number, currentPan: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.fillStyle = "#f5f5f5";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Guardar contexto
    ctx.save();

    // Aplicar transformaciones
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(currentZoom, currentZoom);
    ctx.translate(currentPan.x, currentPan.y);
    ctx.translate(-canvas.width / 2 / currentZoom, -canvas.height / 2 / currentZoom);

    // Dibujar imagen
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // Dibujar puntos de ruta
    if (startPoint) {
      drawPoint(ctx, startPoint, "#4CAF50", "Inicio");
    }
    if (endPoint) {
      drawPoint(ctx, endPoint, "#FF5722", "Destino");
    }

    // Dibujar línea de ruta si existen ambos puntos
    if (startPoint && endPoint) {
      drawRoute(ctx, startPoint, endPoint);
    }

    ctx.restore();
  };

  // Dibujar punto en el mapa
  const drawPoint = (ctx: CanvasRenderingContext2D, point: RoutePoint, color: string, label: string) => {
    // Círculo
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
    ctx.fill();

    // Borde
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Etiqueta
    ctx.fillStyle = color;
    ctx.font = "12px Arial";
    ctx.fillText(label, point.x + 12, point.y - 5);
  };

  // Dibujar ruta entre puntos
  const drawRoute = (ctx: CanvasRenderingContext2D, start: RoutePoint, end: RoutePoint) => {
    const path = findPath(start, end);
    const smoothedPath = smoothPath(path);
    setRoutePath(smoothedPath);

    ctx.strokeStyle = "#2196F3";
    ctx.lineWidth = 3;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(smoothedPath[0].x, smoothedPath[0].y);

    for (let i = 1; i < smoothedPath.length; i++) {
      ctx.lineTo(smoothedPath[i].x, smoothedPath[i].y);
    }

    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Redibuja cuando cambia zoom o pan
  useEffect(() => {
    if (mapImage) {
      drawMap(mapImage, zoom, pan);
    }
  }, [zoom, pan, mapImage]);

  // Manejo de zoom
  const handleZoom = (direction: "in" | "out") => {
    const newZoom = direction === "in" ? zoom * 1.2 : zoom / 1.2;
    setZoom(Math.max(0.5, Math.min(newZoom, 4)));
  };

  // Manejo de pan
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const dx = (e.clientX - dragStart.x) / zoom;
    const dy = (e.clientY - dragStart.y) / zoom;

    setPan({
      x: pan.x + dx,
      y: pan.y + dy,
    });

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Manejo de clic en el mapa
  const handleCanvasClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - canvas.width / 2) / zoom - pan.x + canvas.width / 2 / zoom;
    const y = (e.clientY - rect.top - canvas.height / 2) / zoom - pan.y + canvas.height / 2 / zoom;

    if (onLocationSelect) {
      onLocationSelect({
        x,
        y,
        label: `Ubicación (${Math.round(x)}, ${Math.round(y)})`,
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Canvas del mapa */}
      <div className="relative w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="w-full cursor-grab active:cursor-grabbing"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onClick={handleCanvasClick}
        />
      </div>

      {/* Controles de zoom */}
      <div className="flex gap-2 justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("out")}
          disabled={zoom <= 0.5}
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <span className="px-4 py-2 text-sm font-medium">{Math.round(zoom * 100)}%</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleZoom("in")}
          disabled={zoom >= 4}
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>

      {/* Información de ruta */}
      {startPoint && endPoint && (
        <div className="p-3 bg-blue-50 rounded-lg text-sm">
          <p className="text-gray-700">
            <MapPin className="w-4 h-4 inline mr-2" />
            Ruta desde <strong>{startPoint.label}</strong> hasta <strong>{endPoint.label}</strong>
          </p>
        </div>
      )}
    </div>
  );
}
