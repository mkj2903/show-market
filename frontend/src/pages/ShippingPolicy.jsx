// frontend/src/pages/ShippingPolicy.jsx - UPDATED COLOR SCHEME
import React from 'react';
import { 
  Truck, Package, Clock, MapPin, Shield, RefreshCw,
  CheckCircle, AlertCircle, Info, DollarSign, Star,
  Navigation, ShieldCheck, Headphones, Calendar
} from 'lucide-react';

const ShippingPolicy = () => {
  const shippingInfo = [
    {
      icon: <Truck className="w-6 h-6" />,
      title: 'Shipping Charges',
      description: 'Free shipping on all orders above ₹199. For orders below ₹199, a nominal shipping charge of ₹9 applies.',
      highlight: true
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Delivery Time',
      description: '3-7 business days across India. Some products may take longer depending on supplier location.'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Delivery Areas',
      description: 'We deliver across India including remote areas. International shipping available on request.'
    },
    {
      icon: <Package className="w-6 h-6" />,
      title: 'Order Tracking',
      description: 'You will receive tracking information via email/SMS once your order is shipped.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: 'Safe Delivery',
      description: 'All packages are securely packed and insured against damage during transit.'
    },
    {
      icon: <Headphones className="w-6 h-6" />,
      title: 'Delivery Issues',
      description: 'Contact us within 24 hours if you face any delivery issues for immediate assistance.'
    }
  ];

  const faqItems = [
    {
      question: 'Why does shipping take 3-7 days?',
      answer: 'We work on a dropshipping model. Once you order, we process it with our suppliers who then ship directly to you. This eliminates warehouse costs but adds a few extra days for processing.'
    },
    {
      question: 'Can I track my order?',
      answer: 'Yes! Once your order is shipped, you\'ll receive tracking details via email and SMS. You can also track it from your "My Orders" page.'
    },
    {
      question: 'What if my order is delayed?',
      answer: 'Contact us immediately. We\'ll check with the supplier and keep you updated. In case of unreasonable delays, we offer full refunds.'
    },
    {
      question: 'Do you ship to remote locations?',
      answer: 'Yes, we ship across India including remote areas. Additional delivery time may apply for certain locations.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section - Modern Blue Theme */}
      <div className="bg-gradient-to-br from-blue-800 via-blue-700 to-indigo-800 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header with Icon */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                  <Truck className="w-10 h-10" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center">
                  <Navigation className="w-5 h-5" />
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-center mb-3">
                Shipping & Delivery Policy
              </h1>
              <p className="text-lg text-blue-100 text-center max-w-2xl">
                Transparent, reliable, and affordable shipping for every order
              </p>
            </div>
            
            {/* Shipping Charges Banner - Modern Design */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8 border border-white/20">
              <h3 className="text-xl font-bold mb-6 text-center">Shipping Charges Breakdown</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 p-6 rounded-xl text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">₹199+</div>
                  <div className="text-lg font-semibold mb-2 text-green-300">FREE SHIPPING</div>
                  <p className="text-sm text-blue-100">On all orders above ₹199</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-white/20 p-6 rounded-xl text-center backdrop-blur-sm">
                  <div className="flex items-center justify-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold mb-2">Below ₹199</div>
                  <div className="text-lg font-semibold mb-2 text-amber-300">ONLY ₹9</div>
                  <p className="text-sm text-blue-100">Flat shipping charge</p>
                </div>
              </div>
              
              {/* Additional Info */}
              <div className="mt-6 pt-6 border-t border-white/20 text-center">
                <p className="text-blue-100 text-sm">
                  <CheckCircle className="w-4 h-4 inline mr-2" />
                  Tracking provided for all orders
                  <span className="mx-3">•</span>
                  <Shield className="w-4 h-4 inline mr-2" />
                  Insured delivery
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          {/* Shipping Information Grid */}
          <div className="mb-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-900">
                Shipping Information
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about our shipping process
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shippingInfo.map((item, index) => (
                <div 
                  key={index} 
                  className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border border-gray-100 ${
                    item.highlight ? 'border-blue-200 ring-1 ring-blue-100' : ''
                  }`}
                >
                  <div className="flex items-start mb-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 ${
                      item.highlight 
                        ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                        : 'bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600'
                    }`}>
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Delivery Timeline
            </h2>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-400 to-cyan-400"></div>
              
              <div className="space-y-8 md:space-y-12 relative">
                {[
                  { 
                    step: 'Order Placed', 
                    time: 'Day 1', 
                    desc: 'We receive your order and begin processing',
                    icon: <CheckCircle className="w-5 h-5" />
                  },
                  { 
                    step: 'Order Processing', 
                    time: '1 Days', 
                    desc: 'Verification and supplier coordination',
                    icon: <RefreshCw className="w-5 h-5" />
                  },
                  { 
                    step: 'Supplier Dispatch', 
                    time: '2-3 Days', 
                    desc: 'Supplier ships with tracking number',
                    icon: <Package className="w-5 h-5" />
                  },
                  { 
                    step: 'In Transit', 
                    time: '3-4 Days', 
                    desc: 'Product on the way to your address',
                    icon: <Truck className="w-5 h-5" />
                  },
                  { 
                    step: 'Delivery', 
                    time: '4-7 Days', 
                    desc: 'Product delivered to your doorstep',
                    icon: <MapPin className="w-5 h-5" />
                  }
                ].map((item, index) => (
                  <div key={index} className="relative">
                    {/* Mobile Timeline Dot */}
                    <div className="md:hidden absolute left-4 top-6 transform -translate-y-1/2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center">
                        {item.icon}
                      </div>
                    </div>
                    
                    <div className={`ml-12 md:ml-0 md:flex items-center ${
                      index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}>
                      {/* Desktop Timeline Dot */}
                      <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 z-10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 border-4 border-white flex items-center justify-center shadow-lg">
                          {item.icon}
                        </div>
                      </div>
                      
                      <div className={`md:w-5/12 ${
                        index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'
                      }`}>
                        <div className="bg-gradient-to-br from-gray-50 to-white p-5 rounded-xl border border-gray-100 shadow-sm">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold text-gray-900">{item.step}</h3>
                            <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 rounded-full text-sm font-semibold">
                              {item.time}
                            </span>
                          </div>
                          <p className="text-gray-600">{item.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-6">
              {faqItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-600 rounded-lg flex items-center justify-center mr-4 mt-1">
                      <Info className="w-5 h-5" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{item.question}</h3>
                      <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{item.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 md:p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <AlertCircle className="w-6 h-6 mr-3 text-blue-600" />
              Important Notes
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-bold text-blue-800 mb-4">Key Points to Remember</h4>
                <ul className="space-y-4">
                  {[
                    'Shipping time is calculated in business days (Monday-Friday)',
                    'Delivery dates are estimates and not guaranteed',
                    'Please ensure your delivery address is correct during checkout',
                    'For urgent deliveries, contact us before ordering',
                    'Signature may be required for high-value orders',
                    'Customs duties may apply for international shipments'
                  ].map((note, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-800">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                  <Headphones className="w-5 h-5 mr-2 text-blue-600" />
                  Need Help with Shipping?
                </h4>
                <p className="text-gray-600 mb-6">
                  Our shipping support team is here to help with any delivery-related questions or issues.
                </p>
                
                <div className="space-y-4">
                  <a 
                    href="https://wa.me/7015030324"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    <Truck className="w-5 h-5 mr-3" />
                    WhatsApp Shipping Support
                  </a>
                  
                  <div className="text-center text-sm text-gray-500 mt-4">
                    <p>Available: Monday - Saturday</p>
                    <p>Timing: 10:00 AM - 7:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPolicy;