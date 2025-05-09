
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
    
    console.log("Finding suitable trailers for:", loadDimensions, loadWeight);
    
    const suitableTrailers = findSuitableTrailers(
      loadDimensions.length,
      loadDimensions.width,
      loadDimensions.height,
      loadWeight
    );
    
    console.log("Found trailers:", suitableTrailers.length);
    
    if (suitableTrailers.length === 0) {
      toast.error("No trailers found for your load. Please check dimensions and weight.");
      return;
    }
    
    if (!suitableTrailers.some(t => 
      convertDimensionToFeet(loadDimensions.length) <= t.maxLength &&
      convertDimensionToFeet(loadDimensions.width) <= t.maxWidth &&
      convertDimensionToFeet(loadDimensions.height) <= t.maxHeight
    )) {
      toast.warning("No exact trailer matches found. Showing closest options.");
    }
    
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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
            className="w-full"
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

  // Google Flights inspired tab names
  const getStepTitle = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return 'Load Details';
      case 2:
        return 'Select Trailer';
      case 3:
        return 'Select Route';
      case 4:
        return 'Quote & Book';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      <main className="flex-1 w-full mx-auto py-8 px-4 sm:px-6 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2 text-slate-900">
            Smart Load Transport
          </h1>
          <p className="text-lg text-slate-600">
            Find the perfect trailer, route, and pricing for your load
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          <div className="mb-6 sticky top-16 bg-slate-50 pt-2 pb-4 z-10 shadow-sm">
            <Tabs value={step.toString()} className="w-full">
              <TabsList className="grid w-full grid-cols-4 p-1 bg-slate-100 rounded-xl">
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
                    className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-all 
                      ${step >= tabStep ? 'text-slate-900' : 'text-slate-500'} 
                      ${tabStep === step ? 'bg-white shadow-sm' : ''}
                      ${tabStep < step ? 'hover:bg-slate-200/70' : ''}`}
                  >
                    <div className="flex items-center">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs mr-2">
                        {tabStep}
                      </span>
                      <span className="hidden sm:inline">{getStepTitle(tabStep)}</span>
                      <span className="sm:hidden">{tabStep}</span>
                    </div>
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
