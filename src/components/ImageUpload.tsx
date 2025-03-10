
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  onImageUploaded: (
    image: string,
    dimensions: { length: number; width: number; height: number },
    weight: number
  ) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageUploaded }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dimensions, setDimensions] = useState({
    length: 10,
    width: 6,
    height: 4
  });
  const [weight, setWeight] = useState<number>(2000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const fileType = file.type;
    if (!fileType.includes('image')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImage(e.target.result as string);
        
        // In a real app, you'd analyze the image here to determine dimensions
        // For now, we'll just use placeholder values that will be manually editable
        toast.success('Image uploaded successfully');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = () => {
    if (image) {
      onImageUploaded(image, dimensions, weight);
    } else {
      toast.error('Please upload an image first');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden glassmorphism border border-white/40">
          <div className="p-6">
            <h3 className="text-xl font-medium mb-4">Upload Your Load</h3>
            
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
                isDragging 
                  ? 'border-primary bg-primary/5' 
                  : 'border-muted hover:border-muted-foreground/50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
                ref={fileInputRef}
              />
              
              <AnimatePresence>
                {!image ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center gap-4"
                  >
                    <div className="h-20 w-20 rounded-full bg-muted/30 flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-2">
                        Drag and drop your load image, or click to browse
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-2"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative"
                  >
                    <Button 
                      size="icon"
                      variant="secondary"
                      className="absolute top-2 right-2 z-10 rounded-full w-8 h-8"
                      onClick={handleClearImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img 
                      src={image} 
                      alt="Uploaded load" 
                      className="mx-auto max-h-[300px] rounded-md object-contain"
                    />
                    
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Length (ft)
                        </label>
                        <input
                          type="number"
                          className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md"
                          value={dimensions.length}
                          onChange={(e) => setDimensions({...dimensions, length: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Width (ft)
                        </label>
                        <input
                          type="number"
                          className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md"
                          value={dimensions.width}
                          onChange={(e) => setDimensions({...dimensions, width: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Height (ft)
                        </label>
                        <input
                          type="number"
                          className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md"
                          value={dimensions.height}
                          onChange={(e) => setDimensions({...dimensions, height: parseFloat(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <label className="text-sm font-medium text-muted-foreground">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        className="mt-1 w-full px-3 py-2 bg-background border border-input rounded-md"
                        value={weight}
                        onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    
                    <Button 
                      className="w-full mt-6 bg-primary hover:bg-primary/90"
                      onClick={handleSubmit}
                    >
                      Find Matching Trailers
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default ImageUpload;
