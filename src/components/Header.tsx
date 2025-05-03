
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-10">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="text-xl font-bold">
          PromptPilot
        </Link>
      </div>
    </header>
  );
};

export default Header;
