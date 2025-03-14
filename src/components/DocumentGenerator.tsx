import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Download, FileText, Clipboard, CreditCard, Check } from 'lucide-react';
import { Route, formatDistance, formatTime } from '@/lib/routes';
import { Trailer, calculatePermitCosts } from '@/lib/trailers';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="p-6 glassmorphism">
        <h3 className="text-xl font-medium mb-4">Document Generator</h3>
        <p className="text-muted-foreground mb-6">
          Generate quotes and invoices for your shipment.
        </p>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex space-x-4">
            <Button
              variant={documentType === 'quote' ? 'default' : 'outline'}
              className={documentType === 'quote' ? 'bg-primary hover:bg-primary/90' : ''}
              onClick={() => setDocumentType('quote')}
            >
              <FileText className="h-4 w-4 mr-2" />
              Quote
            </Button>
            <Button
              variant={documentType === 'invoice' ? 'default' : 'outline'}
              className={documentType === 'invoice' ? 'bg-primary hover:bg-primary/90' : ''}
              onClick={() => setDocumentType('invoice')}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Invoice
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm">Currency:</span>
            <RadioGroup 
              value={currency} 
              onValueChange={(value) => handleCurrencyChange(value as 'USD' | 'CAD')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="USD" id="doc-usd" />
                <Label htmlFor="doc-usd">USD</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CAD" id="doc-cad" />
                <Label htmlFor="doc-cad">CAD</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        
        <div className="border border-muted rounded-lg overflow-hidden">
          <div className="bg-muted/10 p-4 border-b border-muted">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{documentType === 'quote' ? 'Freight Quote' : 'Freight Invoice'}</h4>
              
              <div className="flex items-center text-xs text-muted-foreground">
                <span>Document #:</span>
                <span className="ml-2 font-mono">{documentType === 'quote' ? 'Q-' : 'INV-'}10042</span>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h5 className="text-sm font-medium mb-2">Route Details</h5>
                <div className="space-y-2 text-sm">
                  <p>Origin: <span className="font-medium">{route.segments[0].from.name}</span></p>
                  <p>Destination: <span className="font-medium">{route.segments[0].to.name}</span></p>
                  <p>Distance: <span className="font-medium">{formatDistance(route.totalDistance)}</span></p>
                  <p>Estimated Transit Time: <span className="font-medium">{formatTime(route.totalTime)}</span></p>
                </div>
              </div>
              
              <div>
                <h5 className="text-sm font-medium mb-2">Load Details</h5>
                <div className="space-y-2 text-sm">
                  <p>Dimensions: <span className="font-medium">{loadDimensions.length} × {loadDimensions.width} × {loadDimensions.height}</span></p>
                  <p>Weight: <span className="font-medium">{typeof weight === 'number' ? weight.toLocaleString() : weight} lbs</span></p>
                  <p>Trailer Type: <span className="font-medium">{trailer.name}</span></p>
                  <p>Trailer Capacity: <span className="font-medium">{trailer.maxWeight.toLocaleString()} lbs</span></p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h5 className="text-sm font-medium mb-3">Pricing Breakdown</h5>
              
              <div className="border-t border-muted">
                <div className="py-3 flex justify-between">
                  <span className="text-sm">Base Rate ({formatDistance(route.totalDistance)} @ ${mileRate.toFixed(2)}/mile)</span>
                  <span className="text-sm font-medium">{currency} ${baseCost.toFixed(2)}</span>
                </div>
                
                <div className="py-3 flex justify-between border-t border-muted">
                  <span className="text-sm">Fuel Surcharge</span>
                  <span className="text-sm font-medium">{currency} ${fuelSurcharge.toFixed(2)}</span>
                </div>
                
                <div className="py-3 flex justify-between border-t border-muted">
                  <span className="text-sm">Permit Fee</span>
                  <span className="text-sm font-medium">{currency} ${permitCosts.permitFee.toFixed(2)}</span>
                </div>
                
                {permitCosts.pilotCars > 0 && (
                  <div className="py-3 flex justify-between border-t border-muted">
                    <span className="text-sm">Pilot Cars ({permitCosts.pilotCars})</span>
                    <span className="text-sm font-medium">{currency} ${permitCosts.pilotCarCost.toFixed(2)}</span>
                  </div>
                )}
                
                {permitCosts.policeEscort && (
                  <div className="py-3 flex justify-between border-t border-muted">
                    <span className="text-sm">Police Escort</span>
                    <span className="text-sm font-medium">{currency} ${permitCosts.policeEscortCost.toFixed(2)}</span>
                  </div>
                )}
                
                {documentType === 'invoice' && (
                  <div className="py-3 flex justify-between border-t border-muted">
                    <span className="text-sm">Additional Services</span>
                    <span className="text-sm font-medium">{currency} ${additionalServices.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="py-4 flex justify-between border-t border-muted">
                  <span className="text-base font-medium">Total</span>
                  <span className="text-base font-medium">{currency} ${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {documentType === 'quote' && (
              <div className="mt-6 bg-muted/10 p-4 rounded-md text-sm">
                <p className="font-medium">Quote Terms</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Quote valid for 7 days from generation</li>
                  <li>Rates subject to fuel surcharge adjustments</li>
                  <li>Actual charges may vary based on final shipment details</li>
                  <li>Additional services may result in additional charges</li>
                </ul>
              </div>
            )}
            
            {documentType === 'invoice' && (
              <div className="mt-6 bg-muted/10 p-4 rounded-md text-sm">
                <p className="font-medium">Payment Terms</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Payment due within 30 days of invoice date</li>
                  <li>2% late fee applied to overdue payments</li>
                  <li>Please reference invoice number with payment</li>
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          {!generated ? (
            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={generateDocument}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate {documentType === 'quote' ? 'Quote' : 'Invoice'}
            </Button>
          ) : (
            <>
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCopy}
              >
                <Clipboard className="h-4 w-4 mr-2" />
                Copy Share Link
              </Button>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DocumentGenerator;
