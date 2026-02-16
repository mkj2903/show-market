import React, { useState } from 'react';
import { 
  HelpCircle, ShoppingBag, CreditCard, Package, 
  RefreshCw, User, MessageCircle, ChevronDown, 
  ChevronUp, Search, Shield, Truck, Star, 
  CheckCircle, AlertCircle, Mail, Phone
} from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const faqCategories = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: 'Ordering & Account',
      color: 'bg-blue-100 text-blue-600',
      faqs: [
        {
          q: 'How do I place an order?',
          a: 'Browse products, select size/quantity, add to cart, and proceed to checkout. You can pay via UPI for faster processing.'
        },
        {
          q: 'Can I modify or cancel my order?',
          a: 'Orders can be modified/cancelled within 1 hour of placement. Contact us immediately via WhatsApp for assistance.'
        },
        {
          q: 'How do I create an account?',
          a: 'Click "Login" and use Google Sign-In. No password needed - just use your Google account.'
        }
      ]
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: 'Payments',
      color: 'bg-green-100 text-green-600',
      faqs: [
        {
          q: 'What payment methods do you accept?',
          a: 'We accept UPI payments only (Google Pay, PhonePe, Paytm, etc.). Enter your 12-digit UTR after payment.'
        },
        {
          q: 'Is my payment information secure?',
          a: 'Yes! We use secure payment processing. We never store your UPI or bank details.'
        },
        {
          q: 'How do I know my payment was successful?',
          a: 'You will receive an order confirmation email. Admin will verify your UTR and update order status.'
        }
      ]
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: 'Shipping & Delivery',
      color: 'bg-purple-100 text-purple-600',
      faqs: [
        {
          q: 'What are your shipping charges?',
          a: 'Free shipping on orders above ₹199. For orders below ₹199, shipping charge is only ₹9.'
        },
        {
          q: 'How long does delivery take?',
          a: 'Typically 3-7 business days. Some products may take longer as we ship directly from suppliers.'
        },
        {
          q: 'Can I track my order?',
          a: 'Yes! Tracking information will be sent via email/SMS once your order is shipped.'
        }
      ]
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Returns & Refunds',
      color: 'bg-orange-100 text-orange-600',
      faqs: [
        {
          q: 'What is your return policy?',
          a: 'We accept returns within 7 days of delivery if product is damaged, defective, or incorrect.'
        },
        {
          q: 'How long do refunds take?',
          a: 'Refunds are processed within 1-2 business days after we receive the returned item.'
        },
        {
          q: 'Who pays for return shipping?',
          a: 'We cover return shipping costs for damaged/defective items. For other returns, customer pays shipping.'
        }
      ]
    },
    {
      icon: <User className="w-5 h-5" />,
      title: 'Account & Support',
      color: 'bg-pink-100 text-pink-600',
      faqs: [
        {
          q: 'How can I contact customer support?',
          a: 'Click "Contact Us" page for WhatsApp support. We respond within 1 hour during business hours.'
        },
        {
          q: 'What are your support hours?',
          a: 'We\'re available 10 AM - 8 PM, Monday to Saturday. WhatsApp support is 24/7 for urgent issues.'
        },
        {
          q: 'Do you offer wholesale/bulk orders?',
          a: 'Yes! Contact us via WhatsApp for bulk orders and special discounts.'
        }
      ]
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: 'General Questions',
      color: 'bg-indigo-100 text-indigo-600',
      faqs: [
        {
          q: 'What is your dropshipping model?',
          a: 'We connect you directly with suppliers. When you order, we forward it to suppliers who ship to you directly.'
        },
        {
          q: 'Are products authentic?',
          a: 'Yes! All products are sourced from authorized suppliers and undergo quality checks.'
        },
        {
          q: 'Do you offer international shipping?',
          a: 'Currently we ship within India only. Contact us for international shipping inquiries.'
        }
      ]
    }
  ];

  // Filter FAQs based on search query
  const filteredCategories = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6 backdrop-blur-sm">
            <HelpCircle className="w-10 h-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Find quick answers to common questions about ordering, shipping, payments, and more
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 -mt-8">
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-xl shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {searchQuery && (
            <div className="mb-8 text-center">
              <p className="text-gray-600">
                Found {filteredCategories.reduce((sum, cat) => sum + cat.faqs.length, 0)} results for "{searchQuery}"
              </p>
            </div>
          )}

          {/* Quick Help Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">WhatsApp Support</h3>
                  <p className="text-sm text-gray-600">24/7 quick help</p>
                </div>
              </div>
              <a 
                href="https://wa.me/701503024"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
              >
                Chat Now
              </a>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Mail className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Email Support</h3>
                  <p className="text-sm text-gray-600">Within 24 hours</p>
                </div>
              </div>
              <a 
                href="mailto:support@tvmerch.com"
                className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg font-semibold hover:bg-purple-600 transition-colors"
              >
                Email Us
              </a>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Phone className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Track Order</h3>
                  <p className="text-sm text-gray-600">Check order status</p>
                </div>
              </div>
              <a 
                href="/track-order"
                className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors"
              >
                Track Now
              </a>
            </div>
          </div>

          {/* FAQ Categories */}
          {filteredCategories.map((category, catIndex) => (
            <div key={catIndex} className="mb-12">
              <div className="flex items-center mb-6">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${category.color}`}>
                  {category.icon}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.title}</h2>
              </div>

              <div className="space-y-4">
                {category.faqs.map((faq, faqIndex) => {
                  const index = `${catIndex}-${faqIndex}`;
                  const isOpen = openIndex === index;
                  
                  return (
                    <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 w-6 h-6 mt-1 mr-4">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isOpen ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                              {isOpen ? (
                                <ChevronUp className="w-3 h-3 text-indigo-600" />
                              ) : (
                                <ChevronDown className="w-3 h-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                          <span className="text-lg font-semibold text-gray-900">{faq.q}</span>
                        </div>
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-6 ml-10">
                          <div className="flex">
                            <div className="flex-shrink-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-4"></div>
                            <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Contact Section */}
          <div className="mt-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl p-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
              <p className="text-lg opacity-90 mb-8">
                Can't find what you're looking for? Our team is ready to help you!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://wa.me/7015030324"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  WhatsApp Support
                </a>
                <a
                  href="mailto:support@tvmerch.com"
                  className="inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Email Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;