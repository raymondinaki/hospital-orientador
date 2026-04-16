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
}

export const SPECIALTIES: Specialty[] = [
  // MÓDULO A - Especialidades Infantiles
  { id: "ped", name: "Pediatría", module: "A", floor: "Planta Baja", description: "Atención médica general para niños" },
  { id: "endo-inf", name: "Endocrinología Infantil", module: "A", floor: "Planta Baja" },
  { id: "uro-inf", name: "Urología Infantil", module: "A", floor: "Planta Baja" },
  { id: "quem-inf", name: "Quemados Infantil", module: "A", floor: "Planta Baja" },
  { id: "cir-inf", name: "Cirugía Infantil", module: "A", floor: "Planta Baja" },
  { id: "reum-inf", name: "Reumatología Infantil", module: "A", floor: "Planta Baja" },
  { id: "nef-inf", name: "Nefrología Infantil", module: "A", floor: "Planta Baja" },
  { id: "gastro-inf", name: "Gastroenterología Infantil", module: "A", floor: "Planta Baja" },
  { id: "cardio-inf", name: "Cardiología Infantil", module: "A", floor: "Planta Baja" },
  { id: "nutri-inf", name: "Nutrición Infantil", module: "A", floor: "Planta Baja" },
  { id: "gine-inf", name: "Ginecología Infantil", module: "A", floor: "Planta Baja" },
  { id: "inmuno-inf", name: "Inmunología Infantil", module: "A", floor: "Planta Baja" },

  // MÓDULO B - Oftalmología y Ginecología
  { id: "oftalmologia", name: "Oftalmología (box 15)", module: "B", floor: "Planta Baja", description: "Enfermedades de los ojos" },
  { id: "tm", name: "TM (box 19)", module: "B", floor: "Planta Baja" },
  { id: "gine-general", name: "Ginecología General", module: "B", floor: "Planta Baja" },
  { id: "gine-onco", name: "Ginecología Oncológica", module: "B", floor: "Planta Baja" },
  { id: "obstetrica", name: "Obstetricia", module: "B", floor: "Planta Baja" },

  // MÓDULO C - Traumatología y ORL
  { id: "trauma-adult", name: "Traumatología Adulto", module: "C", floor: "Planta Baja" },
  { id: "trauma-inf", name: "Traumatología Infantil", module: "C", floor: "Planta Baja" },
  { id: "ortopedia", name: "Ortopedia", module: "C", floor: "Planta Baja" },
  { id: "columna", name: "Cirugía de Columna", module: "C", floor: "Planta Baja" },
  { id: "orl", name: "Otorrinolaringología", module: "C", floor: "Planta Baja", description: "Enfermedades de oído, nariz y garganta" },
  { id: "maxilo", name: "Máxilo Facial", module: "C", floor: "Planta Baja" },

  // MÓDULO C2 - Cardiología y Pulmonar
  { id: "bronco-adult", name: "Broncopulmonar Adulto", module: "C2", floor: "Planta Baja" },
  { id: "espiro", name: "Espirometrías", module: "C2", floor: "Planta Baja" },
  { id: "cardio-adult", name: "Cardiología", module: "C2", floor: "Planta Baja", description: "Enfermedades del corazón" },
  { id: "cardio-cirugia", name: "Cardiocirugía", module: "C2", floor: "Planta Baja" },

  // MÓDULO D - Cirugía (2do piso - derecha)
  { id: "cir-abdom", name: "Cirugía Abdominal", module: "D", floor: "2do Piso" },
  { id: "cir-partes", name: "Cirugía de Partes Blandas", module: "D", floor: "2do Piso" },
  { id: "cir-vasc", name: "Cirugía Vascular Periférica", module: "D", floor: "2do Piso" },
  { id: "cir-coloproc", name: "Cirugía Coloproctología", module: "D", floor: "2do Piso" },
  { id: "endocrino", name: "Endocrinología", module: "D", floor: "2do Piso" },
  { id: "neuro-adult", name: "Neurología", module: "D", floor: "2do Piso" },
  { id: "neurocir", name: "Neurocirugía", module: "D", floor: "2do Piso" },

  // MÓDULO D2 - Reumatología y Nefrología
  { id: "reum-adult", name: "Reumatología", module: "D2", floor: "2do Piso" },
  { id: "med-interna", name: "Medicina Interna", module: "D2", floor: "2do Piso" },
  { id: "nef-adult", name: "Nefrología Adulto", module: "D2", floor: "2do Piso" },

  // MÓDULO E - Gastroenterología y Taco
  { id: "taco", name: "Taco", module: "E", floor: "Planta Baja" },
  { id: "gastro-adult", name: "Gastroenterología", module: "E", floor: "Planta Baja" },
  { id: "espiro-inf", name: "Espirometría Infantil", module: "E", floor: "2do Piso (Box 5)" },

  // MÓDULO i1 - Hemato-Onco Infantil (1er piso - derecha) y Urología (2do piso)
  { id: "hemato-onco-inf", name: "Hemato-Oncología Infantil", module: "i1", floor: "1er Piso" },
  { id: "urologia-adult", name: "Urología", module: "i1", floor: "2do Piso" },
  { id: "nefro-enf", name: "Nefrología - Enfermería", module: "i1", floor: "2do Piso" },
  { id: "peritoneo-dial", name: "Peritoneo Diálisis", module: "i1", floor: "2do Piso" },

  // MÓDULO i2 - Cirugía Tórax (1er piso izq.) y Neuro (2do piso izq.)
  { id: "cir-torax", name: "Cirugía de Tórax", module: "i2", floor: "1er Piso" },
  { id: "cir-vasc-torax", name: "Cirugía Vascular", module: "i2", floor: "1er Piso" },
  { id: "osteomia", name: "Tens Osteomía", module: "i2", floor: "1er Piso" },
  { id: "neuro-inf", name: "Neurología Infantil", module: "i2", floor: "2do Piso" },
  { id: "neurocir-inf", name: "Neurocirugía Infantil", module: "i2", floor: "2do Piso" },
  { id: "bronco-inf", name: "Broncopulmonar Infantil y Prematuro", module: "i2", floor: "2do Piso" },

  // MÓDULO i3 - Oncología-Quimioterapia (1er piso izq.) y Hemato (2do piso izq.)
  { id: "onco-quimio-adult", name: "Oncología-Quimioterapia Adulto", module: "i3", floor: "1er Piso" },
  { id: "onco-quimio-amb", name: "Oncología-Quimioterapia (Horas ambulatorias)", module: "i3", floor: "2do Piso" },
  { id: "hemato-adult", name: "Hematología Adulto", module: "i3", floor: "2do Piso" },
];

