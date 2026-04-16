/**
 * Grafo Espacial del Hospital Clínico San Borja Arriarán
 * Basado en el plano del pasillo principal (configuración actualizada)
 * 
 * Sistema de Coordenadas:
 * - Lienzo normalizado: 100x100
 * - Pasillo principal: y=45, ancho=90 (x: 0-90)
 * - Módulos arriba: y=10 a y=43 (encima del pasillo)
 * - Módulos abajo: y=52 a y=82 (debajo del pasillo)
 * - Módulo C: x=88-96, y=35-80 (lado derecho)
 */

export interface Node {
  id: string;
  name: string;
  type: 'module' | 'intersection' | 'special_area' | 'corridor';
  x: number; // Coordenada X (0-100)
  y: number; // Coordenada Y (0-100)
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
    y: number; // Y = 45 (línea central)
  };
}

/**
 * NODOS DEL HOSPITAL
 * Basados en la nueva estructura del plano del pasillo principal
 */
export const hospitalNodes: Node[] = [
  // PASILLO PRINCIPAL (eje central)
  {
    id: 'corridor_main',
    name: 'Pasillo Principal',
    type: 'corridor',
    x: 45,
    y: 45,
    width: 90,
    height: 5,
    floor: '1er piso',
    description: 'Pasillo central principal del hospital'
  },

  // MÓDULOS ARRIBA DEL PASILLO (y=10 a y=43)
  {
    id: 'modulo_i1_sup',
    name: 'Módulo i1',
    type: 'module',
    x: 15,
    y: 26.5,
    width: 10,
    height: 33,
    floor: '1er piso',
    description: 'Módulo i1 - 1er piso - Arriba del pasillo'
  },
  {
    id: 'modulo_d_sup',
    name: 'Módulo D',
    type: 'module',
    x: 27,
    y: 26.5,
    width: 10,
    height: 33,
    floor: '1er piso',
    description: 'Módulo D - 1er piso - Arriba del pasillo'
  },
  {
    id: 'neuro_infantil',
    name: 'Neuro Infantil',
    type: 'special_area',
    x: 76,
    y: 10,
    width: 12,
    height: 10,
    floor: '1er piso',
    description: 'Neuro Infantil - Arriba del pasillo'
  },

  // MÓDULOS ABAJO DEL PASILLO (y=52 a y=82)
  {
    id: 'modulo_i3_inf',
    name: 'Módulo i3',
    type: 'module',
    x: 6,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Módulo i3 - 1er piso - Abajo del pasillo'
  },
  {
    id: 'modulo_i2_inf',
    name: 'Módulo i2',
    type: 'module',
    x: 15,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Módulo i2 - 1er piso - Abajo del pasillo'
  },
  {
    id: 'modulo_e_inf',
    name: 'Módulo E',
    type: 'module',
    x: 24,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Módulo E - 1er piso - Abajo del pasillo'
  },
  {
    id: 'inchijap_inf',
    name: 'Inchijap',
    type: 'special_area',
    x: 33,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Inchijap - Abajo del pasillo'
  },
  {
    id: 'modulo_b_inf',
    name: 'Módulo B',
    type: 'module',
    x: 42,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Módulo B - 1er piso - Abajo del pasillo'
  },
  {
    id: 'sala_espera_inf',
    name: 'Sala de Espera',
    type: 'special_area',
    x: 51,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Sala de Espera - Abajo del pasillo'
  },
  {
    id: 'modulo_a_inf',
    name: 'Módulo A',
    type: 'module',
    x: 60,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Módulo A - 1er piso - Abajo del pasillo'
  },
  {
    id: 'sui_inf',
    name: 'SUI',
    type: 'special_area',
    x: 67,
    y: 67,
    width: 4,
    height: 30,
    floor: '1er piso',
    description: 'SUI - Servicio de Urgencias Integrado - Abajo del pasillo'
  },
  {
    id: 'recaudacion_inf',
    name: 'Recaudación',
    type: 'special_area',
    x: 73,
    y: 62,
    width: 6,
    height: 20,
    floor: '1er piso',
    description: 'Recaudación - Abajo del pasillo'
  },
  {
    id: 'espera_c_inf',
    name: 'Espera C',
    type: 'special_area',
    x: 81,
    y: 67,
    width: 8,
    height: 30,
    floor: '1er piso',
    description: 'Sala de Espera Módulo C - Abajo del pasillo'
  },

  // MÓDULO C Y C2 (lado derecho)
  {
    id: 'modulo_c',
    name: 'Módulo C y C2',
    type: 'module',
    x: 92,
    y: 57.5,
    width: 8,
    height: 45,
    floor: '1er piso',
    description: 'Módulo C y C2 - 1er piso - Lado derecho'
  },

  // PUNTOS DE INTERSECCIÓN (conexiones con el pasillo)
  {
    id: 'intersection_i1',
    name: 'Intersección i1',
    type: 'intersection',
    x: 15,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo i1 - Pasillo'
  },
  {
    id: 'intersection_d',
    name: 'Intersección D',
    type: 'intersection',
    x: 27,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo D - Pasillo'
  },
  {
    id: 'intersection_neuro',
    name: 'Intersección Neuro',
    type: 'intersection',
    x: 76,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Neuro Infantil - Pasillo'
  },
  {
    id: 'intersection_i3',
    name: 'Intersección i3',
    type: 'intersection',
    x: 6,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo i3 - Pasillo'
  },
  {
    id: 'intersection_i2',
    name: 'Intersección i2',
    type: 'intersection',
    x: 15,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo i2 - Pasillo'
  },
  {
    id: 'intersection_e',
    name: 'Intersección E',
    type: 'intersection',
    x: 24,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo E - Pasillo'
  },
  {
    id: 'intersection_inchijap',
    name: 'Intersección Inchijap',
    type: 'intersection',
    x: 33,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Inchijap - Pasillo'
  },
  {
    id: 'intersection_b',
    name: 'Intersección B',
    type: 'intersection',
    x: 42,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo B - Pasillo'
  },
  {
    id: 'intersection_espera',
    name: 'Intersección Espera',
    type: 'intersection',
    x: 51,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Sala de Espera - Pasillo'
  },
  {
    id: 'intersection_a',
    name: 'Intersección A',
    type: 'intersection',
    x: 60,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo A - Pasillo'
  },
  {
    id: 'intersection_sui',
    name: 'Intersección SUI',
    type: 'intersection',
    x: 67,
    y: 45,
    floor: '1er piso',
    description: 'Conexión SUI - Pasillo'
  },
  {
    id: 'intersection_recaudacion',
    name: 'Intersección Recaudación',
    type: 'intersection',
    x: 73,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Recaudación - Pasillo'
  },
  {
    id: 'intersection_espera_c',
    name: 'Intersección Espera C',
    type: 'intersection',
    x: 81,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Espera C - Pasillo'
  },
  {
    id: 'intersection_c',
    name: 'Intersección C',
    type: 'intersection',
    x: 92,
    y: 45,
    floor: '1er piso',
    description: 'Conexión Módulo C - Pasillo'
  }
];

