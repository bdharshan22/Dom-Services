import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';

const BookingForm = ({ serviceId, onClose }) => {
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    location: '',
    mobile: '',
    email: user?.email || '',
    fullName: user?.name || '',
    specialInstructions: '',
    emergencyContactName: '',
    emergencyContactMobile: '',
    emergencyContactRelationship: '',
    propertyType: '',
    serviceFrequency: 'one-time',
    estimatedDuration: '',
    additionalServices: []
  });
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [errors, setErrors] = useState({});

  const steps = [
    { id: 1, title: 'Service Details', icon: '🛠️' },
    { id: 2, title: 'Schedule & Location', icon: '📅' },
    { id: 3, title: 'Personal Info', icon: '👤' },
    { id: 4, title: 'Review & Payment', icon: '💳' }
  ];

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Other'];
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        toast.error('Service not found.');
        onClose();
      }
    };
    fetchService();
  }, [serviceId, onClose]);

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!bookingData.propertyType) newErrors.propertyType = 'Property type is required';
        if (!bookingData.serviceFrequency) newErrors.serviceFrequency = 'Service frequency is required';
        break;
      case 2:
        if (!bookingData.date) newErrors.date = 'Date is required';
        if (!bookingData.time) newErrors.time = 'Time is required';
        if (!bookingData.location) newErrors.location = 'Location is required';
        break;
      case 3:
        if (!bookingData.fullName) newErrors.fullName = 'Full name is required';
        if (!bookingData.email) newErrors.email = 'Email is required';
        if (!bookingData.mobile) newErrors.mobile = 'Mobile number is required';
        if (bookingData.mobile && !/^\d{10}$/.test(bookingData.mobile)) {
          newErrors.mobile = 'Mobile number must be 10 digits';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setBookingData(prev => ({
        ...prev,
        additionalServices: checked 
          ? [...prev.additionalServices, value]
          : prev.additionalServices.filter(service => service !== value)
      }));
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return '';
    }
  };

  const handleFetchLocation = async () => {
    setFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({ lat, lng });
        const name = await fetchLocationName(lat, lng);
        setBookingData(prev => ({ ...prev, location: name || `${lat},${lng}` }));
        setFetchingLocation(false);
      }, () => {
        toast.error('Unable to fetch location. Please allow location access.');
        setFetchingLocation(false);
      });
    } else {
      toast.error('Geolocation is not supported by this browser.');
      setFetchingLocation(false);
    }
  };

  const displayRazorpay = async () => {
    if (!user) {
      toast.error('You must be logged in to book a service.');
      onClose();
      return;
    }

    setLoading(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = async () => {
      try {
        const orderResponse = await api.post('/payments/create-order', {
          amount: service.price,
          serviceId: service._id,
          ...bookingData
        });

        const { orderId, amount, currency, key } = orderResponse.data;

        const options = {
          key,
          amount,
          currency,
          name: service.name,
          description: service.description,
          order_id: orderId,
          handler: async function (response) {
            try {
              const verificationResponse = await api.post('/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              if (verificationResponse.status === 201) {
                toast.success('Payment successful! Check your WhatsApp & SMS for confirmation.');
                // Increment booking count for feedback trigger
                const count = parseInt(localStorage.getItem('bookingCount') || '0') + 1;
                localStorage.setItem('bookingCount', count.toString());
                onClose();
              }
            } catch (err) {
              toast.error('Payment verification failed.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: user.name,
            email: user.email,
          },
          theme: {
            color: '#3B82F6',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        toast.error('Failed to create order. Please try again.');
        setLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  const handleSubmit = () => {
    if (validateStep(3)) {
      displayRazorpay();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Property Type *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                {propertyTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      console.log('Property type clicked:', type);
                      setBookingData(prev => ({ ...prev, propertyType: type }));
                    }}
                    style={{ pointerEvents: 'auto', zIndex: 10 }}
                    className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-200 cursor-pointer text-center ${
                      bookingData.propertyType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1 sm:mb-2">
                      {type === 'Apartment' ? '🏢' : type === 'House' ? '🏠' : 
                       type === 'Villa' ? '🏡' : type === 'Office' ? '🏢' : 
                       type === 'Shop' ? '🏪' : '🏗️'}
                    </div>
                    <div className="font-medium text-xs sm:text-sm">{type}</div>
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-sm mt-1">{errors.propertyType}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                Service Frequency *
              </label>
              <div className="space-y-2 sm:space-y-3">
                {[
                  { value: 'one-time', label: 'One-time Service', desc: 'Single service booking' },
                  { value: 'weekly', label: 'Weekly', desc: 'Recurring every week' },
                  { value: 'monthly', label: 'Monthly', desc: 'Recurring every month' }
                ].map(freq => (
                  <label key={freq.value} className="flex items-center p-3 sm:p-4 border-2 rounded-lg sm:rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="serviceFrequency"
                      value={freq.value}
                      checked={bookingData.serviceFrequency === freq.value}
                      onChange={handleChange}
                      className="w-4 h-4 text-blue-600 flex-shrink-0"
                    />
                    <div className="ml-3">
                      <div className="font-medium text-sm sm:text-base">{freq.label}</div>
                      <div className="text-xs sm:text-sm text-gray-500">{freq.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="estimatedDuration" className="block text-sm font-semibold text-gray-700 mb-2">
                Estimated Duration (hours)
              </label>
              <select
                id="estimatedDuration"
                name="estimatedDuration"
                value={bookingData.estimatedDuration}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
              >
                <option value="">Select duration</option>
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="6">6 hours</option>
                <option value="8">Full day (8 hours)</option>
              </select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
                  required
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Preferred Time *
                </label>
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
                  required
                />
                {errors.time && <p className="text-red-500 text-sm mt-1">{errors.time}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                Service Location *
              </label>
              <div className="space-y-3">
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={bookingData.location}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={handleFetchLocation}
                  disabled={fetchingLocation}
                  className="w-full sm:w-auto px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {fetchingLocation ? (
                    <>
                      <span className="animate-pulse">📍</span>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <span>🎯</span>
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>
              {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={bookingData.fullName}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
                />
                {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={bookingData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="mobile" className="block text-sm font-semibold text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={bookingData.mobile}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            <div>
              <label htmlFor="specialInstructions" className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Preferences
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={bookingData.specialInstructions}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6">
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Booking Summary</h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Service:</span>
                  <span className="font-medium text-sm sm:text-base">{service?.name}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Date & Time:</span>
                  <span className="font-medium text-sm sm:text-base">{bookingData.date} at {bookingData.time}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Property Type:</span>
                  <span className="font-medium text-sm sm:text-base">{bookingData.propertyType}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Frequency:</span>
                  <span className="font-medium text-sm sm:text-base">{bookingData.serviceFrequency}</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-sm sm:text-base text-gray-600">Location:</span>
                  <span className="font-medium text-sm sm:text-base break-words">{bookingData.location}</span>
                </div>
                <hr className="my-2 sm:my-3" />
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                  <span className="text-lg sm:text-xl font-bold text-gray-800">Total Amount:</span>
                  <span className="text-lg sm:text-xl font-bold text-blue-600">₹{service?.price}</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2 flex-shrink-0">⚠️</span>
                <div className="text-xs sm:text-sm text-yellow-800">
                  <p className="font-medium mb-1 sm:mb-2">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payment will be processed securely through Razorpay</li>
                    <li>You will receive a confirmation email after successful payment</li>
                    <li>Service provider will contact you 30 minutes before arrival</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!service) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="text-gray-700 font-semibold">Loading service details...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div>
            <h2 className="text-2xl font-bold">Book {service.name}</h2>
            <p className="opacity-90">Complete your booking in {steps.length} easy steps</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {currentStep > step.id ? '✓' : step.icon}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className={`text-sm font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[50vh] sm:max-h-96" style={{ pointerEvents: 'auto' }}>
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 sm:p-4 border-t bg-gray-50 gap-2">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="px-3 sm:px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Previous
          </button>
          
          <div className="text-xs sm:text-sm text-gray-500 text-center">
            Step {currentStep} of {steps.length}
          </div>

          {currentStep < 4 ? (
            <button
              onClick={handleNext}
              className="px-3 sm:px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 sm:px-6 py-2 text-sm bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {loading ? 'Processing...' : `Pay ₹${service.price}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingForm;
