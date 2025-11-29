/**
 * Visualizer Types
 * Core data models for the furniture fabric visualizer system.
 * Designed to be reusable across 2D alpha-masked and 3D/AR pipelines.
 */

// ============================================
// FURNITURE ITEMS & DETECTION
// ============================================

export enum FurnitureType {
  SOFA_2_SEATER = 'sofa-2-seater',
  SOFA_3_SEATER = 'sofa-3-seater',
  SOFA_4_SEATER = 'sofa-4-seater',
  ARMCHAIR = 'armchair',
  DINING_CHAIR = 'dining-chair',
  OTTOMAN = 'ottoman',
  CUSHION = 'cushion',
  BENCH = 'bench',
  HEADBOARD = 'headboard',
  CURTAINS = 'curtains', // Future phase
}

export interface DetectedFurnitureItem {
  id: string; // Unique identifier for this detected item in the image
  type: FurnitureType;
  label: string; // User-friendly name, e.g. "Sofa 1", "Armchair"
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number; // 0-1, segmentation confidence
  maskUrl: string; // URL to the alpha mask (PNG or WebP)
  color?: string; // Dominant color in hex, for UI highlighting
  editable: boolean; // Whether mask can be manually edited
}

// ============================================
// MASKS & ALPHA TEXTURES
// ============================================

export interface AlphaMaskMetadata {
  uploadId: string;
  itemId: string;
  width: number;
  height: number;
  format: 'png' | 'webp'; // PNG for lossless, WebP for efficiency
  url: string; // Signed URL or local path to download
  createdAt: string;
  featherRadius?: number; // Edge feathering in pixels (optional)
}

export interface MaskEditPayload {
  itemId: string;
  uploadId: string;
  brushStrokes: BrushStroke[]; // Array of add/erase strokes
}

export interface BrushStroke {
  type: 'add' | 'erase'; // Add fabric area or erase
  x: number;
  y: number;
  radius: number;
  opacity?: number; // 0-1 for soft brushing
}

// ============================================
// FABRIC LIBRARY & TEXTURES
// ============================================

export enum FabricPattern {
  PLAIN = 'plain',
  STRIPE = 'stripe',
  FLORAL = 'floral',
  GEOMETRIC = 'geometric',
  TEXTURED = 'textured',
  PRINT = 'print',
}

export enum ColorFamily {
  NEUTRAL = 'neutral',
  WARM = 'warm',
  COOL = 'cool',
  JEWEL_TONE = 'jewel-tone',
  EARTH = 'earth',
  GRAY = 'gray',
  BLACK = 'black',
  WHITE = 'white',
}

export interface FabricTexture {
  id: string;
  seamlessTextureUrl: string; // Tileable texture map
  normalMapUrl?: string; // For PBR normal detail
  roughnessMapUrl?: string; // For PBR roughness (0=glossy, 1=matte)
  textureScale?: number; // Tiling frequency (1.0 = default, 2.0 = 2x smaller tiles)
  format: 'jpg' | 'png' | 'webp';
}

export interface FabricMetadata {
  id: string;
  name: string;
  code?: string; // SKU or fabric code
  collection?: string; // Collection name (e.g., "Luxury Linen", "Contemporary Weaves")
  colorFamily: ColorFamily;
  pattern: FabricPattern;
  composition?: string; // e.g., "100% Linen", "80% Wool, 20% Silk"
  gsm?: number; // Grams per square meter (weight)
  width?: number; // Fabric width in cm (typically 140 or 54")
  pricePerMeter?: number; // Base price in ₹/m
  thumbnailUrl: string; // Small preview image
  texture: FabricTexture;
  tags?: string[]; // Additional search tags
  createdAt?: string;
}

export interface FabricCatalog {
  fabrics: FabricMetadata[];
  total: number;
  filters?: {
    colorFamilies: ColorFamily[];
    patterns: FabricPattern[];
  };
}

// ============================================
// UPLOAD & DETECTION PIPELINE
// ============================================

export interface ImageUploadRequest {
  image: File | Blob;
}

export interface ImageUploadResponse {
  uploadId: string;
  imageUrl: string; // Signed URL or storage path
  width: number;
  height: number;
  createdAt: string;
}

export interface FurnitureDetectionRequest {
  uploadId: string;
  modelVersion?: string; // Versioning for different segmentation models
}

export interface FurnitureDetectionResponse {
  uploadId: string;
  items: DetectedFurnitureItem[];
  detectedAt: string;
  modelUsed?: string; // e.g., "yolov8-seg-v1" or "sam-v1"
  processingTimeMs?: number;
}

// ============================================
// FABRIC APPLICATION & COMPOSITING
// ============================================

export interface ApplyFabricRequest {
  uploadId: string;
  itemId: string;
  fabricId: string;
  tileScale?: number; // Override fabric texture scale
  rotation?: number; // Rotation in degrees (0-360) for directional patterns
}

export interface ApplyFabricResponse {
  uploadId: string;
  itemId: string;
  fabricId: string;
  previewUrl?: string; // URL to server-rendered composite (fallback)
  renderParams?: WebGLRenderParams; // Parameters for client-side rendering
}

export interface WebGLRenderParams {
  originalImageUrl: string;
  maskUrl: string;
  fabricTextureUrl: string;
  normalMapUrl?: string;
  roughnessMapUrl?: string;
  tileScale: number;
  rotation: number;
  blendMode: 'overlay' | 'multiply' | 'screen'; // Blending strategy
}

// ============================================
// VISUALIZER PROJECT (PERSISTENCE)
// ============================================

export interface FurnitureItemApplication {
  itemId: string;
  fabricId: string;
  tileScale: number;
  rotation: number;
  maskEdits?: BrushStroke[]; // User-applied mask refinements
}

export interface VisualizerProjectData {
  id: string;
  uploadId: string;
  userId?: string;
  originalImageUrl: string;
  detectedItems: DetectedFurnitureItem[];
  applications: FurnitureItemApplication[]; // Fabric applied to each item
  projectName?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectExportOptions {
  format: 'jpg' | 'png';
  quality?: number; // 0-100 for JPEG
  resolution?: 'hd' | '4k'; // Image resolution multiplier
}

export interface ProjectShareableLink {
  projectId: string;
  token: string; // Secure share token
  expiresAt?: string;
  readOnly: boolean;
}

// ============================================
// PBR & RENDERING PARAMETERS
// ============================================

export interface PBRMaterial {
  baseColor: [number, number, number]; // RGB 0-1
  roughness: number; // 0 (glossy) to 1 (matte)
  metallic: number; // 0 (non-metal) to 1 (metal)
  normalScale: number; // Intensity of normal map detail
}

export interface RenderingContext {
  canvas: HTMLCanvasElement;
  glContext?: WebGLRenderingContext | WebGL2RenderingContext;
  scene?: any; // Three.js Scene
  camera?: any; // Three.js Camera
  renderer?: any; // Three.js WebGLRenderer
}

// ============================================
// ERROR HANDLING
// ============================================

export interface VisualizerError {
  code: string; // e.g., 'UPLOAD_FAILED', 'DETECTION_FAILED', 'RENDER_FAILED'
  message: string;
  details?: any;
  timestamp: string;
}

// ============================================
// FILTER & SEARCH
// ============================================

export interface FabricFilterOptions {
  colorFamilies?: ColorFamily[];
  patterns?: FabricPattern[];
  search?: string; // Text search in name, code, tags
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'name' | 'price' | 'newest';
  sortOrder?: 'asc' | 'desc';
}
