
import React, { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Trailer } from '@/lib/trailers';

interface LoadVisualizerProps {
  trailer: Trailer;
  loadDimensions: { length: number; width: number; height: number };
}

const LoadVisualizer: React.FC<LoadVisualizerProps> = ({ trailer, loadDimensions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Colors for the visualization
  const colors = {
    trailer: '#e0e0e0',
    load: '#3b82f6',
    grid: '#f0f0f0',
    background: '#ffffff'
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Clear canvas
    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    const gridSize = 20;
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Scale factors (adjust these based on the canvas size)
    const scale = Math.min(
      (canvas.width - 60) / trailer.maxLength,
      (canvas.height - 60) / Math.max(trailer.maxHeight, trailer.maxWidth)
    );
    
    const trailerWidth = trailer.maxWidth * scale;
    const trailerLength = trailer.maxLength * scale;
    const trailerHeight = trailer.maxHeight * scale;
    
    const loadWidth = loadDimensions.width * scale;
    const loadLength = loadDimensions.length * scale;
    const loadHeight = loadDimensions.height * scale;
    
    // Calculate positions (center everything)
    const startX = (canvas.width - trailerLength) / 2;
    const startY = (canvas.height - trailerWidth) / 2;

    // Draw the trailer (top view)
    ctx.fillStyle = colors.trailer;
    ctx.fillRect(startX, startY, trailerLength, trailerWidth);
    
    // Draw the trailer outline
    ctx.strokeStyle = '#888';
    ctx.lineWidth = 2;
    ctx.strokeRect(startX, startY, trailerLength, trailerWidth);
    
    // Draw the load inside the trailer
    ctx.fillStyle = colors.load;
    
    // Center the load in the trailer
    const loadStartX = startX + (trailerLength - loadLength) / 2;
    const loadStartY = startY + (trailerWidth - loadWidth) / 2;
    
    ctx.fillRect(loadStartX, loadStartY, loadLength, loadWidth);
    
    // Draw the load outline
    ctx.strokeStyle = '#3366CC';
    ctx.lineWidth = 2;
    ctx.strokeRect(loadStartX, loadStartY, loadLength, loadWidth);
    
    // Add labels
    ctx.fillStyle = '#333';
    ctx.font = '14px sans-serif';
    
    // Trailer label
    ctx.fillText('Trailer', startX, startY - 10);
    ctx.fillText(`${trailer.maxLength}' × ${trailer.maxWidth}'`, startX, startY - 30);
    
    // Load label
    ctx.fillStyle = '#3366CC';
    ctx.fillText('Load', loadStartX, loadStartY - 10);
    ctx.fillText(`${loadDimensions.length}' × ${loadDimensions.width}'`, loadStartX, loadStartY - 30);
    
    // Add a simple legend
    const legendX = canvas.width - 150;
    const legendY = canvas.height - 70;
    
    ctx.fillStyle = '#333';
    ctx.fillText('Legend:', legendX, legendY);
    
    ctx.fillStyle = colors.trailer;
    ctx.fillRect(legendX, legendY + 15, 20, 20);
    ctx.fillStyle = '#333';
    ctx.fillText('Trailer', legendX + 30, legendY + 30);
    
    ctx.fillStyle = colors.load;
    ctx.fillRect(legendX, legendY + 45, 20, 20);
    ctx.fillStyle = '#333';
    ctx.fillText('Load', legendX + 30, legendY + 60);

  }, [trailer, loadDimensions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 glassmorphism">
        <h3 className="text-xl font-medium mb-4">Load Visualization</h3>
        <p className="text-muted-foreground mb-6">
          This visualization shows how your load fits inside the {trailer.name.toLowerCase()}.
        </p>
        
        <div className="bg-white border border-muted rounded-lg overflow-hidden shadow-sm">
          <div className="p-4 bg-muted/10 border-b border-muted">
            <p className="text-sm font-medium">Top View</p>
          </div>
          <div className="h-[400px] w-full relative">
            <canvas 
              ref={canvasRef}
              className="w-full h-full"
            />
          </div>
          <div className="p-4 border-t border-muted">
            <p className="text-xs text-muted-foreground">
              Note: This is a simplified 2D representation. In a full application, this would be an interactive 3D model.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="border border-muted rounded-md p-3 bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Space Utilization</p>
            <p className="text-sm">
              {Math.round((loadDimensions.length * loadDimensions.width * loadDimensions.height) / 
              (trailer.maxLength * trailer.maxWidth * trailer.maxHeight) * 100)}% of trailer capacity
            </p>
          </div>
          <div className="border border-muted rounded-md p-3 bg-muted/10">
            <p className="text-xs font-medium text-muted-foreground mb-1">Weight Utilization</p>
            <p className="text-sm">
              {Math.round((loadDimensions.length * loadDimensions.width * loadDimensions.height) / 
              (trailer.maxLength * trailer.maxWidth * trailer.maxHeight) * 100)}% of weight capacity
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default LoadVisualizer;
