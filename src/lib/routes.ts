
// Routes and Compliance

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  type: 'weight' | 'height' | 'width' | 'hours' | 'hazmat' | 'other';
}

export interface RouteSegment {
  id: string;
  from: RoutePoint;
  to: RoutePoint;
  distance: number; // miles
  estimatedTime: number; // minutes
  restrictions: ComplianceRule[];
}

export interface Route {
  id: string;
  name: string;
  segments: RouteSegment[];
  totalDistance: number;
  totalTime: number;
  complianceIssues: ComplianceRule[];
}

// Sample compliance rules database
export const complianceRules: ComplianceRule[] = [
  {
    id: "weight-limit-80k",
    name: "80,000 lbs Weight Limit",
    description: "Maximum gross vehicle weight of 80,000 lbs on interstate highways",
    type: "weight"
  },
  {
    id: "height-13-6",
    name: "13'6\" Height Limit",
    description: "Standard height limit for most US highways",
    type: "height"
  },
  {
    id: "width-8-5",
    name: "8'6\" Width Limit",
    description: "Standard width limit for most US highways",
    type: "width"
  },
  {
    id: "hos-14hr",
    name: "14-Hour Driving Window",
    description: "Drivers may not drive beyond the 14th consecutive hour after coming on duty",
    type: "hours"
  },
  {
    id: "hazmat-tunnel",
    name: "Hazmat Tunnel Restrictions",
    description: "Certain tunnels restrict hazardous materials",
    type: "hazmat"
  }
];

// Sample origin/destination pairs
export const routePoints: RoutePoint[] = [
  { id: "nyc", name: "New York, NY", lat: 40.7128, lng: -74.0060 },
  { id: "lax", name: "Los Angeles, CA", lat: 34.0522, lng: -118.2437 },
  { id: "chi", name: "Chicago, IL", lat: 41.8781, lng: -87.6298 },
  { id: "hou", name: "Houston, TX", lat: 29.7604, lng: -95.3698 },
  { id: "phl", name: "Philadelphia, PA", lat: 39.9526, lng: -75.1652 },
  { id: "phx", name: "Phoenix, AZ", lat: 33.4484, lng: -112.0740 },
  { id: "sfo", name: "San Francisco, CA", lat: 37.7749, lng: -122.4194 },
  { id: "dal", name: "Dallas, TX", lat: 32.7767, lng: -96.7970 }
];

/**
 * Get a simplified route between two points (mock function)
 */
export function findRoute(
  fromId: string,
  toId: string,
  trailerType: string,
  weight: number,
  height: number,
  width: number
): Route {
  // Find the points
  const from = routePoints.find(point => point.id === fromId);
  const to = routePoints.find(point => point.id === toId);
  
  if (!from || !to) {
    throw new Error("Invalid route points");
  }
  
  // In a real app, this would call a routing API
  // For now, we'll return mock data
  
  // Calculate a mock distance (simplified for demo)
  const distance = Math.sqrt(
    Math.pow(from.lat - to.lat, 2) + Math.pow(from.lng - to.lng, 2)
  ) * 69; // Rough miles conversion
  
  const time = distance * 1.5; // Rough time estimate (minutes)
  
  // Determine mock compliance issues based on inputs
  const issues: ComplianceRule[] = [];
  
  if (weight > 80000) {
    issues.push(complianceRules[0]);
  }
  
  if (height > 13.5) {
    issues.push(complianceRules[1]);
  }
  
  if (width > 8.5) {
    issues.push(complianceRules[2]);
  }
  
  // For demo purposes, always add hours of service for routes > 500 miles
  if (distance > 500) {
    issues.push(complianceRules[3]);
  }
  
  // Create a mock segment
  const segment: RouteSegment = {
    id: `${from.id}-${to.id}`,
    from,
    to,
    distance,
    estimatedTime: time,
    restrictions: issues.slice()
  };
  
  return {
    id: `route-${from.id}-${to.id}`,
    name: `${from.name} to ${to.name}`,
    segments: [segment],
    totalDistance: distance,
    totalTime: time,
    complianceIssues: issues
  };
}

/**
 * Check if a route has any compliance issues
 */
export function hasComplianceIssues(route: Route): boolean {
  return route.complianceIssues.length > 0;
}

/**
 * Format distance for display
 */
export function formatDistance(miles: number): string {
  return `${Math.round(miles)} miles`;
}

/**
 * Format time for display
 */
export function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  
  if (hours === 0) {
    return `${mins} minutes`;
  } else if (mins === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  } else {
    return `${hours} hour${hours !== 1 ? 's' : ''} ${mins} minute${mins !== 1 ? 's' : ''}`;
  }
}
