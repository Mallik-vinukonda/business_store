import React from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

const CONTACT_NUMBER = '+91 98765 43210'; // Update with your real contact number
const EMAIL = 'info@ramdootdryfruits.com'; // Update with your real email
const ADDRESS = 'Sri Ramdoot Dryfruit Store, Dwaraka Nagar, Visakhapatnam, Andhra Pradesh';

const ContactPage: React.FC = () => {
  return (
    <Layout>
      <div className="container-custom py-12 min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-6 text-primary">Contact Us</h1>
        <div className="grid md:grid-cols-2 gap-10">
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaPhoneAlt className="mr-2 text-primary" /> Phone
              </h2>
              <p className="text-lg">{CONTACT_NUMBER}</p>
              <p className="text-sm text-gray-500 mt-2">For order cancellations, please call this number.</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaEnvelope className="mr-2 text-primary" /> Email
              </h2>
              <p className="text-lg">{EMAIL}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2 flex items-center">
                <FaMapMarkerAlt className="mr-2 text-primary" /> Address
              </h2>
              <p className="text-lg">{ADDRESS}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 flex flex-col justify-center items-center">
            <h3 className="text-lg font-semibold mb-4">We're here to help!</h3>
            <p className="mb-6 text-gray-600 text-center">
              For any queries, feedback, or to cancel an order, feel free to reach out to us via phone or email. Our team will respond as soon as possible.
            </p>
            <div className="w-full mb-3 py-3 px-6 rounded-lg bg-primary text-white font-semibold text-center">
              Call Now: {CONTACT_NUMBER}
            </div>
            <div className="w-full py-3 px-6 rounded-lg border border-primary text-primary font-semibold text-center">
              Email Us: {EMAIL}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
