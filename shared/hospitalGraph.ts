/**
 * Grafo Espacial del Hospital Clínico San Borja Arriarán
 * Basado en el plano del pasillo principal
 * 
 * Sistema de Coordenadas:
 * - Origen (0, 0) en el inicio del pasillo principal (izquierda)
 * - X: Eje horizontal (izquierda a derecha a lo largo del pasillo)
 * - Y: Eje vertical (arriba/abajo desde el pasillo central)
 * - Unidades: Relativas (normalizadas 0-100)
 */

export interface Node {
  id: string;
  name: string;
  type: 'module' | 'intersection' | 'special_area' | 'corridor';
  x: number; // Coordenada X (0-100)
  y: number; // Coordenada Y (-50 a 50, siendo 0 el pasillo principal)
  width?: number; // Ancho relativo
  height?: number; // Alto relativo
  floor?: string; // Piso: "1er piso", "2do piso"
  description?: string;
}

export interface Edge {
  from: string; // ID del nodo origen
  to: string; // ID del nodo destino
  distance: number; // Distancia relativa
  type: 'corridor' | 'connection' | 'stairs'; // Tipo de conexión
}

export interface HospitalGraph {
  nodes: Node[];
  edges: Edge[];
  mainCorridor: {
    startX: number;
    endX: number;
    y: number; // Y = 0 (línea central)
  };
}

/**
 * NODOS DEL HOSPITAL
 * Basados en la estructura visual del plano del pasillo principal
 */
