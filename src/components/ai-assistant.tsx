
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { Label } from "./ui/label";
import { suggestVehicles } from '@/ai/flows/vehicle-suggester-flow';
import VehicleCard from './vehicle-card';
import type { Vehicle } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Suggestion = {
  vehicle: Vehicle;
  reasoning: string;
};

interface AiAssistantProps {
  vehicles: Vehicle[];
}

export default function AiAssistant({ vehicles }: AiAssistantProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFindCar = async () => {
    if (!prompt) return;
    setLoading(true);
    setError(null);
    setSuggestions([]);

    try {
      const result = await suggestVehicles({ tripDescription: prompt });
      const suggestedVehicles = result.suggestions
        .map(suggestion => {
            const vehicle = vehicles.find(v => v.id === suggestion.vehicleId);
            return vehicle ? { vehicle, reasoning: suggestion.reasoning } : null;
        })
        .filter((item): item is Suggestion => item !== null);
      
      setSuggestions(suggestedVehicles);
    } catch (e) {
      console.error(e);
      setError('An error occurred while getting suggestions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Assistant
          </CardTitle>
          <CardDescription>
              Describe your perfect trip, and we'll find the perfect car for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
              <Label htmlFor="ai-prompt">What are you looking for?</Label>
              <Textarea 
                  id="ai-prompt"
                  placeholder="e.g., 'A fun convertible for a weekend trip to the coast for two people.'"
                  className="min-h-[120px]"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={loading}
              />
          </div>
          <Button className="w-full" onClick={handleFindCar} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
              Find my car
          </Button>
        </CardContent>
      </Card>
      {error && (
         <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {suggestions.length > 0 && (
        <div className="space-y-4 mt-6">
            <h3 className="text-xl font-bold font-headline text-center">Here are my top picks for you:</h3>
            {suggestions.map(({ vehicle, reasoning }) => (
                <Card key={vehicle.id}>
                    <CardContent className="p-4">
                        <VehicleCard vehicle={vehicle} />
                        <p className="text-sm text-muted-foreground mt-4 p-2 bg-secondary rounded-md">{reasoning}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
      )}
    </>
  );
}
