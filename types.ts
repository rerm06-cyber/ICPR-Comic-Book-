
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export const MAX_STORY_PAGES = 10;
export const BACK_COVER_PAGE = 11;
export const TOTAL_PAGES = 11; // 0: Cover, 1-10: Story, 11: Back Cover
export const INITIAL_PAGES = 3; 
export const GATE_PAGE = 2; // Permitir lectura cuando las primeras páginas estén listas
export const BATCH_SIZE = 4;
export const DECISION_PAGES = [3, 7]; // Momentos de bifurcación narrativa

export const GENRES = [
    "Éxito Profesional (80 Años)",
    "Investigación Criminal & Forense",
    "Artes Culinarias & Repostería",
    "Ciencias de la Salud & Enfermería",
    "Tecnología & Redes Informáticas",
    "Administración & Emprendimiento",
    "Aventura Educativa en PR"
];

export const TONES = [
    "INSPIRACIONAL",
    "ACCIÓN",
    "COMEDIA",
    "DRAMÁTICO",
    "EDUCATIVO"
];

export const LANGUAGES = [
    { code: 'es-PR', name: 'Español (Puerto Rico)' },
    { code: 'en-US', name: 'English (US)' }
];

export interface ComicFace {
  id: string;
  type: 'cover' | 'story' | 'back_cover';
  imageUrl?: string;
  originalImageUrl?: string; // To allow reverting edits
  narrative?: Beat;
  choices: string[];
  resolvedChoice?: string;
  isLoading: boolean;
  pageIndex?: number;
  isDecisionPage?: boolean;
  consistencyFlags?: string[];
}

export interface Beat {
  caption?: string;
  dialogue?: string;
  scene: string;
  choices: string[];
  focus_char: 'hero' | 'friend' | 'other';
}

export interface Persona {
  id: string;
  base64: string;
  desc: string;
  visualAnchor?: string; // The first high-quality generated image of this character for consistency
}
