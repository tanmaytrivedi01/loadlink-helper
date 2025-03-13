
// Trailer Types and Data

export interface Trailer {
  id: string;
  name: string;
  type: string;
  maxLength: number; // feet
  maxWidth: number; // feet
  maxHeight: number; // feet
  maxWeight: number; // pounds
  image: string;
  features: string[];
  specializedFor?: string[]; // Special use cases
}

export const trailers: Trailer[] = [
  {
    id: "flatbed-48",
    name: "Standard Flatbed",
    type: "flatbed",
    maxLength: 48,
    maxWidth: 8.5,
    maxHeight: 8.5,
    maxWeight: 48000,
    image: "/flatbed.png",
    features: ["Open deck", "Side loading", "Versatile cargo"]
  },
  {
    id: "step-deck-53",
    name: "Step Deck",
    type: "step-deck",
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 10,
    maxWeight: 48000,
    image: "/stepdeck.png",
    features: ["Lower deck height", "Tall cargo", "Two-level loading"]
  },
  {
    id: "dry-van-53",
    name: "Dry Van",
    type: "van",
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 9.5,
    maxWeight: 45000,
    image: "/dryvan.png",
    features: ["Enclosed", "Weather protection", "Security"]
  },
  {
    id: "reefer-53",
    name: "Refrigerated Trailer",
    type: "reefer",
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 9.5,
    maxWeight: 43000,
    image: "/reefer.png",
    features: ["Temperature control", "Perishable goods", "Climate monitoring"]
  },
  {
    id: "lowboy-48",
    name: "Lowboy",
    type: "lowboy",
    maxLength: 48,
    maxWidth: 8.5,
    maxHeight: 11.5,
    maxWeight: 80000,
    image: "/lowboy.png",
    features: ["Low deck height", "Heavy machinery", "High clearance"]
  },
  // New specialized trailers for overweight and over-dimensional loads
  {
    id: "double-drop-53",
    name: "Double Drop Lowboy",
    type: "lowboy",
    maxLength: 53,
    maxWidth: 8.5,
    maxHeight: 11.5,
    maxWeight: 100000,
    image: "/lowboy.png",
    features: ["Ultra-low deck height (18-24\")", "Tall equipment", "Heavy machinery"],
    specializedFor: ["Overheight loads", "Construction equipment"]
  },
  {
    id: "rgn-basic",
    name: "Removable Gooseneck (RGN)",
    type: "rgn",
    maxLength: 50,
    maxWidth: 8.5,
    maxHeight: 10,
    maxWeight: 150000,
    image: "/rgn.png",
    features: ["Detachable front", "Ground-level loading", "Flexible configuration"],
    specializedFor: ["Heavy machinery", "Construction equipment", "Oversized loads"]
  },
  {
    id: "rgn-multi-axle",
    name: "Multi-axle RGN",
    type: "rgn",
    maxLength: 65,
    maxWidth: 10,
    maxHeight: 10,
    maxWeight: 200000,
    image: "/rgn-multi.png",
    features: ["7-13+ axles", "Weight distribution", "Heavy capacity"],
    specializedFor: ["Overweight loads", "Industrial components", "Power plant equipment"]
  },
  {
    id: "extendable-flatbed",
    name: "Extendable Flatbed",
    type: "extendable",
    maxLength: 80,
    maxWidth: 8.5,
    maxHeight: 8.5,
    maxWeight: 65000,
    image: "/extendable.png",
    features: ["Extends to 80+ feet", "Telescoping trailer", "Length adjustment"],
    specializedFor: ["Overlength loads", "Wind turbine blades", "Bridge beams", "Long pipes"]
  },
  {
    id: "perimeter-trailer",
    name: "Perimeter Trailer",
    type: "perimeter",
    maxLength: 53,
    maxWidth: 10,
    maxHeight: 14,
    maxWeight: 120000,
    image: "/perimeter.png",
    features: ["Extra-low deck (10\" clearance)", "Maximum height clearance", "Well design"],
    specializedFor: ["Extra tall machinery", "Overheight loads", "Construction equipment"]
  },
  {
    id: "schnabel-trailer",
    name: "Schnabel Trailer",
    type: "schnabel",
    maxLength: 200,
    maxWidth: 16,
    maxHeight: 15,
    maxWeight: 500000,
    image: "/schnabel.png",
    features: ["Load becomes part of structure", "Hydraulic lifting", "Specialized configuration"],
    specializedFor: ["Power transformers", "Nuclear components", "Supermassive loads"]
  }
];

/**
 * Find suitable trailers for a load based on dimensions and weight
 */
export function findSuitableTrailers(
  length: number,
  width: number,
  height: number,
  weight: number
): Trailer[] {
  return trailers.filter(trailer => 
    length <= trailer.maxLength &&
    width <= trailer.maxWidth &&
    height <= trailer.maxHeight &&
    weight <= trailer.maxWeight
  ).sort((a, b) => {
    // Sort by closest fit to minimize wasted space
    const aVolumeRatio = (length / a.maxLength) * (width / a.maxWidth) * (height / a.maxHeight);
    const bVolumeRatio = (length / b.maxLength) * (width / b.maxWidth) * (height / b.maxHeight);
    return bVolumeRatio - aVolumeRatio;
  });
}

/**
 * Find trailers specifically designed for oversized or overweight loads
 */
export function findSpecializedTrailers(
  specializedFor: string[] = []
): Trailer[] {
  if (specializedFor.length === 0) {
    return trailers.filter(trailer => trailer.specializedFor !== undefined);
  }
  
  return trailers.filter(trailer => 
    trailer.specializedFor !== undefined && 
    specializedFor.some(need => 
      trailer.specializedFor?.includes(need)
    )
  );
}

/**
 * Get a mock trailer 3D model URL
 */
export function getTrailer3DModelUrl(trailerId: string): string {
  // In a real app, this would return actual 3D model URLs
  return `/models/${trailerId}.gltf`;
}
