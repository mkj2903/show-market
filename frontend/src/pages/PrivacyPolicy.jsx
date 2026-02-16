import React from 'react';
import { 
  Shield, Lock, Eye, Database, UserCheck, FileText,
  AlertTriangle, Bell, Globe, CheckCircle, XCircle,
  Mail, Phone, Calendar
} from 'lucide-react';

const PrivacyPolicy = () => {
  const lastUpdated = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const sections = [
    {
      icon: <Database className="w-6 h-6" />,
      title: 'Information We Collect',
      color: 'bg-blue-100 text-blue-600',
      points: [
        'Personal information (name, email, phone number)',
        'Shipping and billing addresses',
        'Order history and preferences',
        'Payment details (we only store transaction IDs, not UPI/bank details)',
        'Device and browser information for analytics'
      ]
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'How We Use Your Information',
      color: 'bg-green-100 text-green-600',
      points: [
        'Process and fulfill your orders',
        'Communicate order status and updates',
        'Improve our products and services',
        'Send promotional offers (only with consent)',
        'Prevent fraud and ensure security'
      ]
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Data Security',
      color: 'bg-purple-100 text-purple-600',
      points: [
        'SSL encryption for all data transmission',
        'Regular security audits and updates',
        'Limited employee access to personal data',
        'Secure payment processing partners',
        'Regular data backup and protection'
      ]
    },
    {
      icon: <UserCheck className="w-6 h-6" />,
      title: 'Your Rights',
      color: 'bg-orange-100 text-orange-600',
      points: [
        'Access your personal data',
        'Correct inaccurate information',
        'Request data deletion',
        'Opt-out of marketing communications',
        'Download your data in readable format'
      ]
    },
    {
      icon: <Eye className="w-6 h-6" />,
      title: 'Third-Party Sharing',
      color: 'bg-pink-100 text-pink-600',
      points: [
        'Shipping partners (for delivery only)',
        'Payment processors (for transaction handling)',
        'Suppliers (for order fulfillment)',
        'Analytics services (anonymous data only)',
        'Legal authorities (when required by law)'
      ]
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Cookies & Tracking',
      color: 'bg-indigo-100 text-indigo-600',
      points: [
        'Essential cookies for website functionality',
        'Analytics cookies to improve user experience',
        'Marketing cookies (only with consent)',
        'Option to disable cookies in browser settings',
        'No cross-site tracking or data selling'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center mb-6">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-6">
                <Shield className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">Privacy Policy</h1>
                <div className="flex items-center mt-2 text-gray-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <p>Last Updated: {lastUpdated}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-8">
              <p className="text-lg">
                We are committed to protecting your privacy. This policy explains how we collect, 
                use, and safeguard your information when you use our services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          {/* Policy Sections */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {sections.map((section, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${section.color}`}>
                    {section.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                </div>
                <ul className="space-y-2">
                  {section.points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-600">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Detailed Policy Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Detailed Policy Information</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                  <Database className="w-5 h-5 mr-3 text-blue-500" />
                  Data Retention
                </h3>
                <p className="text-gray-600">
                  We retain your personal data only for as long as necessary to fulfill the purposes 
                  for which it was collected, including for the purposes of satisfying any legal, 
                  accounting, or reporting requirements. Typically, order data is retained for 5 years 
                  for tax and warranty purposes.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-3 text-orange-500" />
                  Children's Privacy
                </h3>
                <p className="text-gray-600">
                  Our services are not intended for individuals under the age of 16. We do not 
                  knowingly collect personal information from children. If you are a parent or guardian 
                  and believe your child has provided us with personal information, please contact us.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                  <Globe className="w-5 h-5 mr-3 text-green-500" />
                  International Transfers
                </h3>
                <p className="text-gray-600">
                  Your information may be transferred to and processed in countries other than India, 
                  where our suppliers are located. We ensure appropriate safeguards are in place to 
                  protect your data in accordance with this privacy policy.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-3 text-purple-500" />
                  Policy Updates
                </h3>
                <p className="text-gray-600">
                  We may update this privacy policy from time to time. We will notify you of any 
                  changes by posting the new policy on this page and updating the "Last Updated" date. 
                  You are advised to review this policy periodically for any changes.
                </p>
              </div>
            </div>
          </div>

          {/* Contact for Privacy */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center">
              <Shield className="w-6 h-6 mr-3" />
              Contact Us About Privacy
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-blue-800 mb-6">
                  If you have any questions about this Privacy Policy or wish to exercise your rights, 
                  please contact our Data Protection Officer:
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Mail className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-700">Email</p>
                      <a 
                        href="mailto:privacy@tvmerch.com" 
                        className="font-medium text-blue-900 hover:text-blue-700"
                      >
                        privacy@tvmerch.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Phone className="w-5 h-5 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm text-blue-700">WhatsApp</p>
                      <a 
                        href="https://wa.me/7015030324" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-blue-900 hover:text-blue-700"
                      >
                        +91 7015030324
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6">
                <h4 className="font-bold text-gray-900 mb-4">Your Privacy Matters</h4>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">We never sell your personal data</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Transparent data practices</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Industry-standard security</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    <span className="text-sm text-gray-600">Quick response to privacy requests</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Response Time:</strong> We aim to respond to all privacy-related inquiries within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;