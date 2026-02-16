import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, Instagram, Twitter, Mail, Phone, MapPin, 
  Shield, Truck, HelpCircle, Info, MessageCircle, 
  Package, Users, CreditCard, Heart, Star, Globe,
  ArrowRight, CheckCircle, Gift, Clock, ChevronUp
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop By Category',
      links: [
        { name: 'All Products', path: '/products', featured: true },
        { name: "Men's T-Shirts", path: '/products?category=T-Shirts&gender=men' },
        { name: "Women's T-Shirts", path: '/products?category=T-Shirts&gender=women' },
        { name: 'Premium Mugs', path: '/products?category=Mugs' },
        { name: 'TV Show Accessories', path: '/products?category=Accessories' },
        { name: 'Featured Products', path: '/products?featured=true', featured: true },
       
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { name: 'My Orders', path: '/my-orders', icon: <Package className="w-4 h-4 mr-2" /> },
        { name: 'Track Order', path: '/track-order', icon: <Truck className="w-4 h-4 mr-2" /> },
        { name: 'Shipping Policy', path: '/shipping-policy', icon: <Truck className="w-4 h-4 mr-2" /> },
        { name: 'FAQ & Help Center', path: '/faq', icon: <HelpCircle className="w-4 h-4 mr-2" /> },
        { name: 'Contact Us', path: '/contact', icon: <MessageCircle className="w-4 h-4 mr-2" /> },
      ]
    },
    {
      title: 'Company & Legal',
      links: [
        { name: 'About Us', path: '/about', icon: <Info className="w-4 h-4 mr-2" /> },
        { name: 'Privacy Policy', path: '/privacy-policy', icon: <Shield className="w-4 h-4 mr-2" /> },
        { name: 'Dropshipping Model', path: '/dropshipping' },
        { name: 'Careers', path: '/careers' },
      ]
    }
  ];

  const trustBadges = [
    { icon: <Shield className="w-8 h-8" />, title: 'Secure Payment', desc: 'UPI Only', color: 'text-green-400' },
    { icon: <Truck className="w-8 h-8" />, title: 'Free Shipping', desc: 'On ₹199+', color: 'text-blue-400' },
    { icon: <Clock className="w-8 h-8" />, title: '24/7 Support', desc: 'WhatsApp Chat', color: 'text-purple-400' },
    { icon: <Package className="w-8 h-8" />, title: 'Easy Processing', desc: 'Within 7 Days', color: 'text-orange-400' },
    { icon: <Gift className="w-8 h-8" />, title: 'Gift Ready', desc: 'Free Gift Wrap', color: 'text-pink-400' },
  ];

  const upiApps = ['Google Pay', 'PhonePe', 'Paytm', 'Amazon Pay', 'BHIM UPI'];

  // Function to handle link clicks - scrolls to top
  const handleLinkClick = (e) => {
    // Only scroll if we're navigating within the same app (not external links)
    const isExternal = e.target.href.includes('http') || e.target.href.includes('mailto') || e.target.href.includes('tel');
    
    if (!isExternal) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  // Function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-gray-950 text-white mt-auto">
      {/* Trust Badges Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {trustBadges.map((badge, index) => (
              <div key={index} className="flex flex-col items-center p-3">
                <div className={`mb-2 ${badge.color}`}>
                  {badge.icon}
                </div>
                <p className="text-sm font-semibold text-center">{badge.title}</p>
                <p className="text-xs text-gray-400 text-center">{badge.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Column - Newsletter removed as requested */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">TV</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  ShowmoMarket
                </h2>
                <p className="text-sm text-gray-400">Official Fan Store</p>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Your premier destination for exclusive TV show merchandise. 
              We connect you directly with global suppliers through our 
              unique dropshipping model.
            </p>

            {/* Social Media */}
            <div>
              <p className="text-sm font-semibold mb-3 text-gray-300">Follow Us</p>
              <div className="flex space-x-3">
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:-translate-y-1"
                  aria-label="YouTube"
                >
                  <YoutubeIcon className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Other Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-lg font-bold mb-5 text-white flex items-center">
                {section.title}
                <span className="ml-2 w-6 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></span>
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      onClick={handleLinkClick}
                      className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center group text-sm"
                    >
                      {link.icon && (
                        <span className="mr-2 opacity-70 group-hover:opacity-100">
                          {link.icon}
                        </span>
                      )}
                      {link.name}
                      {link.featured && (
                        <span className="ml-2 px-2 py-0.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs rounded-full">
                          Hot
                        </span>
                      )}
                      <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Payment & Shipping Info */}
          <div>
            <h3 className="text-lg font-bold mb-5 text-white flex items-center">
              Payment & Shipping
              <span className="ml-2 w-6 h-0.5 bg-gradient-to-r from-green-500 to-blue-500"></span>
            </h3>
            
            <div className="space-y-5">
              {/* UPI Payments */}
              <div>
                <div className="flex items-center mb-3">
                  <CreditCard className="w-5 h-5 text-green-400 mr-2" />
                  <p className="text-sm font-semibold">UPI Payments Only</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {upiApps.map((app, index) => (
                    <div key={index} className="px-3 py-1 bg-gray-800 rounded-full text-xs">
                      {app}
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Charges */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700">
                <div className="flex items-center mb-2">
                  <Truck className="w-5 h-5 text-blue-400 mr-2" />
                  <p className="text-sm font-semibold">Shipping Charges</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Orders above ₹199</span>
                    <span className="px-3 py-1 bg-green-900/30 text-green-400 text-xs rounded-full font-semibold">
                      FREE
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Orders below ₹199</span>
                    <span className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs rounded-full font-semibold">
                      ₹9 ONLY
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Time */}
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-purple-400 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold mb-1">Delivery Time</p>
                  <p className="text-xs text-gray-400">3-7 business days across India</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact & Info Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-900/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">24/7 WhatsApp Support</p>
                  <a 
                    href="https://wa.me/701503024"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-green-400 transition-colors font-medium"
                  >
                    Click to chat instantly
                  </a>
                  <p className="text-xs text-gray-500 mt-1"></p>
                </div>
              </div>
            </div>

            {/* Email Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-900/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Mail className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Email Support</p>
                  <a 
                    href="mailto:support@tvmerch.com" 
                    className="text-white hover:text-purple-400 transition-colors font-medium"
                  >
                    support@tvmerch.com
                  </a>
                  <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                </div>
              </div>
            </div>

            {/* Business Info */}
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-900/20 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Clock className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold mb-1">Business Hours</p>
                  <div className="text-sm text-gray-400">
                    <p>Mon-Fri: 10:00 AM - 8:00 PM</p>
                    <p>Saturday: 10:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="bg-black py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <p className="text-gray-400 text-sm">
                © {currentYear} <span className="font-semibold"> ShowmoMarket</span>. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Made with <Heart className="w-3 h-3 inline text-red-500" /> for TV fans
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link 
                to="/privacy-policy" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-600">•</span>
              
              <Link 
                to="/shipping-policy" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Shipping Policy
              </Link>
              <span className="text-gray-600">•</span>
              <Link 
                to="/contact" 
                onClick={handleLinkClick}
                className="text-gray-400 hover:text-white transition-colors"
              >
                Contact
              </Link>
            </div>

            <div className="mt-4 md:mt-0 flex items-center">
              <Globe className="w-4 h-4 text-gray-400 mr-2" />
              <span className="text-gray-400 text-sm">India • Dropshipping Excellence</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 z-50"
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-5 h-5" />
      </button>
    </footer>
  );
};

// YouTube Icon component
const YoutubeIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

export default Footer;