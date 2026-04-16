/**
 * Algoritmo de enrutamiento A* para encontrar rutas realistas respetando pasillos
 */

interface Node {
  x: number;
  y: number;
  g: number; // Costo desde el inicio
  h: number; // Heurística (distancia estimada al destino)
  f: number; // g + h
  parent: Node | null;
}

interface PathPoint {
  x: number;
  y: number;
}

// Definir pasillos principales del hospital (áreas de circulación permitida)
// Estos son rectángulos que representan pasillos y espacios abiertos
export const CORRIDORS: Array<{ x: number; y: number; width: number; height: number }> = [
  // Pasillo central horizontal
  { x: 50, y: 350, width: 750, height: 80 },
  // Pasillo vertical izquierdo
  { x: 50, y: 150, width: 100, height: 280 },
  // Pasillo vertical derecho
  { x: 700, y: 200, width: 100, height: 350 },
  // Pasillo superior
  { x: 150, y: 100, width: 600, height: 100 },
  // Conexiones entre pasillos
  { x: 250, y: 200, width: 80, height: 180 },
  { x: 500, y: 250, width: 80, height: 150 },
];

// Función para verificar si un punto está dentro de un pasillo
function isInCorridor(x: number, y: number): boolean {
  return CORRIDORS.some(
    (corridor) =>
      x >= corridor.x &&
      x <= corridor.x + corridor.width &&
      y >= corridor.y &&
      y <= corridor.y + corridor.height
  );
}

// Función para calcular distancia euclidiana
function heuristic(a: PathPoint, b: PathPoint): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

// Función para obtener vecinos válidos
function getNeighbors(node: Node, stepSize: number = 20): Node[] {
  const neighbors: Node[] = [];
  const directions = [
    { dx: stepSize, dy: 0 },
    { dx: -stepSize, dy: 0 },
    { dx: 0, dy: stepSize },
    { dx: 0, dy: -stepSize },
    { dx: stepSize, dy: stepSize },
    { dx: -stepSize, dy: stepSize },
    { dx: stepSize, dy: -stepSize },
    { dx: -stepSize, dy: -stepSize },
  ];

  for (const dir of directions) {
    const newX = node.x + dir.dx;
    const newY = node.y + dir.dy;

    if (isInCorridor(newX, newY)) {
      neighbors.push({
        x: newX,
        y: newY,
        g: 0,
        h: 0,
        f: 0,
        parent: null,
      });
    }
  }

  return neighbors;
}

// Algoritmo A* para encontrar la ruta más corta
export function findPath(start: PathPoint, end: PathPoint): PathPoint[] {
  const openSet: Node[] = [];
  const closedSet: Set<string> = new Set();

  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start, end),
    f: heuristic(start, end),
    parent: null,
  };

  openSet.push(startNode);

  while (openSet.length > 0) {
    // Encontrar el nodo con menor f
    let current = openSet[0];
    let currentIndex = 0;

    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < current.f) {
        current = openSet[i];
        currentIndex = i;
      }
    }

    // Si llegamos al destino, reconstruir la ruta
    if (heuristic({ x: current.x, y: current.y }, end) < 30) {
      const path: PathPoint[] = [];
      let node: Node | null = current;

      while (node) {
        path.unshift({ x: node.x, y: node.y });
        node = node.parent;
      }

      return path;
    }

    openSet.splice(currentIndex, 1);
    closedSet.add(`${current.x},${current.y}`);

    // Explorar vecinos
    const neighbors = getNeighbors(current);

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;

      if (closedSet.has(key)) continue;

      const g = current.g + heuristic({ x: current.x, y: current.y }, neighbor);
      const h = heuristic(neighbor, end);
      const f = g + h;

      let existingNode = openSet.find((n) => n.x === neighbor.x && n.y === neighbor.y);

      if (!existingNode) {
        neighbor.g = g;
        neighbor.h = h;
        neighbor.f = f;
        neighbor.parent = current;
        openSet.push(neighbor);
      } else if (g < existingNode.g) {
        existingNode.g = g;
        existingNode.f = g + existingNode.h;
        existingNode.parent = current;
      }
    }
  }

  // Si no se encuentra ruta, retornar línea recta como fallback
  return [start, end];
}

// Función para suavizar la ruta (reducir puntos innecesarios)
export function smoothPath(path: PathPoint[]): PathPoint[] {
  if (path.length <= 2) return path;

  const smoothed: PathPoint[] = [path[0]];

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1];
    const current = path[i];
    const next = path[i + 1];

    // Calcular si el punto actual es necesario
    const dx1 = current.x - prev.x;
    const dy1 = current.y - prev.y;
    const dx2 = next.x - current.x;
    const dy2 = next.y - current.y;

    const angle = Math.atan2(dy1, dx1) - Math.atan2(dy2, dx2);

    // Si el ángulo es significativo, mantener el punto
    if (Math.abs(angle) > 0.1) {
      smoothed.push(current);
    }
  }

  smoothed.push(path[path.length - 1]);
  return smoothed;
}
