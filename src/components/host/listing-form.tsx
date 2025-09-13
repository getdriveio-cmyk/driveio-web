
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UploadCloud, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import AiDescriptionGenerator from './ai-description-generator';
import AiFeatureSuggester from './ai-feature-suggester';
import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import AiPriceSuggester from './ai-price-suggester';
import ListingSummary from './listing-summary';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { carBrands } from '@/lib/car-brands';
import type { Vehicle } from '@/lib/types';
import { useAuth } from '@/lib/store';
import { saveVehicleAction } from '@/app/host/actions';


const listingFormSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce.number().min(2010, { message: 'Please enter a valid year' }).max(new Date().getFullYear() + 1, { message: 'Please enter a valid year' }),
  location: z.string().min(1, { message: 'Location is required' }),
  description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
  features: z.string().min(1, { message: 'Please list at least one feature' }),
  price: z.coerce.number().min(1, { message: 'Price must be greater than $0' }),
  cancellationPolicy: z.string().optional(),
  mileagePolicy: z.string().optional(),
  fuelPolicy: z.string().optional(),
  images: z.array(z.string()).min(1, { message: 'Please upload at least one photo.' }),
});

export type ListingFormValues = z.infer<typeof listingFormSchema>;

interface ListingFormProps {
    isEditMode?: boolean;
    vehicleData?: Vehicle;
}

const initialState = {
  message: "",
  success: false,
};

function SubmitButton({ isEditMode }: { isEditMode: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button size="lg" type="submit" disabled={pending} className="min-w-[150px]">
      {pending ? <Loader2 className="animate-spin" /> : (isEditMode ? 'Save Changes' : 'Publish Listing')}
    </Button>
  );
}