export const hospitalNodes: Node[] = [
  // PASILLO PRINCIPAL (eje central)
  {
    id: 'corridor_main',
    name: 'Pasillo Principal',
    type: 'corridor',
    x: 50,
    y: 0,
    width: 100,
    height: 8,
    floor: '1er piso',
    description: 'Pasillo central principal del hospital'
  },

  // LADO IZQUIERDO (arriba del pasillo)
  {
    id: 'modulo_i3',
    name: 'Módulo i3',
    type: 'module',
    x: 5,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo i3 - 1er piso - Lado izquierdo'
  },
  {
    id: 'modulo_i2',
    name: 'Módulo i2',
    type: 'module',
    x: 20,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo i2 - 1er piso - Lado izquierdo'
  },
  {
    id: 'modulo_e',
    name: 'Módulo E',
    type: 'module',
    x: 35,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo E - 1er piso - Lado izquierdo'
  },
  {
    id: 'modulo_b',
    name: 'Módulo B',
    type: 'module',
    x: 50,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo B - 1er piso - Lado izquierdo'
  },
  {
    id: 'modulo_a',
    name: 'Módulo A',
    type: 'module',
    x: 65,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo A - 1er piso - Lado izquierdo'
  },

  // LADO DERECHO (arriba del pasillo)
  {
    id: 'modulo_i1',
    name: 'Módulo i1',
    type: 'module',
    x: 80,
    y: -25,
    width: 12,
    height: 20,
    floor: '1er piso',
    description: 'Módulo i1 - 1er piso - Lado derecho'
  },
  {
    id: 'modulo_d',
    name: 'Módulo D',
    type: 'module',
    x: 80,
    y: -10,
    width: 12,
    height: 15,
    floor: '1er piso',
    description: 'Módulo D - 1er piso - Lado derecho'
  },

  // LADO DERECHO (abajo del pasillo)
  {
    id: 'sui',
    name: 'SUI',
    type: 'special_area',
    x: 80,
    y: 10,
    width: 10,
    height: 12,
    floor: '1er piso',
    description: 'SUI - Servicio de Urgencias Integrado'
  },
  {
    id: 'banios',
    name: 'Baños',
    type: 'special_area',
    x: 80,
    y: 25,
    width: 8,
    height: 10,
    floor: '1er piso',
    description: 'Baños'
  },
  {
    id: 'sala_espera_c',
    name: 'Sala de Espera Módulo C',
    type: 'special_area',
    x: 75,
    y: 35,
    width: 15,
    height: 12,
    floor: '1er piso',
    description: 'Sala de espera para Módulo C y C2'
  },
  {
    id: 'modulo_c',
    name: 'Módulo C',
    type: 'module',
    x: 90,
    y: 35,
    width: 10,
    height: 15,
    floor: '1er piso',
    description: 'Módulo C - 1er piso - Lado derecho'
  },

  // ÁREAS ESPECIALES (centro/intersecciones)
  {
    id: 'inchijap',
    name: 'Inchijap',
    type: 'special_area',
    x: 45,
    y: -5,
    width: 10,
    height: 10,
    floor: '1er piso',
    description: 'Inchijap - Centro del pasillo'
  },
  {
    id: 'sala_espera_principal',
    name: 'Sala de Espera Principal',
    type: 'special_area',
    x: 50,
    y: 15,
    width: 15,
    height: 12,
    floor: '1er piso',
    description: 'Sala de espera principal'
  },
  {
    id: 'neuro_infantil',
    name: 'Neuro Infantil',
    type: 'special_area',
    x: 75,
    y: -35,
    width: 12,
    height: 12,
    floor: '1er piso',
    description: 'Neuro Infantil'
  },
  {
    id: 'plaza',
    name: 'Plaza',
    type: 'special_area',
    x: 50,
    y: -45,
    width: 20,
    height: 15,
    floor: '1er piso',
    description: 'Plaza central'
  },
  {
    id: 'orientadores',
    name: 'Orientadores',
    type: 'special_area',
    x: 60,
    y: -40,
    width: 10,
    height: 8,
    floor: '1er piso',
    description: 'Punto de orientadores'
  },

  // MÓDULO D2 (2do piso)
  {
    id: 'modulo_d2',
    name: 'Módulo D2',
    type: 'module',
    x: 45,
    y: 8,
    width: 12,
    height: 15,
    floor: '2do piso',
    description: 'Módulo D2 - 2do piso'
  },

  // PUNTOS DE INTERSECCIÓN (conexiones)
  {
    id: 'intersection_left_1',
    name: 'Intersección Izquierda 1',
    type: 'intersection',
    x: 5,
    y: 0,
    floor: '1er piso',
    description: 'Conexión entre Módulo i3 y pasillo'
  },
  {
    id: 'intersection_left_2',
    name: 'Intersección Izquierda 2',
    type: 'intersection',
    x: 65,
    y: 0,
    floor: '1er piso',
    description: 'Conexión entre Módulo A y pasillo'
  },
  {
    id: 'intersection_right_1',
    name: 'Intersección Derecha 1',
    type: 'intersection',
    x: 80,
    y: 0,
    floor: '1er piso',
    description: 'Conexión entre Módulo D y pasillo'
  },
  {
    id: 'intersection_right_2',
    name: 'Intersección Derecha 2',
    type: 'intersection',
    x: 90,
    y: 0,
    floor: '1er piso',
    description: 'Conexión entre Módulo C y pasillo'
  }
];

/**
 * ARISTAS DEL GRAFO
 * Conexiones entre nodos respetando la geometría real del pasillo
 */
