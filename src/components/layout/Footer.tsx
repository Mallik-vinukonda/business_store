import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaFacebook, FaInstagram, FaWhatsapp, FaHome, FaShoppingCart, FaInfoCircle, FaQuestionCircle, FaLock, FaFileAlt } from 'react-icons/fa';

const footerLinks = [
  { to: '/', label: 'Home', icon: <FaHome /> },
  { to: '/products', label: 'Products', icon: <FaShoppingCart /> },
  { to: '/about', label: 'About Us', icon: <FaInfoCircle /> },
  { to: '/contact', label: 'Contact', icon: <FaPhone /> },
  { to: '/faq', label: 'FAQ', icon: <FaQuestionCircle /> },
  { to: '/privacy-policy', label: 'Privacy', icon: <FaLock /> },
  { to: '/terms', label: 'Terms', icon: <FaFileAlt /> },
];

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 pt-12 pb-6 border-t border-gray-200 shadow-sm">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Store Info */}
          <div>
            <h3 className="text-2xl font-display font-bold mb-4 tracking-tight text-primary">Sri Ramdoot Dryfruit Store</h3>
            <p className="mb-4 text-gray-600">Premium quality dry fruits in Vizag since 2005.</p>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-secondary mt-1 mr-3" />
                <span>123 Main Street, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh 530016</span>
              </li>
              <li className="flex items-center">
                <FaPhone className="text-secondary mr-3" />
                <a href="tel:+919876543210" className="hover:text-secondary transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-secondary mr-3" />
                <a href="mailto:info@sriramdoot.com" className="hover:text-secondary transition-colors">info@sriramdoot.com</a>
              </li>
            </ul>
          </div>

          {/* Quick Links with Icons */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-700 text-sm">
              {footerLinks.map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="flex items-center gap-2 text-gray-700 hover:text-green-700 transition-colors">
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Business Hours */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">Business Hours</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex justify-between"><span>Mon - Fri:</span><span>9:00 AM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Saturday:</span><span>9:00 AM - 7:00 PM</span></li>
              <li className="flex justify-between"><span>Sunday:</span><span>10:00 AM - 6:00 PM</span></li>
            </ul>
          </div>

          {/* Social & Delivery */}
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="text-xl font-display font-semibold mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors"><FaFacebook size={24} /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 text-pink-500 transition-colors"><FaInstagram size={24} /></a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer" className="hover:text-green-500 text-green-500 transition-colors"><FaWhatsapp size={24} /></a>
              </div>
            </div>
            <div className="bg-white text-primary p-4 rounded-lg text-center border border-gray-200">
              <h4 className="font-display font-semibold">FREE DELIVERY IN VIZAG CITY!</h4>
              <p className="text-sm">On all orders above ₹500</p>
            </div>
          </div>
        </div>
        <div className="text-center pt-6 border-t border-gray-200 text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Sri Ramdoot Dryfruit Store. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
