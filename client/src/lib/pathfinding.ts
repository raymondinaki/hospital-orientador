/**
 * Algoritmo de enrutamiento A* para encontrar rutas realistas respetando pasillos
 * Basado en el grafo espacial real del Hospital Clínico San Borja Arriarán
 */

import { hospitalGraph, getNodeById, getConnectedEdges, calculateDistance } from "@shared/hospitalGraph";

interface PathNode {
  nodeId: string;
  x: number;
  y: number;
  g: number; // Costo desde el inicio
  h: number; // Heurística (distancia estimada al destino)
  f: number; // g + h
  parent: PathNode | null;
}

export interface PathPoint {
  x: number;
  y: number;
  nodeId?: string;
}

/**
 * Función para calcular distancia euclidiana entre dos puntos
 */
function heuristic(a: PathPoint, b: PathPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Función para verificar si un punto está dentro del área del hospital
 */
function isValidPoint(x: number, y: number): boolean {
  // Validar que el punto esté dentro de los límites del hospital
  return x >= 0 && x <= 100 && y >= -50 && y <= 50;
}

/**
 * Algoritmo A* para encontrar la ruta más corta respetando la geometría del pasillo
 */
export function findPath(startNodeId: string, endNodeId: string): PathPoint[] {
  const startNode = getNodeById(startNodeId);
  const endNode = getNodeById(endNodeId);

  if (!startNode || !endNode) {
    console.error("Nodo de inicio o fin no encontrado");
    return [];
  }

  // Si es el mismo nodo, retornar ruta directa
  if (startNodeId === endNodeId) {
    return [{ x: startNode.x, y: startNode.y, nodeId: startNodeId }];
  }

  const openSet: PathNode[] = [];
  const closedSet: Set<string> = new Set();
  const gScore: Map<string, number> = new Map();
  const cameFrom: Map<string, PathNode | null> = new Map();

  // Nodo inicial
  const startPathNode: PathNode = {
    nodeId: startNodeId,
    x: startNode.x,
    y: startNode.y,
    g: 0,
    h: heuristic({ x: startNode.x, y: startNode.y }, { x: endNode.x, y: endNode.y }),
    f: 0,
    parent: null,
  };

  startPathNode.f = startPathNode.g + startPathNode.h;
  openSet.push(startPathNode);
  gScore.set(startNodeId, 0);

  while (openSet.length > 0) {
    // Encontrar nodo con menor f en openSet
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < current.f) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    // Si llegamos al destino, reconstruir la ruta
    if (current.nodeId === endNodeId) {
      const path: PathPoint[] = [];
      let node: PathNode | null = current;

      while (node !== null) {
        path.unshift({ x: node.x, y: node.y, nodeId: node.nodeId });
        node = node.parent;
      }

      return path;
    }

    openSet.splice(currentIndex, 1);
    closedSet.add(current.nodeId);

    // Explorar vecinos
    const edges = getConnectedEdges(current.nodeId);

    for (const edge of edges) {
      const neighborNodeId = edge.from === current.nodeId ? edge.to : edge.from;

      if (closedSet.has(neighborNodeId)) {
        continue;
      }

      const neighborNode = getNodeById(neighborNodeId);
      if (!neighborNode) continue;

      // Calcular distancia entre nodos
      const distance = calculateDistance(
        { x: current.x, y: current.y, id: current.nodeId, name: "", type: "module" },
        neighborNode
      );

      const tentativeGScore = (gScore.get(current.nodeId) || 0) + distance;

      // Si este camino es mejor que el anterior
      if (!gScore.has(neighborNodeId) || tentativeGScore < gScore.get(neighborNodeId)!) {
        gScore.set(neighborNodeId, tentativeGScore);

        const hScore = heuristic(
          { x: neighborNode.x, y: neighborNode.y },
          { x: endNode.x, y: endNode.y }
        );

        const neighborPathNode: PathNode = {
          nodeId: neighborNodeId,
          x: neighborNode.x,
          y: neighborNode.y,
          g: tentativeGScore,
          h: hScore,
          f: tentativeGScore + hScore,
          parent: current,
        };

        // Verificar si el nodo ya está en openSet
        const existingIndex = openSet.findIndex((n) => n.nodeId === neighborNodeId);
        if (existingIndex === -1) {
          openSet.push(neighborPathNode);
        } else if (neighborPathNode.f < openSet[existingIndex].f) {
          openSet[existingIndex] = neighborPathNode;
        }
      }
    }
  }

  // No se encontró ruta
  console.warn("No se encontró ruta entre los nodos");
  return [];
}

/**
 * Función para obtener puntos interpolados entre dos nodos para suavizar la ruta
 */
export function smoothPath(path: PathPoint[], steps: number = 5): PathPoint[] {
  if (path.length < 2) return path;

  const smoothed: PathPoint[] = [];

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    smoothed.push(current);

    // Interpolar puntos entre nodos
    for (let j = 1; j < steps; j++) {
      const t = j / steps;
      const x = current.x + (next.x - current.x) * t;
      const y = current.y + (next.y - current.y) * t;

      // Verificar que el punto interpolado sea válido
      if (isValidPoint(x, y)) {
        smoothed.push({ x, y });
      }
    }
  }

  // Agregar el último punto
  smoothed.push(path[path.length - 1]);

  return smoothed;
}

/**
 * Función para obtener instrucciones de navegación basadas en la ruta
 */
export function getNavigationInstructions(path: PathPoint[]): string[] {
  const instructions: string[] = [];

  if (path.length < 2) {
    return ["Ya estás en el destino"];
  }

  for (let i = 0; i < path.length - 1; i++) {
    const current = path[i];
    const next = path[i + 1];

    // Calcular ángulo de dirección
    const dx = next.x - current.x;
    const dy = next.y - current.y;
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);

    // Normalizar ángulo a 0-360
    const normalizedAngle = (angle + 360) % 360;

    // Determinar dirección
    let direction = "";
    if (normalizedAngle < 45 || normalizedAngle > 315) {
      direction = "hacia la derecha";
    } else if (normalizedAngle < 135) {
      direction = "hacia arriba";
    } else if (normalizedAngle < 225) {
      direction = "hacia la izquierda";
    } else {
      direction = "hacia abajo";
    }

    // Calcular distancia
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceText = distance > 50 ? "bastante" : distance > 30 ? "un poco" : "muy poco";

    instructions.push(`Camina ${distanceText} ${direction}`);
  }

  return instructions;
}
