import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen  flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-9xl font-extrabold text-primary">404</h1>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-300">
            Oops! Page not found
          </h2>
          <p className="mt-2 text-lg text-primary/50">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>
        <div className="mt-8">
          <Link href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white dark:text-black bg-primary hover:bg-primary/100">
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}