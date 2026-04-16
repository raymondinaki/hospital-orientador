/**
 * Grafo Espacial del Hospital Clínico San Borja Arriarán
 * Basado en el plano del pasillo principal (configuración optimizada)
 * 
 * Sistema de Coordenadas:
 * - Lienzo normalizado: 100x100
 * - Pasillo principal: y=50, ancho=90 (x: 5-95), altura=6
 * - Módulos arriba: y=10 a y=44 (encima del pasillo, separados)
 * - Módulos abajo: y=56 a y=90 (debajo del pasillo, separados)
 * - Módulo C: x=88-96, y=35-85 (lado derecho)
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
    y: number; // Y = 50 (línea central)
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
    x: 50,
    y: 47,
    width: 90,
    height: 2,
    floor: '1er piso',
    description: 'Pasillo central principal del hospital'
  },

  // MÓDULOS ARRIBA DEL PASILLO (y=10 a y=44)
  {
    id: 'modulo_i1_sup',
    name: 'Módulo i1',
    type: 'module',
    x: 10,
    y: 20,
    width: 10,
    height: 26,
    floor: '1er piso',
    description: 'Módulo i1 - 1er piso - Arriba del pasillo'
  },
  {
    id: 'modulo_d_sup',
    name: 'Módulo D',
    type: 'module',
    x: 22,
    y: 20,
    width: 10,
    height: 26,
    floor: '1er piso',
    description: 'Módulo D - 1er piso - Arriba del pasillo'
  },
  {
    id: 'neuro_infantil',
    name: 'Neuro Infantil',
    type: 'special_area',
    x: 75,
    y: 15,
    width: 12,
    height: 12,
    floor: '1er piso',
    description: 'Neuro Infantil - Arriba del pasillo'
  },

  // MÓDULOS ABAJO DEL PASILLO (y=49 a y=85)
  {
    id: 'modulo_i3_inf',
    name: 'Módulo i3',
    type: 'module',
    x: 4,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Módulo i3 - 1er piso - Abajo del pasillo'
  },
  {
    id: 'modulo_i2_inf',
    name: 'Módulo i2',
    type: 'module',
    x: 14,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Módulo i2 - 1er piso - Abajo del pasillo'
  },
  {
    id: 'modulo_e_inf',
    name: 'Módulo E',
    type: 'module',
    x: 24,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Módulo E - 1er piso - Abajo del pasillo'
  },
  {
    id: 'inchijap_inf',
    name: 'Inchijap',
    type: 'special_area',
    x: 34,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Inchijap - Abajo del pasillo'
  },
  {
    id: 'modulo_b_inf',
    name: 'Módulo B',
    type: 'module',
    x: 44,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Módulo B - 1er piso - Abajo del pasillo'
  },
  {
    id: 'sala_espera_inf',
    name: 'Sala de Espera',
    type: 'special_area',
    x: 54,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Sala de Espera - Abajo del pasillo'
  },
  {
    id: 'modulo_a_inf',
    name: 'Módulo A',
    type: 'module',
    x: 64,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Módulo A - 1er piso - Abajo del pasillo'
  },
  {
    id: 'sui_inf',
    name: 'SUI',
    type: 'special_area',
    x: 74,
    y: 49,
    width: 4,
    height: 26,
    floor: '1er piso',
    description: 'SUI - Servicio de Urgencias Integrado - Abajo del pasillo'
  },
  {
    id: 'recaudacion_inf',
    name: 'Recaudación',
    type: 'special_area',
    x: 80,
    y: 50,
    width: 6,
    height: 14,
    floor: '1er piso',
    description: 'Recaudación - Abajo del pasillo'
  },
  {
    id: 'espera_c_inf',
    name: 'Espera C',
    type: 'special_area',
    x: 88,
    y: 49,
    width: 8,
    height: 26,
    floor: '1er piso',
    description: 'Espera C - Abajo del pasillo'
  },

  // MÓDULO C (lado derecho)
  {
    id: 'modulo_c_der',
    name: 'Módulo C y C2',
    type: 'module',
    x: 88,
    y: 20,
    width: 8,
    height: 55,
    floor: '1er piso',
    description: 'Módulo C y C2 - Lado derecho'
  }
];

/**
 * ARISTAS (CONEXIONES) DEL GRAFO
 */
export const hospitalEdges: Edge[] = [
  // Conexiones de módulos arriba al pasillo
  { from: 'modulo_i1_sup', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_d_sup', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'neuro_infantil', to: 'corridor_main', distance: 15, type: 'connection' },

  // Conexiones de módulos abajo al pasillo
  { from: 'modulo_i3_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_i2_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_e_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'inchijap_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_b_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'sala_espera_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_a_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'sui_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'recaudacion_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'espera_c_inf', to: 'corridor_main', distance: 10, type: 'connection' },
  { from: 'modulo_c_der', to: 'corridor_main', distance: 10, type: 'connection' },

  // Conexiones en el pasillo principal
  { from: 'corridor_main', to: 'corridor_main', distance: 90, type: 'corridor' }
];

/**
 * GRAFO COMPLETO DEL HOSPITAL
 */
export const hospitalGraph: HospitalGraph = {
  nodes: hospitalNodes,
  edges: hospitalEdges,
  mainCorridor: {
    startX: 5,
    endX: 95,
    y: 47
  }
};

/**
 * FUNCIONES AUXILIARES
 */

export function getNodeById(id: string): Node | undefined {
  return hospitalNodes.find(node => node.id === id);
}

export function getConnectedEdges(nodeId: string): Edge[] {
  return hospitalEdges.filter(edge => edge.from === nodeId || edge.to === nodeId);
}

export function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

export default hospitalGraph;
