import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="text-2xl font-bold text-blue-500 mb-4">
          Join Good Fellas
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6">
          <a href="mailto:info@GoodFellas.com" className="text-gray-600 hover:text-blue-500 transition duration-150 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            info@GoodFellas.com
          </a>
          <a href="tel:052-4444-737" className="text-gray-600 hover:text-blue-500 transition duration-150 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            052-4444-737
          </a>
        </div>
        <div className="mt-6 text-sm text-gray-500">
          © 2024 Good Fellas. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;