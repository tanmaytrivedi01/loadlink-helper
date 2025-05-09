
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, FileText, Clipboard, CreditCard, Check, Mail, Phone, Calendar, User } from 'lucide-react';
import { Route, formatDistance, formatTime } from '@/lib/routes';
import { Trailer, calculatePermitCosts } from '@/lib/trailers';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import CustomerContactForm from '@/components/CustomerContactForm';

interface DocumentGeneratorProps {
  trailer: Trailer;
  loadDimensions: { length: number | string; width: number | string; height: number | string };
  weight: number | string;
  route: Route;
}

const DocumentGenerator: React.FC<DocumentGeneratorProps> = ({
  trailer,
  loadDimensions,
  weight,
  route
}) => {
  const [documentType, setDocumentType] = useState<'quote' | 'invoice'>('quote');
  const [generated, setGenerated] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'CAD'>('USD');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactFormType, setContactFormType] = useState<'quote' | 'connect'>('quote');
  
  const getBaseMileRate = () => {
    const baseRates = {
      flatbed: 2.75,
      "step-deck": 3.15,
      lowboy: 4.25,
      van: 2.50,
      reefer: 3.25,
      rgn: 5.50,
      extendable: 4.75,
      perimeter: 5.25,
      schnabel: 10.00
    };
    
    const baseRate = baseRates[trailer.type as keyof typeof baseRates] || 3.50;
    
    const loadWidthFt = typeof loadDimensions.width === 'number' 
      ? loadDimensions.width 
      : parseFloat(loadDimensions.width.toString());
      
    const loadWeightLbs = typeof weight === 'number' 
      ? weight 
      : parseFloat(weight.toString().replace(/,/g, ''));
    
    let rateMultiplier = 1.0;
    
    if (loadWidthFt > 12) rateMultiplier *= 1.75;
    else if (loadWidthFt > 10) rateMultiplier *= 1.5;
    else if (loadWidthFt > 8.5) rateMultiplier *= 1.25;
    
    if (loadWeightLbs > 200000) rateMultiplier *= 2.0;
    else if (loadWeightLbs > 120000) rateMultiplier *= 1.6;
    else if (loadWeightLbs > 80000) rateMultiplier *= 1.3;
    
    if (trailer.specializedFor) {
      rateMultiplier *= 1.35;
    }
    
    const conversionRate = currency === 'CAD' ? 1.37 : 1;
    
    return baseRate * rateMultiplier * conversionRate;
  };
  
  const mileRate = getBaseMileRate();
  const baseCost = route.totalDistance * mileRate;
  const fuelSurcharge = route.totalDistance * 0.35 * (currency === 'CAD' ? 1.37 : 1);
  const additionalServices = documentType === 'invoice' ? 75 * (currency === 'CAD' ? 1.37 : 1) : 0;
  
  const permitCosts = calculatePermitCosts(
    loadDimensions.length, 
    loadDimensions.width, 
    loadDimensions.height, 
    weight,
    currency
  );
  
  const total = baseCost + fuelSurcharge + additionalServices + permitCosts.total;
  
  const generateDocument = () => {
    setGenerated(true);
    toast.success(`${documentType === 'quote' ? 'Quote' : 'Invoice'} generated successfully`);
  };
  
  const handleDownload = () => {
    toast.success(`${documentType === 'quote' ? 'Quote' : 'Invoice'} downloaded`);
  };
  
  const handleCopy = () => {
    toast.success('Link copied to clipboard');
  };

  const handleCurrencyChange = (value: 'USD' | 'CAD') => {
    setCurrency(value);
    toast.success(`Switched to ${value} rates`);
  };
  
  const handleContactOption = (type: 'quote' | 'connect') => {
    setContactFormType(type);
    setShowContactForm(true);
  };
  
  const handleContactSubmit = (values: any) => {
    if (contactFormType === 'quote') {
      toast.success(`Quote sent to ${values.email}`);
    } else {
      toast.success(`Your information has been sent to our trucking partners. Someone will contact you shortly.`);
    }
    setShowContactForm(false);
  };

  // If showing contact form, render that instead of the quote/invoice
  if (showContactForm) {
    return (
      <CustomerContactForm 
        onSubmit={handleContactSubmit}
        submitLabel={contactFormType === 'quote' ? 'Send Quote' : 'Connect Me with Carriers'}
        isQuote={contactFormType === 'quote'}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-slate-200 shadow-md">
        <div className="p-6 bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-medium text-slate-900">
              Quote & Booking
            </h3>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Currency:</span>
              <RadioGroup 
                value={currency} 
                onValueChange={(value) => handleCurrencyChange(value as 'USD' | 'CAD')}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="USD" id="doc-usd" />
                  <Label htmlFor="doc-usd" className="text-sm">USD</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CAD" id="doc-cad" />
                  <Label htmlFor="doc-cad" className="text-sm">CAD</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Route Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Origin:</span>
                    <span className="font-medium text-slate-900">{route.segments[0].from.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Destination:</span>
                    <span className="font-medium text-slate-900">{route.segments[0].to.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Distance:</span>
                    <span className="font-medium text-slate-900">{formatDistance(route.totalDistance)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Transit Time:</span>
                    <span className="font-medium text-slate-900">{formatTime(route.totalTime)}</span>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="text-sm font-medium text-slate-900 mb-2">Shipment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dimensions:</span>
                    <span className="font-medium text-slate-900">{loadDimensions.length}' × {loadDimensions.width}' × {loadDimensions.height}'</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Weight:</span>
                    <span className="font-medium text-slate-900">{typeof weight === 'number' ? weight.toLocaleString() : weight} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trailer Type:</span>
                    <span className="font-medium text-slate-900">{trailer.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Trailer Capacity:</span>
                    <span className="font-medium text-slate-900">{trailer.maxWeight.toLocaleString()} lbs</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="bg-slate-50 py-3 px-4 border-b border-slate-200">
                <h4 className="font-medium text-slate-900">Pricing</h4>
              </div>
              
              <div className="p-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm text-slate-700">Base Rate</div>
                      <div className="text-xs text-slate-500">{formatDistance(route.totalDistance)} @ ${mileRate.toFixed(2)}/mile</div>
                    </div>
                    <div className="text-slate-900">{currency} ${baseCost.toFixed(2)}</div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-700">Fuel Surcharge</div>
                    <div className="text-slate-900">{currency} ${fuelSurcharge.toFixed(2)}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-slate-700">Permit Fee</div>
                    <div className="text-slate-900">{currency} ${permitCosts.permitFee.toFixed(2)}</div>
                  </div>
                  
                  {permitCosts.pilotCars > 0 && (
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-sm text-slate-700">Pilot Cars</div>
                        <div className="text-xs text-slate-500">{permitCosts.pilotCars} required</div>
                      </div>
                      <div className="text-slate-900">{currency} ${permitCosts.pilotCarCost.toFixed(2)}</div>
                    </div>
                  )}
                  
                  {permitCosts.policeEscort && (
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-700">Police Escort</div>
                      <div className="text-slate-900">{currency} ${permitCosts.policeEscortCost.toFixed(2)}</div>
                    </div>
                  )}
                  
                  {documentType === 'invoice' && (
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-slate-700">Additional Services</div>
                      <div className="text-slate-900">{currency} ${additionalServices.toFixed(2)}</div>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between items-center pt-2">
                    <div className="text-base font-medium text-slate-900">Total</div>
                    <div className="text-lg font-semibold text-primary">{currency} ${total.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden mb-6">
              <div className="bg-slate-50 py-3 px-4 border-b border-slate-200">
                <h4 className="font-medium text-slate-900">Route Map</h4>
              </div>
              
              <div className="p-4">
                <iframe
                  title="Google Maps Route"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps/embed/v1/directions?key=YOUR_GOOGLE_MAPS_API_KEY&origin=${route.segments[0].from.lat},${route.segments[0].from.lng}&destination=${route.segments[0].to.lat},${route.segments[0].to.lng}&mode=driving`}
                  allowFullScreen
                  className="rounded-md"
                ></iframe>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  {route.segments[0].from.name} to {route.segments[0].to.name} • {formatDistance(route.totalDistance)} • {formatTime(route.totalTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-200">
          {!generated ? (
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={generateDocument}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Quote
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-100 rounded-md p-4 flex items-start">
                <div className="mr-3 flex-shrink-0 text-green-500">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-green-800">Quote Generated Successfully</h4>
                  <p className="mt-1 text-xs text-green-700">Your quote is now ready for download or sharing. Quote Reference: Q-10042</p>
                </div>
              </div>
              
              <h4 className="text-base font-medium text-slate-900">What would you like to do next?</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col h-full">
                    <h5 className="text-sm font-medium text-slate-900 mb-2">Get a copy of your quote</h5>
                    <p className="text-xs text-slate-600 mb-4 flex-1">Download a PDF or send it via email for your records</p>
                    <div className="flex gap-2 mt-auto">
                      <Button 
                        variant="outline" 
                        className="flex-1 text-slate-700 border-slate-300 text-xs"
                        onClick={handleDownload}
                      >
                        <Download className="h-3.5 w-3.5 mr-1" /> Download
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1 text-slate-700 border-slate-300 text-xs"
                        onClick={() => handleContactOption('quote')}
                      >
                        <Mail className="h-3.5 w-3.5 mr-1" /> Email
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-primary/30 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col h-full">
                    <h5 className="text-sm font-medium text-primary mb-2">Book with a carrier</h5>
                    <p className="text-xs text-slate-600 mb-4 flex-1">Connect with our partner carriers to schedule this shipment</p>
                    <Button 
                      className="w-full mt-auto bg-primary hover:bg-primary/90 text-white text-xs"
                      onClick={() => handleContactOption('connect')}
                    >
                      <Phone className="h-3.5 w-3.5 mr-1" /> Connect with carriers
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-2">
                <Button 
                  variant="ghost" 
                  className="text-slate-600 text-xs"
                  onClick={handleCopy}
                >
                  <Clipboard className="h-3.5 w-3.5 mr-1" />
                  Copy quote link
                </Button>
                
                <div className="text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Quote valid for 7 days
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentGenerator;
