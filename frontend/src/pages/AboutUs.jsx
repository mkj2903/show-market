import React from 'react';
import { 
  Package, Globe, Truck, Shield, Users, Zap, 
  CheckCircle, Star, TrendingUp, Target, Heart 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const features = [
    {
      icon: <Package className="w-8 h-8" />,
      title: 'Curated Collection',
      description: 'Handpicked TV merchandise from trusted global suppliers'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'Global Network',
      description: 'Direct partnerships with manufacturers worldwide'
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: 'Direct Shipping',
      description: 'Products ship straight from supplier to your doorstep'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Quality Assurance',
      description: 'Every product undergoes quality verification'
    }
  ];

  const processSteps = [
    {
      number: '01',
      title: 'You Browse & Order',
      description: 'Select from our collection and place order on our website',
      icon: '🛒'
    },
    {
      number: '02',
      title: 'We Process',
      description: 'We forward your order to our trusted supplier network',
      icon: '⚡'
    },
    {
      number: '03',
      title: 'Supplier Ships',
      description: 'Supplier ships directly to your address with tracking',
      icon: '📦'
    },
    {
      number: '04',
      title: 'You Receive',
      description: 'Get genuine products at amazing prices, hassle-free',
      icon: '🎁'
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
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ShowmoMarket</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              We're not just another store. We're your personal bridge to exclusive TV merchandise from around the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                Shop Now
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold mb-4">
              Our Unique Model
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Our Dropshipping Works
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We connect you directly with suppliers, eliminating warehouse costs and passing the savings to you
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-2xl shadow-lg p-8 h-full hover:shadow-xl transition-shadow duration-300">
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl flex items-center justify-center text-xl font-bold">
                    {step.number}
                  </div>
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  Why Choose Our Dropshipping Model?
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                      <Zap className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Lower Prices</h4>
                      <p className="text-gray-600">
                        No warehouse costs = Better prices for you. We eliminate middlemen to save you money.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                      <TrendingUp className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Wider Selection</h4>
                      <p className="text-gray-600">
                        Access to global inventory without physical stock. More variety, less commitment.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                      <Target className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-1">Direct Shipping</h4>
                      <p className="text-gray-600">
                        Products ship directly from supplier to you. Faster delivery, fewer touchpoints.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h4 className="text-xl font-bold text-gray-900 mb-4">Our Promise</h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>We handle customer service & quality checks</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Secure payment processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>Order tracking & support</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>7-day return policy*</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span>24/7 WhatsApp support</span>
                  </div>
                </div>
                <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-blue-700 text-sm">
                    <strong>Note:</strong> While we don't physically stock products, we manage the entire process from supplier coordination to customer satisfaction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We combine technology with human touch to deliver exceptional service
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center mb-6">
                  <div className="text-blue-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <div className="relative container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Star className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Experience Smart Shopping?
            </h2>
            <p className="text-xl opacity-90 mb-8">
              Join thousands of satisfied customers enjoying our unique dropshipping model
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Start Shopping Now
              </Link>
              <Link 
                to="/contact"
                className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Have Questions?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;