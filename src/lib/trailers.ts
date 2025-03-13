
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
 * Converts feet and inches string format to decimal feet
 * Example: "43'2"" -> 43.1667
 */
export function convertDimensionToFeet(dimension: string | number): number {
  // Handle plain numbers or already converted values
  if (typeof dimension === 'number') {
    return dimension;
  }
  
  // Parse feet and inches format
  const regex = /(\d+)'(\d+)"/;
  const match = dimension.match(regex);
  
  if (match) {
    const feet = parseInt(match[1]);
    const inches = parseInt(match[2]);
    return feet + (inches / 12);
  }
  
  // If no match, try to convert directly
  return parseFloat(dimension);
}

/**
 * Find suitable trailers for a load based on dimensions and weight
 */
export function findSuitableTrailers(
  length: number | string,
  width: number | string,
  height: number | string,
  weight: number | string
): Trailer[] {
  // Convert dimensions to decimal feet if they're in string format (e.g. "43'2"")
  const lengthFt = convertDimensionToFeet(length);
  const widthFt = convertDimensionToFeet(width);
  const heightFt = convertDimensionToFeet(height);
  const weightLbs = typeof weight === 'string' ? parseFloat(weight.toString().replace(/,/g, '')) : weight;
  
  // Filter suitable trailers based on dimensions and weight capacity
  let suitableTrailers = trailers.filter(trailer => 
    lengthFt <= trailer.maxLength &&
    widthFt <= trailer.maxWidth &&
    heightFt <= trailer.maxHeight &&
    weightLbs <= trailer.maxWeight
  );
  
  // Exclude oversized/specialized trailers for normal loads
  // This prevents recommending 200' trailers for standard cargo
  if (lengthFt < 60 && widthFt <= 8.5 && heightFt <= 10 && weightLbs < 80000) {
    suitableTrailers = suitableTrailers.filter(trailer => 
      trailer.maxLength <= 65 && 
      trailer.type !== "schnabel" &&
      trailer.type !== "rgn-multi-axle"
    );
  }
  
  // Further restrict very specialized trailers
  if (lengthFt < 100 && weightLbs < 200000) {
    suitableTrailers = suitableTrailers.filter(trailer => 
      trailer.type !== "schnabel"
    );
  }
  
  return suitableTrailers.sort((a, b) => {
    // First sort by specialization - specialized trailers first for heavy/oversized loads
    if (weightLbs > 80000 || widthFt > 8.5 || heightFt > 9) {
      const aIsSpecialized = a.specializedFor !== undefined;
      const bIsSpecialized = b.specializedFor !== undefined;
      
      if (aIsSpecialized && !bIsSpecialized) return -1;
      if (!aIsSpecialized && bIsSpecialized) return 1;
    }
    
    // Then sort by best fit (closest match to actual dimensions)
    // Calculate how much extra space there is
    const aExtraLength = a.maxLength - lengthFt;
    const bExtraLength = b.maxLength - lengthFt;
    
    // Prefer trailers that are closer in size to the actual load
    // But still big enough (with some margin)
    if (aExtraLength > 0 && aExtraLength < bExtraLength) return -1;
    if (bExtraLength > 0 && bExtraLength < aExtraLength) return 1;
    
    // If similar in length, compare weight capacity
    const aExtraWeight = a.maxWeight - weightLbs;
    const bExtraWeight = b.maxWeight - weightLbs;
    
    if (aExtraWeight > 0 && aExtraWeight < bExtraWeight) return -1;
    if (bExtraWeight > 0 && bExtraWeight < aExtraWeight) return 1;
    
    return 0;
  });
}

/**
 * Calculate permit and escort costs for oversize loads
 */
export interface PermitCosts {
  permitFee: number;
  pilotCars: number;
  pilotCarCost: number;
  policeEscort: boolean;
  policeEscortCost: number;
  total: number;
}

export function calculatePermitCosts(
  length: number | string,
  width: number | string,
  height: number | string,
  weight: number | string,
  currency: 'USD' | 'CAD' = 'USD'
): PermitCosts {
  // Convert dimensions to decimal feet
  const lengthFt = convertDimensionToFeet(length);
  const widthFt = convertDimensionToFeet(width);
  const heightFt = convertDimensionToFeet(height);
  const weightLbs = typeof weight === 'string' ? parseFloat(weight.toString().replace(/,/g, '')) : weight;
  
  // Base costs in USD
  let permitFee = 50; // Base permit fee
  let pilotCars = 0;
  const pilotCarRate = 55; // Per hour
  const avgTripHours = 10; // Average trip duration
  let policeEscort = false;
  const policeEscortRate = 95; // Per hour
  
  // Determine if load is oversized and calculate appropriate fees
  if (widthFt > 8.5 || heightFt > 13.5 || lengthFt > 65 || weightLbs > 80000) {
    permitFee = 150; // Increased permit fee for oversized loads
    
    // Pilot car requirements
    if (widthFt > 12 || heightFt > 14 || lengthFt > 85 || weightLbs > 120000) {
      pilotCars = 2; // Front and rear pilot cars
      policeEscort = true;
    } else if (widthFt > 10 || heightFt > 14 || lengthFt > 75 || weightLbs > 100000) {
      pilotCars = 1; // Single pilot car
    }
  }
  
  // Calculate total costs
  const pilotCarCost = pilotCars * pilotCarRate * avgTripHours;
  const policeEscortCost = policeEscort ? policeEscortRate * avgTripHours : 0;
  let total = permitFee + pilotCarCost + policeEscortCost;
  
  // Apply currency conversion if CAD
  if (currency === 'CAD') {
    const usdToCADRate = 1.37; // Example exchange rate
    permitFee *= usdToCADRate;
    const pilotCarCostCAD = pilotCarCost * usdToCADRate;
    const policeEscortCostCAD = policeEscortCost * usdToCADRate;
    total = permitFee + pilotCarCostCAD + policeEscortCostCAD;
    
    return {
      permitFee: Math.round(permitFee),
      pilotCars,
      pilotCarCost: Math.round(pilotCarCostCAD),
      policeEscort,
      policeEscortCost: Math.round(policeEscortCostCAD),
      total: Math.round(total)
    };
  }
  
  return {
    permitFee: Math.round(permitFee),
    pilotCars,
    pilotCarCost: Math.round(pilotCarCost),
    policeEscort,
    policeEscortCost: Math.round(policeEscortCost),
    total: Math.round(total)
  };
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
