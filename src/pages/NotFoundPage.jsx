import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary-light dark:bg-secondary-dark text-center px-4">
      <div className="max-w-md">
        <h1 className="text-9xl font-bold text-primary_app">404</h1>
        <h2 className="mt-4 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
          Page Not Found
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-block px-8 py-3 text-base font-medium text-white btn-primary-app border border-transparent rounded-md"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
