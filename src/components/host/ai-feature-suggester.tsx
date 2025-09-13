
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { suggestVehicleFeatures } from '@/ai/flows/suggest-vehicle-features-flow';
import type { UseFormReturn } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Badge } from '../ui/badge';

interface AiFeatureSuggesterProps {
  form: UseFormReturn<any>;
}

export default function AiFeatureSuggester({ form }: AiFeatureSuggesterProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSuggestFeatures = async () => {
    setLoading(true);
    setError(null);
    setSuggestions([]);
    const { make, model, year } = form.getValues();

    if (!make || !model || !year) {
        setError('Please fill in Make, Model, and Year to get feature suggestions.');
        setLoading(false);
        return;
    }

    try {
      const result = await suggestVehicleFeatures({ 
        make, 
        model, 
        year: Number(year), 
      });
      const suggested = result.features.split(',').map(f => f.trim()).filter(Boolean);
      setSuggestions(suggested);

    } catch (e) {
      console.error(e);
      setError('An error occurred while suggesting features. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddFeature = (featureToAdd: string) => {
    const currentFeatures = form.getValues('features') || '';
    const existing = currentFeatures.split(',').map((f: string) => f.trim().toLowerCase());
    if (!existing.includes(featureToAdd.toLowerCase())) {
        const newFeatures = [...currentFeatures.split(',').map((f: string) => f.trim()), featureToAdd].filter(Boolean).join(', ');
        form.setValue('features', newFeatures, { shouldValidate: true });
    }
  }

  return (
    <div className="space-y-2">
      <Button type="button" variant="outline" size="sm" onClick={handleSuggestFeatures} disabled={loading}>
        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
        Suggest with AI
      </Button>
      {error && (
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {suggestions.length > 0 && (
          <div className="space-y-2 pt-2">
              <p className="text-sm font-medium">Click to add suggestions:</p>
              <div className="flex flex-wrap gap-2">
                  {suggestions.map((feature) => (
                      <Badge 
                        key={feature} 
                        variant="secondary"
                        onClick={() => handleAddFeature(feature)}
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                       >
                          {feature}
                      </Badge>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
}
