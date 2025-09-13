
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { suggestVehiclePrice } from '@/ai/flows/suggest-vehicle-price-flow';
import type { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AiPriceSuggesterProps {
  form: UseFormReturn<any>;
}

export default function AiPriceSuggester({ form }: AiPriceSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggestPrice = async () => {
    setLoading(true);
    setError(null);
    const { make, model, year, location } = form.getValues();

    if (!make || !model || !year || !location) {
        setError('Please fill in Make, Model, Year, and Location to get a price suggestion.');
        setLoading(false);
        return;
    }

    try {
      const result = await suggestVehiclePrice({ 
        make, 
        model, 
        year: Number(year),
        location,
      });
      form.setValue('price', result.price, { shouldValidate: true });
    } catch (e) {
      console.error(e);
      setError('An error occurred while suggesting a price. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={handleSuggestPrice} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Suggest with AI
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