export const MODULES: Module[] = [
  {
    id: "A",
    name: "Módulo A",
    color: "#2E86C1",
    floor: "Planta Baja",
    location: "Lado izquierdo",
    specialties: ["ped", "endo-inf", "uro-inf", "quem-inf", "cir-inf", "reum-inf", "nef-inf", "gastro-inf", "cardio-inf", "nutri-inf", "gine-inf", "inmuno-inf"],
  },
  {
    id: "B",
    name: "Módulo B",
    color: "#8E44AD",
    floor: "Planta Baja",
    location: "Centro-izquierdo",
    specialties: ["oftalmologia", "tm", "gine-general", "gine-onco", "obstetrica"],
  },
  {
    id: "C",
    name: "Módulo C",
    color: "#CA6F1E",
    floor: "Planta Baja",
    location: "Centro",
    specialties: ["trauma-adult", "trauma-inf", "ortopedia", "columna", "orl", "maxilo"],
  },
  {
    id: "C2",
    name: "Módulo C2",
    color: "#C0392B",
    floor: "Planta Baja",
    location: "Centro-derecho",
    specialties: ["bronco-adult", "espiro", "cardio-adult", "cardio-cirugia"],
  },
  {
    id: "D",
    name: "Módulo D",
    color: "#1E8449",
    floor: "2do Piso",
    location: "Lado derecho",
    specialties: ["cir-abdom", "cir-partes", "cir-vasc", "cir-coloproc", "endocrino", "neuro-adult", "neurocir"],
  },
  {
    id: "D2",
    name: "Módulo D2",
    color: "#117A65",
    floor: "2do Piso",
    location: "Bajo centro",
    specialties: ["reum-adult", "med-interna", "nef-adult"],
  },
  {
    id: "E",
    name: "Módulo E",
    color: "#D4AC0D",
    floor: "Planta Baja",
    location: "Centro-derecho",
    specialties: ["taco", "gastro-adult", "espiro-inf"],
  },
  {
    id: "i1",
    name: "Módulo i1",
    color: "#6C3483",
    floor: "1er y 2do Piso",
    location: "Lado derecho",
    specialties: ["hemato-onco-inf", "urologia-adult", "nefro-enf", "peritoneo-dial"],
  },
  {
    id: "i2",
    name: "Módulo i2",
    color: "#1A5276",
    floor: "1er y 2do Piso",
    location: "Lado izquierdo",
    specialties: ["cir-torax", "cir-vasc-torax", "osteomia", "neuro-inf", "neurocir-inf", "bronco-inf"],
  },
  {
    id: "i3",
    name: "Módulo i3",
    color: "#922B21",
    floor: "1er y 2do Piso",
    location: "Lado izquierdo",
    specialties: ["onco-quimio-adult", "onco-quimio-amb", "hemato-adult"],
  },
];
