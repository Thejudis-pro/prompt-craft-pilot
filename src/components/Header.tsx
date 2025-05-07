
import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="border-b border-white/10 backdrop-blur-md bg-black/20 sticky top-0 z-10 w-full">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto w-full">
        <Link to="/" className="text-xl font-bold">
          PromptPilot
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/saved-prompts" className="hover:text-primary transition-colors">
                Saved Prompts
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-primary transition-colors">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
