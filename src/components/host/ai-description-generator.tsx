
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { generateVehicleDescription } from '@/ai/flows/generate-vehicle-description-flow';
import type { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

interface AiDescriptionGeneratorProps {
  form: UseFormReturn<any>;
}

export default function AiDescriptionGenerator({ form }: AiDescriptionGeneratorProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDescription = async () => {
    setLoading(true);
    setError(null);
    const { make, model, year, features } = form.getValues();

    if (!make || !model || !year || !features) {
        setError('Please fill in Make, Model, Year, and Features to generate a description.');
        setLoading(false);
        return;
    }

    try {
      const result = await generateVehicleDescription({ 
        make, 
        model, 
        year: Number(year), 
        features 
      });
      form.setValue('description', result.description, { shouldValidate: true });
    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the description. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={handleGenerateDescription} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Generate with AI
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
