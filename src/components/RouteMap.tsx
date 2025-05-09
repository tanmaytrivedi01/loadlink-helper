
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AlertCircle, MapPin, Truck, Clock, Scale, Info, Map } from 'lucide-react';
import { RoutePoint, Route, findRoute, routePoints, formatDistance, formatTime } from '@/lib/routes';
import { Trailer } from '@/lib/trailers';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

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
  const [alternatives, setAlternatives] = useState<Route[]>([]);

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
      
      // Generate 2 alternative routes with slightly varied distances and times
      const altRoutes: Route[] = [
        {
          ...calculatedRoute,
          totalDistance: calculatedRoute.totalDistance * 0.92,
          totalTime: calculatedRoute.totalTime * 1.1,
          complianceIssues: [...calculatedRoute.complianceIssues].slice(0, 1)
        },
        {
          ...calculatedRoute,
          totalDistance: calculatedRoute.totalDistance * 1.15,
          totalTime: calculatedRoute.totalTime * 0.95,
          complianceIssues: [...calculatedRoute.complianceIssues].slice(1, 2)
        }
      ];
      
      setAlternatives(altRoutes);

      // Create Google Maps URL for the route
      const originPoint = routePoints.find(p => p.id === origin);
      const destPoint = routePoints.find(p => p.id === destination);
      if (originPoint && destPoint) {
        const mapUrl = `https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${originPoint.lat},${originPoint.lng}&destination=${destPoint.lat},${destPoint.lng}&mode=driving`;
        setMapUrl(mapUrl);
      }
      
      toast.success('Routes calculated successfully');
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
      <Card className="overflow-hidden border-slate-200 shadow-md">
        <div className="p-6 bg-white">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Select Route</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Origin</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              <label className="block text-sm font-medium text-slate-700 mb-2">Destination</label>
              <select
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
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
            className="w-full mb-6 bg-primary hover:bg-primary/90 text-white"
            onClick={handleFindRoute}
            disabled={origin === destination}
          >
            Find Routes
          </Button>
        </div>
        
        {route && (
          <div className="bg-slate-50 p-6">
            <div className="mb-4 pb-3 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm text-slate-500">Showing routes from</span>
                  <h4 className="text-lg font-medium text-slate-900">
                    {route.segments[0].from.name} → {route.segments[0].to.name}
                  </h4>
                </div>
                
                <div className="text-right">
                  <span className="text-sm text-slate-500">Total distance</span>
                  <div className="text-lg font-medium text-slate-900">
                    {formatDistance(route.totalDistance)}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Map preview */}
            <div className="mb-8 bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200">
              {mapUrl ? (
                <iframe
                  title="Route Map"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={mapUrl}
                  allowFullScreen
                  className="w-full"
                ></iframe>
              ) : (
                <div className="h-48 w-full bg-slate-100 flex items-center justify-center">
                  <div className="flex flex-col items-center text-slate-500">
                    <Map className="h-8 w-8 mb-2" />
                    <p>Route map preview</p>
                    <p className="text-xs">(Requires API key setup)</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Primary route */}
            <div className="mb-6 bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-start gap-4">
                  <div className="text-primary mt-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white text-xs font-medium">
                      1
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-slate-900">
                      <span className="text-lg font-medium">{route.segments[0].from.name}</span>
                      <div className="mx-2 h-px w-6 bg-slate-300"></div>
                      <span className="text-lg font-medium">{route.segments[0].to.name}</span>
                    </div>
                    
                    <div className="flex gap-4 text-sm text-slate-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Truck className="h-3 w-3" />
                        <span>{formatDistance(route.totalDistance)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTime(route.totalTime)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Scale className="h-3 w-3" />
                        <span>{trailer.name}</span>
                      </div>
                    </div>
                    
                    {route.complianceIssues.length > 0 && (
                      <div className="mt-3 flex items-start gap-1 text-amber-600">
                        <AlertCircle className="h-4 w-4 mt-0.5" />
                        <div className="text-xs">
                          <p className="font-medium">Special permits required</p>
                          <p className="text-slate-600">
                            {route.complianceIssues[0].name}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => {
                    onRouteSelect(route);
                    toast.success('Route selected');
                  }}
                >
                  Select
                </Button>
              </div>
            </div>
            
            {/* Alternative routes */}
            <h4 className="text-sm font-medium text-slate-700 mb-3">Alternative Routes</h4>
            
            {alternatives.map((altRoute, idx) => (
              <div 
                key={idx}
                className="mb-3 bg-white rounded-lg overflow-hidden border border-slate-200 hover:shadow-sm transition-shadow"
              >
                <div className="p-4 flex justify-between items-center">
                  <div className="flex items-start gap-4">
                    <div className="text-slate-400 mt-1">
                      <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
                        {idx + 2}
                      </span>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-slate-700">
                        <span className="font-medium">{route.segments[0].from.name}</span>
                        <div className="mx-2 h-px w-6 bg-slate-300"></div>
                        <span className="font-medium">{route.segments[0].to.name}</span>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-slate-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Truck className="h-3 w-3" />
                          <span>{formatDistance(altRoute.totalDistance)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTime(altRoute.totalTime)}</span>
                        </div>
                      </div>
                      
                      {altRoute.complianceIssues.length > 0 && (
                        <div className="mt-2 flex items-start gap-1 text-amber-600">
                          <Info className="h-3.5 w-3.5 mt-0.5" />
                          <div className="text-xs">
                            <p>{altRoute.complianceIssues[0].name}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="outline"
                    className="text-slate-700 border-slate-300"
                    onClick={() => {
                      onRouteSelect(altRoute);
                      toast.success('Alternative route selected');
                    }}
                  >
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default RouteMap;