export default function ListingForm({ isEditMode = false, vehicleData }: ListingFormProps) {
    const { toast } = useToast();
    const router = useRouter();
    const user = useAuth((s) => s.user);
    
    const [state, formAction] = useActionState(saveVehicleAction, initialState);

    const initialImages = vehicleData?.images || [];
    const [imagePreviews, setImagePreviews] = useState<string[]>(initialImages);

    const form = useForm<ListingFormValues>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            make: vehicleData?.make || '',
            model: vehicleData?.model || '',
            year: vehicleData?.year,
            location: vehicleData?.location || 'San Francisco, CA',
            description: vehicleData?.description || '',
            features: vehicleData?.features.join(', ') || '',
            price: vehicleData?.pricePerDay,
            cancellationPolicy: vehicleData?.policies.cancellation || 'Flexible: Full refund for cancellations made within 48 hours of booking.',
            mileagePolicy: vehicleData?.policies.mileage || '200 miles per day included. $0.50 per additional mile.',
            fuelPolicy: vehicleData?.policies.fuel || 'Return with the same fuel level as received.',
            images: initialImages,
        },
    });
    
    useEffect(() => {
        if (state.success) {
            toast({
                title: 'Success!',
                description: state.message,
            });
            router.push(user?.isAdmin ? '/admin/fleet' : '/host/dashboard');
        } else if (state.message) { // Only show toast if there's an error message
            toast({
                variant: 'destructive',
                title: 'Submission Failed',
                description: state.message,
            });
        }
    }, [state, toast, router, user?.isAdmin]);

    useEffect(() => {
        form.setValue('images', imagePreviews);
    }, [imagePreviews, form]);
    
    const formData = form.watch();
    const selectedMake = form.watch('make');
    const modelsForSelectedMake = carBrands.find(brand => brand.make === selectedMake)?.models || [];
    
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - 2010 + 2 }, (_, i) => currentYear + 1 - i);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        const newPreviews: string[] = [];
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === files.length) {
                    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 6));
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImagePreviews(previews => previews.filter((_, i) => i !== index));
    };
  
  return (
    <Form {...form}>
      <form action={formAction}>
        {isEditMode && vehicleData && <input type="hidden" name="vehicleId" value={vehicleData.id} />}
        <input type="hidden" name="images" value={JSON.stringify(imagePreviews)} />

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          <div className="py-6">
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <Select onValueChange={(value) => {
                        field.onChange(value);
                        form.resetField('model');
                      }} defaultValue={field.value} name={field.name}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a make" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {carBrands.map(brand => (
                            <SelectItem key={brand.make} value={brand.make}>{brand.make}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                     <FormItem>
                      <FormLabel>Model</FormLabel>
                       <Select onValueChange={field.onChange} value={field.value} disabled={!selectedMake} name={field.name}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {modelsForSelectedMake.map(model => (
                            <SelectItem key={model} value={model}>{model}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                       <Select onValueChange={(v) => field.onChange(Number(v))} defaultValue={String(field.value)} name={field.name}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a year" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {years.map(year => (
                            <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., San Francisco, CA" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="features"
                  render={({ field }) => (
                    <FormItem>
                       <FormLabel>Features</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Electric, Autopilot, A/C" {...field} />
                      </FormControl>
                      <FormDescription>
                        Separate features with a comma. Use the AI suggester to get ideas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <AiFeatureSuggester form={form} />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Description</FormLabel>
                        <AiDescriptionGenerator form={form} />
                      </div>
                      <FormControl>
                        <Textarea placeholder="Describe your vehicle in detail." {...field} rows={5} />
                      </FormControl>
                       <FormDescription>
                        Provide a compelling summary of your vehicle's best qualities.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </TabsContent>
            <TabsContent value="photos">
              <FormField
                control={form.control}
                name="images"
                render={() => (
                    <FormItem>
                        <FormLabel>Vehicle Photos ({imagePreviews.length}/6)</FormLabel>
                         <FormDescription>
                           Upload at least 1 photo. The first photo you select will be the main one.
                        </FormDescription>
                        <FormControl>
                            <div className="space-y-4">
                                <label htmlFor="photo-upload" className="block cursor-pointer border-2 border-dashed rounded-lg p-12 text-center hover:border-primary">
                                    <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-2 text-sm text-muted-foreground">Drag and drop photos here, or click to browse</p>
                                    <Input 
                                        id="photo-upload" 
                                        type="file" 
                                        multiple 
                                        accept="image/*"
                                        onChange={handleImageChange} 
                                        className="hidden" 
                                    />
                                </label>
                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                        {imagePreviews.map((src, i) => (
                                            <div key={src + i} className="relative aspect-video rounded-lg overflow-hidden border">
                                                <Image src={src} alt={`Uploaded vehicle preview ${i+1}`} fill className="object-cover" />
                                                <Button 
                                                    type="button" 
                                                    variant="destructive" 
                                                    size="icon" 
                                                    className="absolute top-1 right-1 h-6 w-6"
                                                    onClick={() => removeImage(i)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
                />
            </TabsContent>
            <TabsContent value="pricing" className="space-y-6">
               <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                       <div className="flex justify-between items-center">
                        <FormLabel>Price per day ($)</FormLabel>
                        <AiPriceSuggester form={form} />
                      </div>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 120" {...field} />
                      </FormControl>
                       <FormDescription>
                        Set a competitive daily rate for your vehicle.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="cancellationPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cancellation Policy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your cancellation policy..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mileagePolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mileage Policy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your mileage policy..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fuelPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fuel/Charging Policy</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your fuel or charging policy..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
            <TabsContent value="publish" className="space-y-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold font-headline">Review Your Listing</h2>
                    <p className="text-muted-foreground">This is how your listing will appear to renters. Review all the details before publishing.</p>
                </div>
                <ListingSummary data={formData} images={imagePreviews} />
                <div className="flex justify-center pt-4">
                   <SubmitButton isEditMode={isEditMode} />
                </div>
            </TabsContent>
          </div>
        </Tabs>
      </form>
    </Form>
  );
}
