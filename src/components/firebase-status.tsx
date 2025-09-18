'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, AlertTriangle, CheckCircle } from 'lucide-react';

interface ServiceStatus {
  firestore: boolean;
  storage: boolean;
  auth: boolean;
  functions: boolean;
}

export function FirebaseStatus() {
  const [status, setStatus] = useState<ServiceStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check Firebase services status
        const response = await fetch('/api/health', { 
          cache: 'no-store',
          signal: AbortSignal.timeout(5000) 
        });
        
        if (!response.ok) {
          throw new Error(`Health check failed: ${response.status}`);
        }

        const data = await response.json();
        setStatus(data.services);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Set all services as potentially down
        setStatus({
          firestore: false,
          storage: false,
          auth: false,
          functions: false,
        });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    
    // Check status every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge variant="secondary" className="animate-pulse">
          <Wifi className="w-3 h-3 mr-1" />
          Checking...
        </Badge>
      </div>
    );
  }

  if (error || !status) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert className="w-80">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Service status unavailable: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allServicesUp = Object.values(status).every(Boolean);
  const someServicesDown = Object.values(status).some(service => !service);

  if (allServicesUp) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="w-3 h-3 mr-1" />
          All Systems Operational
        </Badge>
      </div>
    );
  }

  if (someServicesDown) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <Alert className="w-80">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-1">
              <p className="font-medium">Service Issues Detected</p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {Object.entries(status).map(([service, isUp]) => (
                  <div key={service} className="flex items-center">
                    <div 
                      className={`w-2 h-2 rounded-full mr-2 ${
                        isUp ? 'bg-green-500' : 'bg-red-500'
                      }`} 
                    />
                    <span className="capitalize">{service}</span>
                  </div>
                ))}
              </div>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}
