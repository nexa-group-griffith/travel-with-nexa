import { Star } from 'lucide-react';
import React from 'react';

export const RatingComponent = (rating: { rating: number }) => {
  return (
    <div className='flex items-center gap-2'>
      {[...Array(5)].map((_, index) => {
        if (index < Math.floor(rating?.rating)) {
          return (
            <Star
              key={index}
              className='h-4 w-4 fill-yellow-500 text-yellow-500'
            />
          );
        }
        if (index === Math.floor(rating?.rating) && rating?.rating % 1 !== 0) {
          const value = (rating?.rating - Math.floor(rating?.rating)) * 100;
          return (
            <div
              key={index}
              className='items-center justify-center flex'
            >
              <div className='relative w-4 h-4'>
                <Star
                  key={`filled-${index}`}
                  className='h-4 w-4 fill-yellow-500 text-yellow-500 absolute'
                  style={{
                    clipPath: `inset(0 ${100 - value}% 0 0)`,
                  }}
                />
                <Star
                  key={`empty-${index}`}
                  className='h-4 w-4 text-gray-500 absolute'
                  style={{
                    clipPath: `inset(0  0  0  ${value}%)`,
                  }}
                />
              </div>
            </div>
          );
        }

        return (
          <Star
            key={index}
            className='h-4 w-4 text-gray-500'
          />
        );
      })}

      {/* <span className='text-muted-foreground'>{rating?.rating}/ 5</span> */}
    </div>
  );
};