export const hospitalEdges: Edge[] = [
  // Pasillo principal (eje central)
  { from: 'corridor_main', to: 'intersection_left_1', distance: 5, type: 'corridor' },
  { from: 'intersection_left_1', to: 'intersection_left_2', distance: 60, type: 'corridor' },
  { from: 'intersection_left_2', to: 'intersection_right_1', distance: 15, type: 'corridor' },
  { from: 'intersection_right_1', to: 'intersection_right_2', distance: 10, type: 'corridor' },

  // Conexiones lado izquierdo (arriba del pasillo)
  { from: 'modulo_i3', to: 'intersection_left_1', distance: 25, type: 'connection' },
  { from: 'modulo_i2', to: 'intersection_left_1', distance: 20, type: 'connection' },
  { from: 'modulo_e', to: 'intersection_left_1', distance: 25, type: 'connection' },
  { from: 'modulo_b', to: 'intersection_left_1', distance: 25, type: 'connection' },
  { from: 'modulo_a', to: 'intersection_left_2', distance: 25, type: 'connection' },

  // Conexiones lado derecho (arriba del pasillo)
  { from: 'modulo_i1', to: 'intersection_right_1', distance: 25, type: 'connection' },
  { from: 'modulo_d', to: 'intersection_right_1', distance: 15, type: 'connection' },

  // Conexiones lado derecho (abajo del pasillo)
  { from: 'sui', to: 'intersection_right_1', distance: 15, type: 'connection' },
  { from: 'banios', to: 'intersection_right_1', distance: 25, type: 'connection' },
  { from: 'sala_espera_c', to: 'intersection_right_2', distance: 35, type: 'connection' },
  { from: 'modulo_c', to: 'intersection_right_2', distance: 35, type: 'connection' },

  // Conexiones áreas especiales
  { from: 'inchijap', to: 'intersection_left_2', distance: 5, type: 'connection' },
  { from: 'sala_espera_principal', to: 'intersection_left_2', distance: 15, type: 'connection' },
  { from: 'neuro_infantil', to: 'modulo_i1', distance: 15, type: 'connection' },
  { from: 'plaza', to: 'orientadores', distance: 10, type: 'connection' },
  { from: 'orientadores', to: 'intersection_left_1', distance: 40, type: 'connection' },

  // Conexión a Módulo D2 (2do piso)
  { from: 'modulo_d2', to: 'intersection_left_2', distance: 8, type: 'stairs' },

  // Conexiones internas entre módulos cercanos
  { from: 'modulo_i3', to: 'modulo_i2', distance: 15, type: 'connection' },
  { from: 'modulo_i2', to: 'modulo_e', distance: 15, type: 'connection' },
  { from: 'modulo_e', to: 'modulo_b', distance: 15, type: 'connection' },
  { from: 'modulo_b', to: 'modulo_a', distance: 15, type: 'connection' },
  { from: 'modulo_a', to: 'modulo_i1', distance: 15, type: 'connection' },
  { from: 'modulo_i1', to: 'modulo_d', distance: 15, type: 'connection' },
  { from: 'modulo_d', to: 'sui', distance: 15, type: 'connection' },
  { from: 'sui', to: 'banios', distance: 15, type: 'connection' },
  { from: 'banios', to: 'sala_espera_c', distance: 10, type: 'connection' },
  { from: 'sala_espera_c', to: 'modulo_c', distance: 10, type: 'connection' }
];

/**
 * GRAFO COMPLETO
 */
export const hospitalGraph: HospitalGraph = {
  nodes: hospitalNodes,
  edges: hospitalEdges,
  mainCorridor: {
    startX: 0,
    endX: 100,
    y: 0
  }
};

/**
 * Función para obtener nodo por ID
 */
export function getNodeById(id: string): Node | undefined {
  return hospitalNodes.find(node => node.id === id);
}

/**
 * Función para obtener aristas conectadas a un nodo
 */
export function getConnectedEdges(nodeId: string): Edge[] {
  return hospitalEdges.filter(edge => edge.from === nodeId || edge.to === nodeId);
}

/**
 * Función para obtener vecinos de un nodo
 */
export function getNeighbors(nodeId: string): Node[] {
  const edges = getConnectedEdges(nodeId);
  const neighborIds = new Set<string>();
  
  edges.forEach(edge => {
    if (edge.from === nodeId) neighborIds.add(edge.to);
    if (edge.to === nodeId) neighborIds.add(edge.from);
  });

  return Array.from(neighborIds)
    .map(id => getNodeById(id))
    .filter((node): node is Node => node !== undefined);
}

/**
 * Función para calcular distancia euclidiana entre dos nodos
 */
export function calculateDistance(node1: Node, node2: Node): number {
  const dx = node2.x - node1.x;
  const dy = node2.y - node1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
