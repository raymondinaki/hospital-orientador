import { useEffect, useRef, useState } from "react";
import { hospitalNodes } from "../../../shared/hospitalGraph";
import { MODULES, SPECIALTIES } from "../../../shared/data";
import { X } from "lucide-react";

interface DigitalFloorPlanProps {
  highlightModuleId?: string;
  width?: number;
  height?: number;
}

export default function DigitalFloorPlan({
  highlightModuleId,
  width = 800,
  height = 600,
}: DigitalFloorPlanProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(0);
  const lastZoomRef = useRef(1);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Encontrar el módulo a resaltar
  const highlightedModule = highlightModuleId
    ? hospitalNodes.find((node) => node.id === highlightModuleId)
    : null;

  // Obtener color del módulo
  const getModuleColor = (moduleId: string): string => {
    const module = MODULES.find((m) => m.id === moduleId);
    return module?.color || "#3B82F6";
  };

  // Convertir coordenadas del JSON (0-100) a píxeles del canvas
  const toCanvasX = (x: number): number => {
    return (x / 100) * width * zoom + panX;
  };

  const toCanvasY = (y: number): number => {
    return (y / 100) * height * zoom + panY;
  };

  const toCanvasWidth = (w: number): number => {
    return (w / 100) * width * zoom;
  };

  const toCanvasHeight = (h: number): number => {
    return (h / 100) * height * zoom;
  };

  // Obtener módulo desde nodeId
  const getModuleFromNodeId = (nodeId: string): string | null => {
    const graphIdToModuleId: Record<string, string> = {
      modulo_i1_sup: "i1",
      modulo_d_sup: "D",
      modulo_i3_inf: "i3",
      modulo_i2_inf: "i2",
      modulo_e_inf: "E",
      modulo_inchijap_inf: "Inchijap",
      modulo_b_inf: "B",
      modulo_espera_inf: "Espera",
      modulo_a_inf: "A",
      modulo_sui_inf: "SUI",
      modulo_recaudacion_inf: "Recaudacion",
      modulo_esperac_inf: "EsperaC",
      modulo_c_der: "C",
    };
    return graphIdToModuleId[nodeId] || null;
  };

  // Dibujar el plano
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Limpiar canvas
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);

    // Dibujar fondo con grid
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 0.5;
    const gridSize = 10;
    for (let i = 0; i <= width; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i <= height; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Dibujar pasillo principal
    const corridor = hospitalNodes.find((n) => n.id === "corridor_main");
    if (corridor && corridor.width && corridor.height) {
      const x = toCanvasX(corridor.x - corridor.width / 2);
      const y = toCanvasY(corridor.y - corridor.height / 2);
      const w = toCanvasWidth(corridor.width);
      const h = toCanvasHeight(corridor.height);

      ctx.fillStyle = "#FEF3C7";
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "#F59E0B";
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, w, h);
    }

    // Dibujar módulos
    hospitalNodes.forEach((node) => {
      if (node.type === "corridor") return;
      if (!node.width || !node.height) return;

      const x = toCanvasX(node.x - node.width / 2);
      const y = toCanvasY(node.y - node.height / 2);
      const w = toCanvasWidth(node.width);
      const h = toCanvasHeight(node.height);

      // Determinar color
      let fillColor = "#E0E7FF";
      let strokeColor = "#6366F1";
      let strokeWidth = 1.5;

      if (node.type === "module") {
        // Buscar el módulo correspondiente en MODULES
        const moduleData = MODULES.find((m) => {
          // Mapear IDs del grafo a IDs de MODULES
          const graphIdToModuleId: Record<string, string> = {
            modulo_i1_sup: "i1",
            modulo_d_sup: "D",
            modulo_i3_inf: "i3",
            modulo_i2_inf: "i2",
            modulo_e_inf: "E",
            modulo_inchijap_inf: "Inchijap",
            modulo_b_inf: "B",
            modulo_espera_inf: "Espera",
            modulo_a_inf: "A",
            modulo_sui_inf: "SUI",
            modulo_recaudacion_inf: "Recaudacion",
            modulo_esperac_inf: "EsperaC",
            modulo_c_der: "C",
          };
          return m.id === graphIdToModuleId[node.id];
        });

        if (moduleData) {
          fillColor = moduleData.color + "30"; // 30% opacity
          strokeColor = moduleData.color;
        }
      } else if (node.type === "special_area") {
        fillColor = "#DDD6FE";
        strokeColor = "#8B5CF6";
      }

      // Resaltar si es el módulo seleccionado
      if (selectedModule && node.id === selectedModule) {
        const moduleId = getModuleFromNodeId(node.id);
        if (moduleId) {
          fillColor = getModuleColor(moduleId) + "60";
          strokeColor = getModuleColor(moduleId);
          strokeWidth = 3;
        }
      }

      // Resaltar si es el módulo del highlight inicial
      if (highlightedModule && node.id === highlightedModule.id) {
        fillColor = highlightedModule.type === "module" ? getModuleColor(node.id) + "60" : "#FBBF24";
        strokeColor = highlightedModule.type === "module" ? getModuleColor(node.id) : "#F59E0B";
        strokeWidth = 3;
      }

      // Dibujar rectángulo del módulo
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.strokeRect(x, y, w, h);

      // Dibujar etiqueta del módulo
      ctx.fillStyle = "#1F2937";
      ctx.font = `bold ${Math.max(10, 12 * zoom)}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Truncar nombre si es muy largo
      let displayName = node.name;
      if (displayName.length > 15) {
        displayName = displayName.substring(0, 12) + "...";
      }

      ctx.fillText(displayName, x + w / 2, y + h / 2);
    });

    // Dibujar información de zoom
    ctx.fillStyle = "#6B7280";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Zoom: ${Math.round(zoom * 100)}%`, 10, 10);
  }, [zoom, panX, panY, width, height, highlightModuleId, selectedModule]);

  // Manejo de mouse para pan y zoom
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - dragStart.x);
    setPanY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleReset = () => {
    setZoom(1);
    setPanX(0);
    setPanY(0);
  };

  // Calcular distancia entre dos puntos de toque
  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = getDistance(e.touches[0], e.touches[1]);
      setTouchDistance(distance);
      lastZoomRef.current = zoom;
    } else if (e.touches.length === 1) {
      // Pan
      setIsDragging(true);
      setDragStart({ x: e.touches[0].clientX - panX, y: e.touches[0].clientY - panY });
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = newDistance / touchDistance;
      const newZoom = Math.max(0.5, Math.min(3, lastZoomRef.current * scale));
      setZoom(newZoom);
    } else if (e.touches.length === 1 && isDragging) {
      // Pan
      setPanX(e.touches[0].clientX - dragStart.x);
      setPanY(e.touches[0].clientY - dragStart.y);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setTouchDistance(0);
  };

  // Obtener especialidades del módulo seleccionado
  const getSelectedModuleSpecialties = () => {
    if (!selectedModule) return null;

    const moduleId = getModuleFromNodeId(selectedModule);
    if (!moduleId) return null;

    const module = MODULES.find((m) => m.id === moduleId);
    if (!module) return null;

    const specialties = SPECIALTIES.filter((s) => module.specialties.includes(s.id));
    return { module, specialties };
  };

  const moduleData = getSelectedModuleSpecialties();

  // Renderizar botones interactivos sobre los módulos
  const renderModuleButtons = () => {
    return hospitalNodes
      .filter((node) => node.type === "module" && node.width && node.height)
      .map((node) => {
        const x = toCanvasX(node.x - (node.width || 0) / 2);
        const y = toCanvasY(node.y - (node.height || 0) / 2);
        const w = toCanvasWidth(node.width || 0);
        const h = toCanvasHeight(node.height || 0);

        return (
          <button
            key={node.id}
            onClick={() => setSelectedModule(node.id)}
            className="absolute hover:opacity-80 transition-opacity"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${w}px`,
              height: `${h}px`,
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
              zIndex: 10,
            }}
            title={`Haz clic para ver especialidades de ${node.name}`}
          />
        );
      });
  };

  return (
    <div className="flex flex-col gap-4">
      <div ref={containerRef} className="relative bg-white border-2 border-slate-200 rounded-lg overflow-hidden touch-none inline-block" style={{ width: `${width}px`, height: `${height}px`, position: "relative" }}>
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="cursor-grab active:cursor-grabbing w-full"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
        {/* Botones interactivos sobre los módulos */}
        <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
          <div style={{ pointerEvents: "auto", position: "relative", width: "100%", height: "100%" }}>
            {renderModuleButtons()}
          </div>
        </div>
      </div>

      {/* Controles - Solo visible en desktop */}
      <div className="hidden md:flex gap-2 justify-center">
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Zoom
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.5, z / 1.2))}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          − Zoom
        </button>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          Restablecer
        </button>
      </div>

      {/* Instrucciones para móvil */}
      <div className="md:hidden bg-blue-50 p-3 rounded-lg border border-blue-200 text-center">
        <p className="text-xs text-blue-800">
          👆 Pellizca para zoom • Arrastra para mover • Toca un módulo para ver especialidades
        </p>
      </div>

      {/* Leyenda */}
      <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <p className="text-sm font-semibold text-slate-900 mb-2">Leyenda:</p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-100 border-2 border-amber-500" />
            <span>Pasillo Principal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-600" />
            <span>Módulos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-100 border-2 border-purple-600" />
            <span>Áreas Especiales</span>
          </div>
        </div>
      </div>

      {/* Modal con especialidades del módulo seleccionado */}
      {moduleData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
            {/* Header */}
            <div
              className="px-6 py-4 text-white flex items-center justify-between"
              style={{ backgroundColor: moduleData.module.color }}
            >
              <div>
                <h2 className="text-2xl font-bold">{moduleData.module.name}</h2>
                <p className="text-sm opacity-90">{moduleData.module.floor} • {moduleData.module.location}</p>
              </div>
              <button
                onClick={() => setSelectedModule(null)}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Contenido */}
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <p className="text-sm font-semibold text-slate-900 mb-4">
                {moduleData.specialties.length} especialidades disponibles:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {moduleData.specialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-100 transition-colors"
                  >
                    <p className="font-semibold text-slate-900">{specialty.name}</p>
                    {specialty.description && (
                      <p className="text-xs text-slate-600 mt-1">{specialty.description}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">{specialty.floor}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
              <button
                onClick={() => setSelectedModule(null)}
                className="w-full px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
