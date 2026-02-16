import React from 'react';
import { 
  MessageCircle, Mail, Phone, MapPin, Clock, 
  Facebook, Instagram, Twitter, Youtube, 
  Package, Users, ShoppingBag, Truck,
  MessageSquare, Headphones, Zap, Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ContactUs = () => {
  const contactMethods = [
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'WhatsApp Support',
      description: '24/7 Instant Support',
      details: '',
      action: 'https://wa.me/7015030324?text=Hello%20TV%20Merch%20Support%2C%20I%20need%20help%20with%3A',
      color: 'from-green-500 to-emerald-600',
      buttonText: 'Chat on WhatsApp',
      features: [
        'Instant response',
        'Order tracking help',
        'Payment assistance',
        'Return & refund queries'
      ]
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Email Support',
      description: 'Professional Assistance',
      details: 'support@tvmerch.com',
      action: 'mailto:support@tvmerch.com',
      color: 'from-blue-500 to-blue-600',
      buttonText: 'Send Email',
      features: [
        'Response within 24 hours',
        'Order modifications',
        'Bulk order inquiries',
        'Business partnerships'
      ]
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Business Inquiries',
      description: 'Partnerships & Wholesale',
      details: 'business@tvmerch.com',
      action: 'mailto:business@tvmerch.com',
      color: 'from-purple-500 to-purple-600',
      buttonText: 'Contact Business Team',
      features: [
        'Supplier partnerships',
        'Bulk orders',
        'Affiliate program',
        'Marketing collaborations'
      ]
    }
  ];

  const commonIssues = [
    {
      icon: <Package className="w-5 h-5" />,
      title: 'Order Tracking',
      solution: 'Visit Track Order page',
      link: '/track-order'
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Shipping Questions',
      solution: 'Check Shipping Policy',
      link: '/shipping-policy'
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: 'Common Questions',
      solution: 'Browse FAQ section',
      link: '/faq'
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'Returns & Refunds',
      solution: 'View Return Policy',
      link: '/returns'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mb-8">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Contact <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ShowmoMarket</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're here to help! Choose your preferred way to connect with our support team
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://wa.me/7015030324"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Support
              </a>
              <a 
                href="mailto:support@tvmerch.com"
                className="px-8 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Direct Support
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get Help Quickly
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose the support option that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-white rounded-2xl shadow-xl p-8 h-full hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
                  <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-xl flex items-center justify-center mb-6`}>
                    <div className="text-white">
                      {method.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4">{method.description}</p>
                  
                  <div className="mb-6">
                    <p className="text-lg font-semibold text-gray-800">{method.details}</p>
                  </div>
                  
                  <div className="space-y-2 mb-8">
                    {method.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center">
                        <Zap className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <a
                    href={method.action}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block w-full py-3 text-white rounded-lg font-semibold text-center bg-gradient-to-r ${method.color} hover:opacity-90 transition-all duration-300 transform hover:scale-105`}
                  >
                    {method.buttonText}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Solutions */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Solutions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find instant answers to common questions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {commonIssues.map((issue, index) => (
              <Link
                key={index}
                to={issue.link}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                  <div className="text-blue-600">
                    {issue.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{issue.title}</h3>
                <p className="text-blue-600 font-medium">{issue.solution}</p>
              </Link>
            ))}
          </div>
          
          <div className="text-center">
            <Link 
              to="/faq"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
            >
              View All FAQ
              <MessageSquare className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Business Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Clock className="w-8 h-8 text-orange-600 mr-4" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">Business Hours</h3>
                  <p className="text-gray-600">When we're available</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold text-gray-800">10:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold text-gray-800">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sunday</span>
                  <span className="font-semibold text-gray-800">Closed</span>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> WhatsApp support is available 24/7 for urgent order issues
                </p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Connect With Us</h3>
              <p className="text-gray-300 mb-6">
                Follow us for updates, new arrivals, and exclusive offers
              </p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <a href="#" className="bg-gray-700 hover:bg-blue-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <Facebook className="w-6 h-6 mb-2" />
                  <span className="text-sm">Facebook</span>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-pink-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <Instagram className="w-6 h-6 mb-2" />
                  <span className="text-sm">Instagram</span>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-blue-400 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <Twitter className="w-6 h-6 mb-2" />
                  <span className="text-sm">Twitter</span>
                </a>
                <a href="#" className="bg-gray-700 hover:bg-red-600 rounded-xl p-4 flex flex-col items-center justify-center transition-colors">
                  <Youtube className="w-6 h-6 mb-2" />
                  <span className="text-sm">YouTube</span>
                </a>
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Response Time</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">WhatsApp Support</p>
                    <p className="text-sm opacity-90">Instant - 30 minutes</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Email Support</p>
                    <p className="text-sm opacity-90">1 - 24 hours</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-400 rounded-full mr-3"></div>
                  <div>
                    <p className="font-semibold">Business Inquiries</p>
                    <p className="text-sm opacity-90">24 - 48 hours</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-sm opacity-90">
                  <strong>Emergency:</strong> For urgent order issues, use WhatsApp for fastest response
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      
    </div>
  );
};

export default ContactUs;