export interface Specialty {
  id: string;
  name: string;
  module: string;
  floor: string;
  description?: string;
  icon?: string;
}

export interface Module {
  id: string;
  name: string;
  color: string;
  floor: string;
  location: string;
  specialties: string[];
  nodeId?: string; // ID del nodo en el grafo espacial
  x?: number; // Coordenada X del grafo
  y?: number; // Coordenada Y del grafo
}

export const SPECIALTIES: Specialty[] = [
  // MÓDULO A - Especialidades Infantiles
  { id: "ped", name: "Pediatría", module: "A", floor: "1er piso", description: "Atención médica general para niños" },
  { id: "endo-inf", name: "Endocrinología Infantil", module: "A", floor: "1er piso" },
  { id: "uro-inf", name: "Urología Infantil", module: "A", floor: "1er piso" },
  { id: "quem-inf", name: "Quemados Infantil", module: "A", floor: "1er piso" },
  { id: "cir-inf", name: "Cirugía Infantil", module: "A", floor: "1er piso" },
  { id: "reum-inf", name: "Reumatología Infantil", module: "A", floor: "1er piso" },
  { id: "nef-inf", name: "Nefrología Infantil", module: "A", floor: "1er piso" },
  { id: "gastro-inf", name: "Gastroenterología Infantil", module: "A", floor: "1er piso" },
  { id: "cardio-inf", name: "Cardiología Infantil", module: "A", floor: "1er piso" },
  { id: "nutri-inf", name: "Nutrición Infantil", module: "A", floor: "1er piso" },
  { id: "gine-inf", name: "Ginecología Infantil", module: "A", floor: "1er piso" },
  { id: "inmuno-inf", name: "Inmunología Infantil", module: "A", floor: "1er piso" },

  // MÓDULO B - Oftalmología y Ginecología
  { id: "oftalmologia", name: "Oftalmología (box 15)", module: "B", floor: "1er piso", description: "Enfermedades de los ojos" },
  { id: "tm", name: "TM (box 19)", module: "B", floor: "1er piso" },
  { id: "gine-general", name: "Ginecología General", module: "B", floor: "1er piso" },
  { id: "gine-onco", name: "Ginecología Oncológica", module: "B", floor: "1er piso" },
  { id: "obstetrica", name: "Obstetricia", module: "B", floor: "1er piso" },

  // MÓDULO C - Traumatología y ORL
  { id: "trauma-adult", name: "Traumatología Adulto", module: "C", floor: "1er piso" },
  { id: "trauma-inf", name: "Traumatología Infantil", module: "C", floor: "1er piso" },
  { id: "ortopedia", name: "Ortopedia", module: "C", floor: "1er piso" },
  { id: "columna", name: "Cirugía de Columna", module: "C", floor: "1er piso" },
  { id: "orl", name: "Otorrinolaringología", module: "C", floor: "1er piso", description: "Enfermedades de oído, nariz y garganta" },
  { id: "maxilo", name: "Máxilo Facial", module: "C", floor: "1er piso" },

  // MÓDULO C2 - Cardiología y Pulmonar
  { id: "bronco-adult", name: "Broncopulmonar Adulto", module: "C2", floor: "1er piso" },
  { id: "espiro", name: "Espirometrías", module: "C2", floor: "1er piso" },
  { id: "cardio-adult", name: "Cardiología", module: "C2", floor: "1er piso", description: "Enfermedades del corazón" },
  { id: "cardio-cirugia", name: "Cardiocirugía", module: "C2", floor: "1er piso" },

  // MÓDULO D - Cirugía (2do piso - derecha)
  { id: "cir-abdom", name: "Cirugía Abdominal", module: "D", floor: "2do piso" },
  { id: "cir-partes", name: "Cirugía de Partes Blandas", module: "D", floor: "2do piso" },
  { id: "cir-vasc", name: "Cirugía Vascular Periférica", module: "D", floor: "2do piso" },
  { id: "cir-coloproc", name: "Cirugía Coloproctología", module: "D", floor: "2do piso" },
  { id: "endocrino", name: "Endocrinología", module: "D", floor: "2do piso" },
  { id: "neuro-adult", name: "Neurología", module: "D", floor: "2do piso" },
  { id: "neurocir", name: "Neurocirugía", module: "D", floor: "2do piso" },

  // MÓDULO D2 - Reumatología y Nefrología
  { id: "reum-adult", name: "Reumatología", module: "D2", floor: "2do piso" },
  { id: "med-interna", name: "Medicina Interna", module: "D2", floor: "2do piso" },
  { id: "nef-adult", name: "Nefrología Adulto", module: "D2", floor: "2do piso" },

  // MÓDULO E - Gastroenterología y Taco
  { id: "taco", name: "Taco", module: "E", floor: "1er piso" },
  { id: "gastro-adult", name: "Gastroenterología", module: "E", floor: "1er piso" },
  { id: "espiro-inf", name: "Espirometría Infantil", module: "E", floor: "2do piso (Box 5)" },

  // MÓDULO i1 - Hemato-Onco Infantil (1er piso - derecha) y Urología (2do piso)
  { id: "hemato-onco-inf", name: "Hemato-Oncología Infantil", module: "i1", floor: "1er piso" },
  { id: "urologia-adult", name: "Urología", module: "i1", floor: "2do piso" },
  { id: "nefro-enf", name: "Nefrología - Enfermería", module: "i1", floor: "2do piso" },
  { id: "peritoneo-dial", name: "Peritoneo Diálisis", module: "i1", floor: "2do piso" },

  // MÓDULO i2 - Cirugía Tórax (1er piso izq.) y Neuro (2do piso izq.)
  { id: "cir-torax", name: "Cirugía de Tórax", module: "i2", floor: "1er piso" },
  { id: "cir-vasc-torax", name: "Cirugía Vascular", module: "i2", floor: "1er piso" },
  { id: "osteomia", name: "Tens Osteomía", module: "i2", floor: "1er piso" },
  { id: "neuro-inf", name: "Neurología Infantil", module: "i2", floor: "2do piso" },
  { id: "neurocir-inf", name: "Neurocirugía Infantil", module: "i2", floor: "2do piso" },
  { id: "bronco-inf", name: "Broncopulmonar Infantil y Prematuro", module: "i2", floor: "2do piso" },

  // MÓDULO i3 - Oncología-Quimioterapia (1er piso izq.) y Hemato (2do piso izq.)
  { id: "onco-quimio-adult", name: "Oncología-Quimioterapia Adulto", module: "i3", floor: "1er piso" },
  { id: "onco-quimio-amb", name: "Oncología-Quimioterapia (Horas ambulatorias)", module: "i3", floor: "2do piso" },
  { id: "hemato-adult", name: "Hematología Adulto", module: "i3", floor: "2do piso" },
];