/**
 * ARISTAS DEL GRAFO
 * Conexiones entre nodos respetando la geometría real del pasillo
 */
export const hospitalEdges: Edge[] = [
  // Pasillo principal (eje central) - conexiones horizontales
  { from: 'corridor_main', to: 'intersection_i3', distance: 6, type: 'corridor' },
  { from: 'intersection_i3', to: 'intersection_i2', distance: 9, type: 'corridor' },
  { from: 'intersection_i2', to: 'intersection_e', distance: 9, type: 'corridor' },
  { from: 'intersection_e', to: 'intersection_inchijap', distance: 9, type: 'corridor' },
  { from: 'intersection_inchijap', to: 'intersection_b', distance: 9, type: 'corridor' },
  { from: 'intersection_b', to: 'intersection_espera', distance: 9, type: 'corridor' },
  { from: 'intersection_espera', to: 'intersection_a', distance: 9, type: 'corridor' },
  { from: 'intersection_a', to: 'intersection_sui', distance: 7, type: 'corridor' },
  { from: 'intersection_sui', to: 'intersection_recaudacion', distance: 6, type: 'corridor' },
  { from: 'intersection_recaudacion', to: 'intersection_espera_c', distance: 8, type: 'corridor' },
  { from: 'intersection_espera_c', to: 'intersection_c', distance: 11, type: 'corridor' },

  // Conexiones módulos arriba del pasillo
  { from: 'modulo_i1_sup', to: 'intersection_i1', distance: 26.5, type: 'connection' },
  { from: 'modulo_d_sup', to: 'intersection_d', distance: 26.5, type: 'connection' },
  { from: 'neuro_infantil', to: 'intersection_neuro', distance: 35, type: 'connection' },

  // Conexiones módulos abajo del pasillo
  { from: 'modulo_i3_inf', to: 'intersection_i3', distance: 22, type: 'connection' },
  { from: 'modulo_i2_inf', to: 'intersection_i2', distance: 22, type: 'connection' },
  { from: 'modulo_e_inf', to: 'intersection_e', distance: 22, type: 'connection' },
  { from: 'inchijap_inf', to: 'intersection_inchijap', distance: 22, type: 'connection' },
  { from: 'modulo_b_inf', to: 'intersection_b', distance: 22, type: 'connection' },
  { from: 'sala_espera_inf', to: 'intersection_espera', distance: 22, type: 'connection' },
  { from: 'modulo_a_inf', to: 'intersection_a', distance: 22, type: 'connection' },
  { from: 'sui_inf', to: 'intersection_sui', distance: 22, type: 'connection' },
  { from: 'recaudacion_inf', to: 'intersection_recaudacion', distance: 17, type: 'connection' },
  { from: 'espera_c_inf', to: 'intersection_espera_c', distance: 22, type: 'connection' },

  // Conexión módulo C (lado derecho)
  { from: 'modulo_c', to: 'intersection_c', distance: 12.5, type: 'connection' },

  // Conexiones internas entre módulos cercanos (abajo del pasillo)
  { from: 'modulo_i3_inf', to: 'modulo_i2_inf', distance: 9, type: 'connection' },
  { from: 'modulo_i2_inf', to: 'modulo_e_inf', distance: 9, type: 'connection' },
  { from: 'modulo_e_inf', to: 'inchijap_inf', distance: 9, type: 'connection' },
  { from: 'inchijap_inf', to: 'modulo_b_inf', distance: 9, type: 'connection' },
  { from: 'modulo_b_inf', to: 'sala_espera_inf', distance: 9, type: 'connection' },
  { from: 'sala_espera_inf', to: 'modulo_a_inf', distance: 9, type: 'connection' },
  { from: 'modulo_a_inf', to: 'sui_inf', distance: 7, type: 'connection' },
  { from: 'sui_inf', to: 'recaudacion_inf', distance: 6, type: 'connection' },
  { from: 'recaudacion_inf', to: 'espera_c_inf', distance: 8, type: 'connection' },
  { from: 'espera_c_inf', to: 'modulo_c', distance: 11, type: 'connection' },

  // Conexiones entre módulos arriba del pasillo
  { from: 'modulo_i1_sup', to: 'modulo_d_sup', distance: 12, type: 'connection' },
  { from: 'modulo_d_sup', to: 'neuro_infantil', distance: 49, type: 'connection' }
];

/**
 * GRAFO COMPLETO
 */
export const hospitalGraph: HospitalGraph = {
  nodes: hospitalNodes,
  edges: hospitalEdges,
  mainCorridor: {
    startX: 0,
    endX: 90,
    y: 45
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
