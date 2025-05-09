
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Truck, Clock, Scale, Info, Map } from 'lucide-react';
import { RoutePoint, Route, findRoute, routePoints, formatDistance, formatTime } from '@/lib/routes';
import { Trailer } from '@/lib/trailers';
import { toast } from 'sonner';

interface RouteMapProps {
  trailer: Trailer;
  loadDimensions: { length: number; width: number; height: number };
  weight: number;
  onRouteSelect: (route: Route) => void;
}

const RouteMap: React.FC<RouteMapProps> = ({ 
  trailer, 
  loadDimensions, 
  weight,
  onRouteSelect
}) => {
  const [origin, setOrigin] = useState<string>("nyc");
  const [destination, setDestination] = useState<string>("chi");
  const [route, setRoute] = useState<Route | null>(null);
  const [mapUrl, setMapUrl] = useState<string>("");

  const handleFindRoute = () => {
    try {
      const calculatedRoute = findRoute(
        origin,
        destination,
        trailer.type,
        weight,
        loadDimensions.height,
        loadDimensions.width
      );
      
      setRoute(calculatedRoute);
      onRouteSelect(calculatedRoute);

      // Create Google Maps URL for the route
      const originPoint = routePoints.find(p => p.id === origin);
      const destPoint = routePoints.find(p => p.id === destination);
      if (originPoint && destPoint) {
        const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${originPoint.lat},${originPoint.lng}&destination=${destPoint.lat},${destPoint.lng}&mode=driving`;
        setMapUrl(mapUrl);
      }
      
      toast.success('Route calculated successfully');
    } catch (error) {
      toast.error('Failed to calculate route');
      console.error(error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 glassmorphism">
        <h3 className="text-xl font-medium mb-4">Route Planning</h3>
        <p className="text-muted-foreground mb-6">
          Select your origin and destination to find the optimal route.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Origin</label>
            <select
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
            >
              {routePoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Destination</label>
            <select
              className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            >
              {routePoints.map((point) => (
                <option key={point.id} value={point.id}>
                  {point.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <Button
          className="w-full mb-8 bg-primary hover:bg-primary/90"
          onClick={handleFindRoute}
          disabled={origin === destination}
        >
          Calculate Best Route
        </Button>
        
        {route && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between items-center p-4 border-t border-muted">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Origin</p>
                  <p className="text-sm text-muted-foreground">{route.segments[0].from.name}</p>
                </div>
              </div>
              <div className="flex-grow border-t border-dashed border-muted mx-4"></div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Destination</p>
                  <p className="text-sm text-muted-foreground">{route.segments[0].to.name}</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 border border-muted rounded-md bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Distance</p>
                </div>
                <p className="text-2xl font-medium">{formatDistance(route.totalDistance)}</p>
              </div>
              
              <div className="p-4 border border-muted rounded-md bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Estimated Time</p>
                </div>
                <p className="text-2xl font-medium">{formatTime(route.totalTime)}</p>
              </div>
              
              <div className="p-4 border border-muted rounded-md bg-muted/10">
                <div className="flex items-center gap-2 mb-2">
                  <Scale className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Trailer Type</p>
                </div>
                <p className="text-2xl font-medium">{trailer.name}</p>
              </div>
            </div>
            
            {route.complianceIssues.length > 0 && (
              <div className="mt-6 p-4 border border-amber-200 bg-amber-50/50 rounded-md">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-700">Compliance Considerations</p>
                    <ul className="mt-2 space-y-2">
                      {route.complianceIssues.map((issue) => (
                        <li key={issue.id} className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-amber-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-amber-700">{issue.name}</p>
                            <p className="text-xs text-amber-600">{issue.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8">
              <p className="text-sm text-muted-foreground mb-2">Route Preview</p>
              
              {mapUrl ? (
                <iframe
                  title="Route Map"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={mapUrl}
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
              ) : (
                <div className="h-48 w-full bg-muted/30 rounded-md flex items-center justify-center">
                  <div className="flex flex-col items-center text-muted-foreground">
                    <Map className="h-8 w-8 mb-2" />
                    <p>Google Maps preview would be displayed here</p>
                    <p className="text-xs">(Requires API key setup)</p>
                  </div>
                </div>
              )}
              
              <p className="text-xs text-muted-foreground mt-2">
                Total Distance: {formatDistance(route.totalDistance)} • Total Estimated Time: {formatTime(route.totalTime)}
              </p>
            </div>
            
            <Button
              className="w-full mt-6 bg-primary hover:bg-primary/90"
              onClick={() => {
                onRouteSelect(route);
                toast.success('Route confirmed');
              }}
            >
              Confirm Route
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default RouteMap;
