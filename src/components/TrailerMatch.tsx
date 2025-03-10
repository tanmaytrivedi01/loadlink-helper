
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Trailer } from '@/lib/trailers';
import { toast } from 'sonner';

interface TrailerMatchProps {
  trailers: Trailer[];
  dimensions: { length: number; width: number; height: number };
  weight: number;
  onTrailerSelect: (trailer: Trailer) => void;
}

const TrailerMatch: React.FC<TrailerMatchProps> = ({ 
  trailers, 
  dimensions, 
  weight,
  onTrailerSelect 
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<string | null>(
    trailers.length > 0 ? trailers[0].id : null
  );

  const handleSelect = (trailer: Trailer) => {
    setSelectedTrailer(trailer.id);
    onTrailerSelect(trailer);
    toast.success(`Selected ${trailer.name}`);
  };

  if (trailers.length === 0) {
    return (
      <Card className="p-6 glassmorphism border-red-100">
        <div className="flex items-center space-x-3 text-red-500 mb-3">
          <AlertCircle className="h-5 w-5" />
          <h3 className="text-xl font-medium">No Matching Trailers</h3>
        </div>
        <p className="text-muted-foreground mb-4">
          Your load dimensions or weight exceed the capacity of our available trailers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="border border-red-100 rounded-md p-3 bg-red-50/30">
            <p className="text-xs font-medium text-red-500 mb-1">Issue</p>
            <p className="text-sm">
              {dimensions.length > 53 && "Length exceeds maximum trailer length. "}
              {dimensions.width > 8.5 && "Width exceeds standard trailer width. "}
              {dimensions.height > 11.5 && "Height exceeds maximum trailer height. "}
              {weight > 80000 && "Weight exceeds legal load limit. "}
            </p>
          </div>
          <div className="border border-muted rounded-md p-3 bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Recommendation</p>
            <p className="text-sm">
              Consider splitting your load or requesting a specialized trailer.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 glassmorphism">
        <div className="flex items-center space-x-3 text-green-600 mb-4">
          <CheckCircle className="h-5 w-5" />
          <h3 className="text-xl font-medium">Matching Trailers</h3>
        </div>
        
        <p className="text-muted-foreground mb-6">
          We found {trailers.length} suitable trailer{trailers.length !== 1 ? 's' : ''} for your load.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="border border-muted rounded-md p-3 bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Load Dimensions</p>
            <p className="text-sm">{dimensions.length}' L × {dimensions.width}' W × {dimensions.height}' H</p>
          </div>
          <div className="border border-muted rounded-md p-3 bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Load Weight</p>
            <p className="text-sm">{weight.toLocaleString()} lbs</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {trailers.map((trailer) => (
            <motion.div
              key={trailer.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-primary/50 hover:shadow-md ${
                selectedTrailer === trailer.id 
                  ? 'border-primary/50 bg-primary/5' 
                  : 'border-border'
              }`}
              onClick={() => handleSelect(trailer)}
            >
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-1/4 h-24 bg-muted/30 rounded-md flex items-center justify-center">
                  {/* In a real app, we'd show actual trailer images */}
                  <span className="text-muted-foreground">{trailer.type}</span>
                </div>
                <div className="w-full sm:w-3/4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{trailer.name}</h4>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                      {trailer.type}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground mb-3">
                    <div>
                      <p>Length</p>
                      <p className="font-medium text-foreground">{trailer.maxLength}'</p>
                    </div>
                    <div>
                      <p>Width</p>
                      <p className="font-medium text-foreground">{trailer.maxWidth}'</p>
                    </div>
                    <div>
                      <p>Height</p>
                      <p className="font-medium text-foreground">{trailer.maxHeight}'</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {trailer.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {selectedTrailer && (
          <Button
            className="w-full mt-6 bg-primary hover:bg-primary/90"
            onClick={() => handleSelect(trailers.find(t => t.id === selectedTrailer)!)}
          >
            Continue with Selected Trailer
          </Button>
        )}
      </Card>
    </motion.div>
  );
};

export default TrailerMatch;