// Coordenadas calibradas para el mapa a escala del primer piso
// Basadas en el plano de MyMap.pdf
export const MODULE_COORDINATES: Record<string, { x: number; y: number }> = {
  A: { x: 100, y: 350 },
  B: { x: 200, y: 350 },
  C: { x: 350, y: 400 },
  C2: { x: 500, y: 400 },
  D: { x: 650, y: 350 },
  D2: { x: 300, y: 200 },
  E: { x: 550, y: 300 },
  i1: { x: 700, y: 300 },
  i2: { x: 150, y: 150 },
  i3: { x: 400, y: 150 },
};

/**
 * Función para obtener resumen de especialidades por módulo
 * Agrupa las especialidades por piso y categoría
 */
export function getModuleSpecialtiesSummary(moduleId: string): { floor: string; specialties: Specialty[] }[] {
  const moduleSpecialties = SPECIALTIES.filter(s => s.module === moduleId);
  
  // Agrupar por piso
  const grouped = moduleSpecialties.reduce((acc, specialty) => {
    const floor = specialty.floor;
    if (!acc[floor]) {
      acc[floor] = [];
    }
    acc[floor].push(specialty);
    return acc;
  }, {} as Record<string, Specialty[]>);

  // Convertir a array de objetos
  return Object.entries(grouped).map(([floor, specialties]) => ({
    floor,
    specialties: specialties.sort((a, b) => a.name.localeCompare(b.name))
  }));
}

