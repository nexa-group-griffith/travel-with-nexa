'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Shield, CreditCard, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SecurityAlerts({
  slerts,
}: {
  slerts: {
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
      const alert = slerts.map((alert) => ({
        ...alert,
        icon:
          alert.type === 'travel' ? (
            <AlertTriangle className='h-4 w-4' />
          ) : alert.type === 'security' ? (
            <Shield className='h-4 w-4' />
          ) : (
            <CreditCard className='h-4 w-4' />
          ),
      }));
      setAlerts(alert);
      setLoading(false);
    }, 1000);
  }, []);

  const getSeverityClass = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-destructive/15 text-destructive';
      case 'medium':
        return 'bg-warning/15 text-warning';
      case 'low':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
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
            className={getSeverityClass(alert.severity)}
          >
            {alert.icon}
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ))
      ) : (
        <div className='flex flex-col items-center justify-center py-8 text-center'>
          <Shield className='mb-2 h-8 w-8 text-muted-foreground' />
          <p className='text-muted-foreground'>
            No security alerts for your destinations
          </p>
        </div>
      )}
    </div>
  );
}
