import React from 'react';
import Layout from '../components/layout/Layout';
import { FaMapMarkerAlt, FaSmile, FaLeaf, FaTruck } from 'react-icons/fa';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-primary">About Us</h1>
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <p className="text-lg mb-4 flex items-center">
            <FaMapMarkerAlt className="text-primary mr-2" />
            <span>
              We are located at <strong>Sri Ramdoot Dryfruit Store, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh</strong>.
            </span>
          </p>
          <p className="text-lg mb-4 flex items-center">
            <FaSmile className="text-yellow-500 mr-2" />
            <span>
              We have proudly served <strong>500+ happy customers</strong> over the years.
            </span>
          </p>
          <p className="text-lg mb-4 flex items-center">
            <FaLeaf className="text-green-600 mr-2" />
            <span>
              We supply <strong>premium quality dry fruits</strong> sourced from the best farms and producers.
            </span>
          </p>
          <p className="text-lg flex items-center">
            <FaTruck className="text-primary mr-2" />
            <span>
              Enjoy <strong>free delivery</strong> on all orders within Vizag city—no delivery charges!
            </span>
          </p>
        </div>
        <div className="text-center text-gray-600 text-base">
          Thank you for choosing Sri Ramdoot Dryfruit Store. Your satisfaction and health are our top priorities!
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
