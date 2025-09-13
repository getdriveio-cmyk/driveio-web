
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { DollarSign, MapPin, Edit, Tag, Info, FileText } from 'lucide-react';
import type { ListingFormValues } from './listing-form';

interface ListingSummaryProps {
  data: ListingFormValues;
  images: string[];
}

export default function ListingSummary({ data, images }: ListingSummaryProps) {
  const { make, model, year, location, description, features, price, cancellationPolicy, mileagePolicy, fuelPolicy } = data;

  const featureList = features?.split(',').map(f => f.trim()).filter(Boolean) || [];

  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{year} {make} {model}</CardTitle>
        <CardDescription>
            <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4" /> {location || 'Location not set'}
            </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {images.length > 0 ? (
          <div className="grid grid-cols-5 gap-2">
            {images.map((src, index) => (
              <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-secondary">
                <Image src={src} alt={`Preview ${index + 1}`} fill className="object-cover" />
              </div>
            ))}
          </div>
        ) : (
             <div className="aspect-video rounded-md bg-secondary flex items-center justify-center text-muted-foreground">
                <p>No photos uploaded</p>
            </div>
        )}
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><Info className="w-4 h-4" /> Description</h4>
                    <p className="text-sm text-muted-foreground">{description || 'No description provided.'}</p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><Tag className="w-4 h-4" /> Features</h4>
                    {featureList.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {featureList.map((feature, i) => (
                                <div key={i} className="bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded-full">{feature}</div>
                            ))}
                        </div>
                    ) : (
                         <p className="text-sm text-muted-foreground">No features listed.</p>
                    )}
                </div>
            </div>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><DollarSign className="w-4 h-4" /> Pricing</h4>
                    <p className="text-2xl font-bold">${price || 0}<span className="text-base font-normal text-muted-foreground">/day</span></p>
                </div>
                 <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2"><FileText className="w-4 h-4" /> Policies</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                        <li><strong>Cancellation:</strong> {cancellationPolicy || 'Not set'}</li>
                        <li><strong>Mileage:</strong> {mileagePolicy || 'Not set'}</li>
                        <li><strong>Fuel/Charge:</strong> {fuelPolicy || 'Not set'}</li>
                    </ul>
                </div>
            </div>
        </div>
        
      </CardContent>
    </Card>
  );
}
