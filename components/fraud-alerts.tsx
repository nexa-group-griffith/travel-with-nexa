'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  CreditCard,
  Loader2,
  CarTaxiFront,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function FraudAlerts({
  alertsData,
}: {
  alertsData: {
    type: string;
    title: string;
    description: string;
    severity: string;
  }[];
}) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const mappedAlerts = alertsData.map((alert) => ({
        ...alert,
        icon:
          alert.type === 'taxi' ? (
            <CarTaxiFront className='h-4 w-4' />
          ) : alert.type === 'security' ? (
            <Shield className='h-4 w-4' />
          ) : (
            <AlertTriangle className='h-4 w-4' />
          ),
      }));
      setAlerts(mappedAlerts);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-l-4 border-red-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-700 border-l-4 border-green-500';
      default:
        return 'bg-gray-100 text-gray-700 border-l-4 border-gray-500';
    }
  };

  if (loading) {
    return (
      <div className='flex h-40 items-center justify-center'>
        <Loader2 className='h-8 w-8 animate-spin text-primary' />
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {alerts.length > 0 ? (
        alerts.map((alert, index) => (
          <Alert
            key={index}
            className={`p-4 rounded-lg shadow ${getSeverityClass(
              alert.severity
            )}`}
          >
            <div className='flex items-center gap-2'>
              {alert.icon}
              <div>
                <AlertTitle className='font-semibold'>{alert.title}</AlertTitle>
                <AlertDescription className='text-sm'>
                  {alert.description}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Shield className='mb-2 h-8 w-8 text-gray-500' />
          <p className='text-gray-500'>No fraud alerts at the moment</p>
        </div>
      )}
    </div>
  );
}
