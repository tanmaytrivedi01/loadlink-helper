import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findSuitableTrailers, Trailer, convertDimensionToFeet } from '@/lib/trailers';
import { Route } from '@/lib/routes';
import { toast } from 'sonner';

import Header from '@/components/Header';
import ImageUpload from '@/components/ImageUpload';
import TrailerMatch from '@/components/TrailerMatch';
import LoadVisualizer from '@/components/LoadVisualizer';
import RouteMap from '@/components/RouteMap';
import DocumentGenerator from '@/components/DocumentGenerator';
import Footer from '@/components/Footer';

const Index = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState<{ 
    length: number | string, 
    width: number | string, 
    height: number | string 
  }>({ length: 0, width: 0, height: 0 });
  const [weight, setWeight] = useState<number | string>(0);
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [trailers, setTrailers] = useState<Trailer[]>([]);
  const [route, setRoute] = useState<Route | null>(null);

  const handleImageUploaded = (
    uploadedImage: string,
    loadDimensions: { length: number | string; width: number | string; height: number | string },
    loadWeight: number | string
  ) => {
    setImage(uploadedImage);
    setDimensions(loadDimensions);
    setWeight(loadWeight);
    
    const suitableTrailers = findSuitableTrailers(
      loadDimensions.length,
      loadDimensions.width,
      loadDimensions.height,
      loadWeight
    );
    
    setTrailers(suitableTrailers);
    setStep(2);
  };

  const handleTrailerSelect = (selectedTrailer: Trailer) => {
    setTrailer(selectedTrailer);
    setStep(3);
  };

  const handleRouteSelect = (selectedRoute: Route) => {
    setRoute(selectedRoute);
    setStep(4);
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <ImageUpload onImageUploaded={handleImageUploaded} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <TrailerMatch
              trailers={trailers}
              dimensions={dimensions}
              weight={weight}
              onTrailerSelect={handleTrailerSelect}
            />
          </motion.div>
        );
      case 3:
        return trailer ? (
          <motion.div
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="space-y-8">
              <LoadVisualizer
                trailer={trailer}
                loadDimensions={{
                  length: Number(convertDimensionToFeet(dimensions.length)),
                  width: Number(convertDimensionToFeet(dimensions.width)),
                  height: Number(convertDimensionToFeet(dimensions.height))
                }}
              />
              <RouteMap
                trailer={trailer}
                loadDimensions={{
                  length: Number(convertDimensionToFeet(dimensions.length)),
                  width: Number(convertDimensionToFeet(dimensions.width)),
                  height: Number(convertDimensionToFeet(dimensions.height))
                }}
                weight={Number(weight)}
                onRouteSelect={handleRouteSelect}
              />
            </div>
          </motion.div>
        ) : null;
      case 4:
        return trailer && route ? (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <DocumentGenerator
              trailer={trailer}
              loadDimensions={dimensions}
              weight={weight}
              route={route}
            />
          </motion.div>
        ) : null;
      default:
        return null;
    }
  };

  const getStepTitle = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return 'Upload Load';
      case 2:
        return 'Match Trailer';
      case 3:
        return 'Plan Route';
      case 4:
        return 'Generate Documents';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Smart Load Matching
          </h1>
          <p className="text-lg text-muted-foreground">
            Upload your load, find the perfect trailer, and plan your route in minutes.
          </p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Tabs value={step.toString()} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                {[1, 2, 3, 4].map((tabStep) => (
                  <TabsTrigger
                    key={tabStep}
                    value={tabStep.toString()}
                    disabled={tabStep > step}
                    onClick={() => {
                      if (tabStep <= step) {
                        setStep(tabStep);
                      }
                    }}
                  >
                    <span className="hidden sm:inline">{getStepTitle(tabStep)}</span>
                    <span className="sm:hidden">{tabStep}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
          
          <AnimatePresence mode="wait">
            {getStepContent()}
          </AnimatePresence>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