/**
 * Función para obtener lista de especialidades principales de un módulo
 * Retorna hasta 5 especialidades principales para resumen rápido
 */
export function getModuleSpecialtiesPreview(moduleId: string, limit: number = 5): string {
  const specialties = SPECIALTIES.filter(s => s.module === moduleId);
  const preview = specialties.slice(0, limit).map(s => s.name).join(', ');
  const remaining = specialties.length - limit;
  return remaining > 0 ? `${preview} y ${remaining} más` : preview;
}

export const MODULES: Module[] = [
  {
    id: "A",
    name: "Módulo A",
    color: "#2E86C1",
    floor: "1er piso",
    location: "Abajo del pasillo",
    specialties: ["ped", "endo-inf", "uro-inf", "quem-inf", "cir-inf", "reum-inf", "nef-inf", "gastro-inf", "cardio-inf", "nutri-inf", "gine-inf", "inmuno-inf"],
    nodeId: "modulo_a_inf",
    x: 60,
    y: 67,
  },
  {
    id: "B",
    name: "Módulo B",
    color: "#8E44AD",
    floor: "1er piso",
    location: "Abajo del pasillo",
    specialties: ["oftalmologia", "tm", "gine-general", "gine-onco", "obstetrica"],
    nodeId: "modulo_b_inf",
    x: 42,
    y: 67,
  },
  {
    id: "C",
    name: "Módulo C y C2",
    color: "#CA6F1E",
    floor: "1er piso",
    location: "Lado derecho",
    specialties: ["trauma-adult", "trauma-inf", "ortopedia", "columna", "orl", "maxilo", "bronco-adult", "espiro", "cardio-adult", "cardio-cirugia"],
    nodeId: "modulo_c_der",
    x: 92,
    y: 57.5,
  },
  {
    id: "C2",
    name: "Módulo C2",
    color: "#C0392B",
    floor: "1er piso",
    location: "Lado derecho",
    specialties: ["bronco-adult", "espiro", "cardio-adult", "cardio-cirugia"],
    nodeId: "modulo_c_der",
    x: 92,
    y: 57.5,
  },
  {
    id: "D",
    name: "Módulo D",
    color: "#1E8449",
    floor: "1er piso",
    location: "Arriba del pasillo",
    nodeId: "modulo_d_sup",
    x: 27,
    y: 26.5,
    specialties: ["cir-abdom", "cir-partes", "cir-vasc", "cir-coloproc", "endocrino", "neuro-adult", "neurocir"],
  },
  {
    id: "D2",
    name: "Módulo D2",
    color: "#117A65",
    floor: "2do piso",
    location: "Arriba del pasillo",
    specialties: ["reum-adult", "med-interna", "nef-adult"],
    nodeId: "modulo_d_sup",
    x: 27,
    y: 26.5,
  },
  {
    id: "E",
    name: "Módulo E",
    color: "#D4AC0D",
    floor: "1er piso",
    location: "Abajo del pasillo",
    specialties: ["taco", "gastro-adult", "espiro-inf"],
    nodeId: "modulo_e_inf",
    x: 24,
    y: 67,
  },
  {
    id: "i1",
    name: "Módulo i1",
    color: "#6C3483",
    floor: "1er piso",
    location: "Arriba del pasillo",
    specialties: ["hemato-onco-inf", "urologia-adult", "nefro-enf", "peritoneo-dial"],
    nodeId: "modulo_i1_sup",
    x: 15,
    y: 23,
  },
  {
    id: "i2",
    name: "Módulo i2",
    color: "#AF7AC5",
    floor: "1er piso",
    location: "Abajo del pasillo",
    specialties: ["cir-torax", "cir-vasc", "tens-osteomia", "neuro-inf", "neurocir-inf", "bronco-inf"],
    nodeId: "modulo_i2_inf",
    x: 15,
    y: 62,
  },
  {
    id: "i3",
    name: "Módulo i3",
    color: "#884EA0",
    floor: "1er piso",
    location: "Abajo del pasillo",
    specialties: ["oncologia-adult", "oncologia-amb", "hemato-adult"],
    nodeId: "modulo_i3_inf",
    x: 6,
    y: 62,
  },
];
