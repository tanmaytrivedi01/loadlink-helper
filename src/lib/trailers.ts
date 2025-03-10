
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
 * Get a mock trailer 3D model URL
 */
export function getTrailer3DModelUrl(trailerId: string): string {
  // In a real app, this would return actual 3D model URLs
  return `/models/${trailerId}.gltf`;
}
