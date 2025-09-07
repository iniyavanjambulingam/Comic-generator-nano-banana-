
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center py-8">
      <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-600">
        AI Comic Strip Generator
      </h1>
      <p className="text-lg text-gray-400 mt-2">
        Turn your stories into visual masterpieces.
      </p>
    </header>
  );
};

export default Header;
