import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import './globals.css';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-100 via-white to-purple-100 dark:from-gray-800 dark:via-black dark:to-purple-900'>
      <div className='w-full max-w-md space-y-8 text-center'>
        <h1 className='text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight'>
          404
        </h1>

        <p className='text-lg text-gray-700 dark:text-gray-300'>
          Oops! It seems you've wandered into a void. This page doesn't exist.
        </p>

        <div className='mt-6'>
          <Image
            src='https://cdn-icons-png.flaticon.com/512/2922/2922503.png'
            alt='Lost in space'
            width={128}
            height={128}
            className='mx-auto animate-bounce'
          />
        </div>

        <p className='text-gray-500 dark:text-gray-400 mt-4'>
          But don’t worry, you can always find your way back home.
        </p>

        <Link
          href='/'
          className='inline-block mt-6 rounded-md bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 text-white font-medium px-6 py-3 hover:scale-105 transition-all duration-300 dark:bg-gradient-to-r dark:from-purple-600 dark:via-blue-600 dark:to-purple-700'
        >
          <span className='flex items-center justify-center gap-2'>
            Go Home <ArrowLeft className='w-5 h-5 text-white' />
          </span>
        </Link>

        <div className='mt-6 text-sm text-gray-600 dark:text-gray-400'>
          <p>
            If you think this is an error, feel free to{' '}
            <Link
              href='/contact'
              className='text-blue-500 hover:underline dark:text-blue-400'
            >
              contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
