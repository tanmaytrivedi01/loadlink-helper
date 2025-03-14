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
  
  console.log("Finding trailers for:", { lengthFt, widthFt, heightFt, weightLbs });
  
  // Define different types of oversized loads
  const isExtremeLengthLoad = lengthFt > 100;
  const isExtremeWidthLoad = widthFt > 12;
  const isExtremeHeightLoad = heightFt > 14;
  const isExtremeWeightLoad = weightLbs > 200000;
  
  const isOversized = widthFt > 8.5 || heightFt > 13.5 || lengthFt > 65 || weightLbs > 80000;
  const isVeryOversized = widthFt > 10 || heightFt > 14 || lengthFt > 85 || weightLbs > 120000 || isExtremeLengthLoad;
  
  // For extremely long loads, prioritize specialized equipment like Schnabel trailers
  if (isExtremeLengthLoad) {
    console.log("Load is extremely long, prioritizing specialized trailers for long loads");
    
    // Find trailers specifically designed for very long loads
    const specializedLengthTrailers = trailers.filter(trailer => 
      (trailer.specializedFor?.includes("Overlength loads") || 
       trailer.maxLength >= lengthFt)
    );
    
    if (specializedLengthTrailers.length > 0) {
      console.log("Found specialized trailers for extreme length:", specializedLengthTrailers.length);
      
      // Sort by closest match on length capacity
      return specializedLengthTrailers.sort((a, b) => {
        // Schnabel trailers get highest priority for extreme length
        if (a.type === 'schnabel' && b.type !== 'schnabel') return -1;
        if (b.type === 'schnabel' && a.type !== 'schnabel') return 1;
        
        // Then extendable trailers
        if (a.type === 'extendable' && b.type !== 'extendable') return -1;
        if (b.type === 'extendable' && a.type !== 'extendable') return 1;
        
        // Then sort by max length (closest match)
        if (a.maxLength >= lengthFt && b.maxLength >= lengthFt) {
          return a.maxLength - b.maxLength; // Prefer the closest fit
        }
        
        return b.maxLength - a.maxLength; // Otherwise prefer the longest
      });
    }
  }
  
  // If load is very oversized, prioritize specialized trailers
  if (isVeryOversized) {
    console.log("Load is very oversized, prioritizing specialized trailers");
    
    // Define which specialized feature we need most
    let neededSpecialization = [];
    
    if (isExtremeLengthLoad) neededSpecialization.push("Overlength loads");
    if (isExtremeWidthLoad) neededSpecialization.push("Oversized loads");
    if (isExtremeHeightLoad) neededSpecialization.push("Overheight loads");
    if (isExtremeWeightLoad) neededSpecialization.push("Overweight loads");
    
    // Filter trailers that are specifically designed for the primary oversized characteristic
    const specializedTrailers = trailers.filter(trailer => 
      trailer.specializedFor !== undefined && 
      (neededSpecialization.length === 0 || 
       neededSpecialization.some(need => trailer.specializedFor?.includes(need)))
    );
    
    console.log("Found specialized trailers:", specializedTrailers.length);
    
    if (specializedTrailers.length > 0) {
      return specializedTrailers.sort((a, b) => {
        // For extreme length, prioritize length capacity
        if (isExtremeLengthLoad) {
          if (a.maxLength >= lengthFt && b.maxLength < lengthFt) return -1;
          if (b.maxLength >= lengthFt && a.maxLength < lengthFt) return 1;
        }
        
        // For extreme width, prioritize width capacity
        if (isExtremeWidthLoad) {
          if (a.maxWidth >= widthFt && b.maxWidth < widthFt) return -1;
          if (b.maxWidth >= widthFt && a.maxWidth < widthFt) return 1;
        }
        
        // For extreme weight, prioritize weight capacity
        if (isExtremeWeightLoad) {
          const aWeightRatio = a.maxWeight / weightLbs;
          const bWeightRatio = b.maxWeight / weightLbs;
          
          // We want the ratio to be close to but greater than 1
          const aScore = aWeightRatio >= 1 ? aWeightRatio - 1 : 99;
          const bScore = bWeightRatio >= 1 ? bWeightRatio - 1 : 99;
          
          return aScore - bScore;
        }
        
        return 0;
      });
    }
  }
  
  // The standard trailer filtering logic continues as before
  // Get all trailers that can technically fit the load
  let suitableTrailers = trailers.filter(trailer => 
    lengthFt <= trailer.maxLength &&
    widthFt <= trailer.maxWidth &&
    heightFt <= trailer.maxHeight &&
    weightLbs <= trailer.maxWeight
  );
  
  console.log("Standard suitable trailers:", suitableTrailers.length);

  // If no trailers found at all, return all trailers sorted by suitability
  if (suitableTrailers.length === 0) {
    console.log("No exact matches, finding closest alternatives");
    
    // For very oversized loads, prioritize specialized equipment
    if (isVeryOversized) {
      const specializedTrailers = trailers.filter(trailer => trailer.specializedFor !== undefined);
      
      if (specializedTrailers.length > 0) {
        console.log("Returning specialized trailers for very oversized load");
        return specializedTrailers;
      }
    }
    
    // Return all trailers sorted by suitability
    return trailers
      .sort((a, b) => {
        // Calculate a suitability score based on how close each dimension is
        // For oversized loads, specialized trailers get a big boost
        const aSpecializedBonus = isOversized && a.specializedFor ? 2 : 1;
        const bSpecializedBonus = isOversized && b.specializedFor ? 2 : 1;
        
        const aScore = aSpecializedBonus * (
          (a.maxLength >= lengthFt ? 1 : a.maxLength / lengthFt) +
          (a.maxWidth >= widthFt ? 1 : a.maxWidth / widthFt) + 
          (a.maxHeight >= heightFt ? 1 : a.maxHeight / heightFt) +
          (a.maxWeight >= weightLbs ? 1 : a.maxWeight / weightLbs)
        ) / 4; // Average across all dimensions
        
        const bScore = bSpecializedBonus * (
          (b.maxLength >= lengthFt ? 1 : b.maxLength / lengthFt) +
          (b.maxWidth >= widthFt ? 1 : b.maxWidth / widthFt) + 
          (b.maxHeight >= heightFt ? 1 : b.maxHeight / heightFt) +
          (b.maxWeight >= weightLbs ? 1 : b.maxWeight / weightLbs)
        ) / 4;
        
        return bScore - aScore; // Descending order by score
      })
      .slice(0, 5); // Get top 5 closest trailers
  }
  
  // Sort the trailers based on best fit
  return suitableTrailers.sort((a, b) => {
    // First sort by specialization - specialized trailers first for heavy/oversized loads
    if (isOversized) {
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
