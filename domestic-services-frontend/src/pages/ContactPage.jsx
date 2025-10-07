import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';

const faqs = [
  {
    question: 'How do I request a refund?',
    answer: 'To request a refund, please contact our support team using the form below. Refunds are processed within 5-7 business days after approval.',
    icon: '💰'
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can use the contact form on this page, email us at support@domesticservices.com, or call our 24/7 helpline.',
    icon: '📞'
  },
  {
    question: 'What is the cancellation policy?',
    answer: 'You can cancel your booking up to 24 hours before the scheduled time for a full refund. Cancellations within 24 hours may incur charges.',
    icon: '❌'
  },
  {
    question: 'How do I change my booking?',
    answer: 'To change your booking, please contact our support team with your booking details. Changes are subject to availability.',
    icon: '📝'
  },
  {
    question: 'Are your service providers insured?',
    answer: 'Yes, all our service providers are fully insured and background-checked for your safety and peace of mind.',
    icon: '🛡️'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, debit cards, digital wallets, and online banking payments through our secure payment gateway.',
    icon: '💳'
  }
];

const ContactPage = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', priority: 'medium' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitted(true);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '', priority: 'medium' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-600/10 rounded-full blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen py-12 px-4">
        <div className="w-full px-4">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-3xl mb-8 shadow-2xl animate-bounce-in">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.959 8.959 0 01-4.5-1.207l-3.5 3.5V12c0-4.418 3.582-8 8-8s8 3.582 8 8z" />
              </svg>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">
              <span className="text-white">Get In </span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Have a question, feedback, or need help? Fill out the form below and our team will get back to you soon.
            </p>
          </div>

          {/* Contact Form and Info */}
          <div className="grid lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Email</p>
                      <p className="text-gray-300">support@domesticservices.com</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Phone</p>
                      <p className="text-gray-300">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Address</p>
                      <p className="text-gray-300">123 Service Street, City, State 12345</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold">Hours</p>
                      <p className="text-gray-300">24/7 Customer Support</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {user ? (
                <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h3>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-2 font-semibold text-gray-700">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label className="block mb-2 font-semibold text-gray-700">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                          placeholder="your.email@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Subject</label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                        placeholder="What is this about?"
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Priority</label>
                      <select
                        name="priority"
                        value={form.priority}
                        onChange={handleChange}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-2 font-semibold text-gray-700">Message</label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200 resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center">
                        Send Message
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </form>
              ) : (
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 text-center">
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Login Required</h3>
                    <p className="text-gray-600 mb-6">Please login to contact us and get support for your queries.</p>
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login to Contact
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-300 text-lg max-w-2xl mx-auto">
                Find quick answers to common questions about our services
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 group"
                >
                  <button
                    className="w-full text-left p-6 focus:outline-none flex justify-between items-start hover:bg-blue-50/50 transition-colors duration-200"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    aria-expanded={activeFaq === idx}
                    aria-controls={`faq-content-${idx}`}
                    id={`faq-header-${idx}`}
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      <span className="text-2xl flex-shrink-0 mt-1">{faq.icon}</span>
                      <span className="font-semibold text-lg text-gray-800 group-hover:text-blue-600 leading-relaxed">
                        {faq.question}
                      </span>
                    </div>
                    <span className={`flex-shrink-0 text-2xl font-bold transition-all duration-300 ml-4 ${
                      activeFaq === idx ? 'rotate-45 text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                    }`}>
                      {activeFaq === idx ? '×' : '+'}
                    </span>
                  </button>
                  <div
                    id={`faq-content-${idx}`}
                    role="region"
                    aria-labelledby={`faq-header-${idx}`}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      activeFaq === idx ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-6 pb-6 pl-16">
                      <p className="text-gray-700 leading-relaxed animate-fade-in">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Section */}
          <div className="text-center bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-white/20">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">Need Immediate Help?</h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Our customer support team is available 24/7 to assist you with any urgent queries or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+15551234567"
                className="inline-flex items-center justify-center bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold py-4 px-8 rounded-xl hover:from-green-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a
                href="mailto:support@domesticservices.com"
                className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 font-semibold py-4 px-8 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;