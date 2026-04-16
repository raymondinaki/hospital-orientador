'use client';

import { useRef, useState, useEffect } from "react";
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
  const [zoom, setZoom] = useState(0.8);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const lastClickTimeRef = useRef(0);

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

    // Dibujar fondo con grid sutil
    ctx.strokeStyle = "#E5E7EB";
    ctx.lineWidth = 0.5;
    const gridSize = 20;
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
    const pasillo = { x: 0, y: 45, width: 90, height: 5 };
    ctx.fillStyle = "#FCD34D";
    ctx.fillRect(
      toCanvasX(pasillo.x),
      toCanvasY(pasillo.y),
      toCanvasWidth(pasillo.width),
      toCanvasHeight(pasillo.height)
    );
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 2;
    ctx.strokeRect(
      toCanvasX(pasillo.x),
      toCanvasY(pasillo.y),
      toCanvasWidth(pasillo.width),
      toCanvasHeight(pasillo.height)
    );

    // Dibujar módulos
    hospitalNodes.forEach((node: any) => {
      if (node.id === "corridor_main") return;

      const isHighlighted = highlightedModule?.id === node.id;
      const isSelected = selectedModule && getModuleFromNodeId(node.id) === selectedModule;

      // Color del módulo
      const moduleId = getModuleFromNodeId(node.id);
      let fillColor = getModuleColor(moduleId || "");

      if (isHighlighted) {
        fillColor = "#3B82F6";
      } else if (isSelected) {
        fillColor = "#10B981";
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(
        toCanvasX(node.x),
        toCanvasY(node.y),
        toCanvasWidth(node.width || 10),
        toCanvasHeight(node.height || 10)
      );

      // Borde del módulo
      ctx.strokeStyle = isHighlighted || isSelected ? "#1F2937" : "#D1D5DB";
      ctx.lineWidth = isHighlighted || isSelected ? 3 : 1;
      ctx.strokeRect(
        toCanvasX(node.x as number),
        toCanvasY(node.y as number),
        toCanvasWidth((node.width || 10) as number),
        toCanvasHeight((node.height || 10) as number)
      );

      // Etiqueta del módulo
      const labelX = toCanvasX(node.x + (node.width || 10) / 2);
      const labelY = toCanvasY(node.y + (node.height || 10) / 2);
      const fontSize = Math.max(10, 12 * zoom);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillStyle = "#1F2937";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.id.replace("modulo_", "").replace(/_/g, " ").toUpperCase(), labelX, labelY);
    });

    // Leyenda
    const legendY = height - 60;
    ctx.fillStyle = "#F3F4F6";
    ctx.fillRect(0, legendY, width, 60);
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 1;
    ctx.strokeRect(0, legendY, width, 60);

    ctx.font = "12px Arial";
    ctx.fillStyle = "#1F2937";
    ctx.textAlign = "left";
    ctx.fillText("Leyenda:", 10, legendY + 15);
    
    ctx.fillStyle = "#FCD34D";
    ctx.fillRect(10, legendY + 20, 15, 15);
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, legendY + 20, 15, 15);
    ctx.fillStyle = "#1F2937";
    ctx.fillText("Pasillo Principal", 30, legendY + 27);

    ctx.fillStyle = "#E5E7EB";
    ctx.fillRect(200, legendY + 20, 15, 15);
    ctx.strokeStyle = "#D1D5DB";
    ctx.lineWidth = 1;
    ctx.strokeRect(200, legendY + 20, 15, 15);
    ctx.fillStyle = "#1F2937";
    ctx.fillText("Áreas Especiales", 220, legendY + 27);
  }, [zoom, panX, panY, highlightModuleId, selectedModule, width, height]);

  // Detectar doble clic para zoom
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const now = Date.now();
    const isDoubleClick = now - lastClickTimeRef.current < 300;
    lastClickTimeRef.current = now;

    if (isDoubleClick) {
      // Doble clic: zoom in
      const newZoom = Math.min(3, zoom * 1.5);
      setZoom(newZoom);
    } else {
      // Clic simple: detectar módulo
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const clickX = (e.clientX - rect.left - panX) / zoom / (width / 100);
      const clickY = (e.clientY - rect.top - panY) / zoom / (height / 100);

      // Buscar módulo en la posición del clic
      for (const node of hospitalNodes) {
        const nodeAny = node as any;
        if (node.id === "corridor_main") continue;
        if (
          clickX >= nodeAny.x &&
          clickX <= nodeAny.x + (nodeAny.width || 10) &&
          clickY >= nodeAny.y &&
          clickY <= nodeAny.y + (nodeAny.height || 10)
        ) {
          const moduleId = getModuleFromNodeId(node.id);
          if (moduleId) {
            setSelectedModule(moduleId);
          }
          break;
        }
      }
    }
  };

  // Manejo de arrastre (pan)
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging) {
      setPanX(e.clientX - dragStart.x);
      setPanY(e.clientY - dragStart.y);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Zoom con rueda del mouse
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.5, Math.min(3, zoom * delta));
    setZoom(newZoom);
  };

  const handleZoomIn = () => {
    setZoom((z) => Math.min(3, z * 1.2));
  };

  const handleZoomOut = () => {
    setZoom((z) => Math.max(0.5, z * 0.8));
  };

  const handleReset = () => {
    setZoom(0.8);
    setPanX(0);
    setPanY(0);
  };

  // Obtener especialidades del módulo seleccionado
  const getSelectedModuleSpecialties = () => {
    if (!selectedModule) return null;

    const module = MODULES.find((m) => m.id === selectedModule);
    if (!module) return null;

    const specialties = SPECIALTIES.filter((s) => s.module === selectedModule);
    return { module, specialties };
  };

  const moduleData = getSelectedModuleSpecialties();

  return (
    <div ref={containerRef} className="flex flex-col gap-4 w-full">
      {/* Canvas del plano */}
      <div className="relative bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onClick={handleCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="w-full h-auto cursor-grab active:cursor-grabbing"
        />

        {/* Controles de zoom */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <button
            onClick={handleZoomIn}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold text-sm"
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded font-semibold text-sm"
          >
            −
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded font-semibold text-sm"
          >
            Restablecer
          </button>
        </div>

        {/* Instrucciones en móvil */}
        <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-xs md:hidden">
          Doble clic para zoom • Arrastra para mover
        </div>
      </div>

      {/* Modal de especialidades del módulo seleccionado */}
      {moduleData && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">{moduleData.module.name}</h3>
              <p className="text-sm text-gray-600">{moduleData.module.floor} • {moduleData.module.location}</p>
            </div>
            <button
              onClick={() => setSelectedModule(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              {moduleData.specialties.length} especialidades disponibles:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto">
            {moduleData.specialties.map((specialty) => (
              <div key={specialty.id} className="p-3 bg-gray-50 rounded border border-gray-200">
                <p className="font-semibold text-gray-900 text-sm">{specialty.name}</p>
                {specialty.description && (
                  <p className="text-xs text-gray-600 mt-1">{specialty.description}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">{specialty.floor}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setSelectedModule(null)}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-2 rounded font-semibold text-sm"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Mensaje cuando no hay módulo seleccionado */}
      {!moduleData && (
        <div className="text-center text-gray-500 text-sm py-4">
          Haz clic en un módulo para ver sus especialidades
        </div>
      )}
    </div>
  );
}
