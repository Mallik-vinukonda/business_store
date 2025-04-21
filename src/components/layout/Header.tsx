import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaBars, FaTimes } from 'react-icons/fa';
import { useAppSelector } from '../../store';
import logo from '../../assets/logo.jpg';
import { logoPlaceholder } from '../../utils/fallbackImages';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { totalItems } = useAppSelector((state) => state.cart);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path ? 'text-secondary font-medium' : 'text-gray-700 hover:text-primary';
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img 
              src={logo} 
              alt="Sri Ramdoot Dryfruit Store" 
              className="h-16 w-auto mr-3"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = logoPlaceholder;
              }}
            />
            <div className="flex flex-col">
              <span className="text-xl font-display font-bold text-primary">Sri Ramdoot</span>
              <span className="text-sm text-accent">Dryfruit Store</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`${isActive('/')} transition-colors`}>
              Home
            </Link>
            <Link to="/products" className={`${isActive('/products')} transition-colors`}>
              Products
            </Link>
            <Link to="/about" className={`${isActive('/about')} transition-colors`}>
              About Us
            </Link>
            <Link to="/contact" className={`${isActive('/contact')} transition-colors`}>
              Contact
            </Link>
          </nav>

          {/* Cart and User Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2">
              <FaShoppingCart className="text-primary text-xl" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 9 ? '9+' : totalItems}
                </span>
              )}
            </Link>
            
            <Link to={isAuthenticated ? "/admin" : "/login"} className="p-2">
              <FaUser className="text-primary text-xl" />
            </Link>

            {/* Mobile Menu Button */}
            <button 
              className="p-2 md:hidden focus:outline-none" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaTimes className="text-primary text-xl" />
              ) : (
                <FaBars className="text-primary text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t mt-4 animate-fadeIn">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className={`${isActive('/')} block py-2 transition-colors`}
                  onClick={closeMenu}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/products" 
                  className={`${isActive('/products')} block py-2 transition-colors`}
                  onClick={closeMenu}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className={`${isActive('/about')} block py-2 transition-colors`}
                  onClick={closeMenu}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className={`${isActive('/contact')} block py-2 transition-colors`}
                  onClick={closeMenu}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
