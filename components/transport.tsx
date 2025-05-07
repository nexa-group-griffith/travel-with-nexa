import { Bus, Train, Car, Plane } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const getTransportIcon = (type: string, name: string) => {
  if (type === 'bus' || type === 'public') {
    return <Bus className='h-5 w-5 text-primary' />;
  } else if (
    type === 'train' ||
    type === 'rail' ||
    type === 'subway' ||
    name === 'Namma Metro'
  ) {
    return <Train className='h-5 w-5 text-primary' />;
  } else if (type === 'car' || name === 'Taxis') {
    return <Car className='h-5 w-5 text-primary' />;
  } else if (type === 'plane') {
    return <Plane className='h-5 w-5 text-primary' />;
  } else {
    return <Car className='h-5 w-5 text-primary' />;
  }
};

type Transport = {
  type: string;
  name: string;
  description: string;
};

type TransportationProps = {
  destination: {
    transportation: Transport[];
  };
};

const Transportation: React.FC<TransportationProps> = ({ destination }) => {
  console.log('first', destination?.transportation);
  return (
    <Card className='shadow-lg rounded-lg overflow-hidden'>
      <CardHeader className=' text-white p-4'>
        <CardTitle className='text-lg font-semibold'>Transportation</CardTitle>
      </CardHeader>
      <CardContent className='p-4'>
        <div className='space-y-4'>
          {destination?.transportation.map((transport, index) => (
            <div
              key={index}
              className='flex items-center gap-4 p-3 border rounded-lg shadow-sm bg-muted hover:bg-muted/75 transition-all'
            >
              {getTransportIcon(transport.type, transport.name)}
              <div className='flex flex-col'>
                <h4 className='text-base font-medium'>{transport?.name}</h4>
                <p className='text-sm text-muted-foreground'>
                  {transport?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Transportation;
