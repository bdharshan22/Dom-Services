import React, { useState, useEffect } from 'react';
import { api } from '../api';
import { useAuth } from './AuthProvider';
import { toast } from 'react-toastify';
import PaymentSuccessModal from './PaymentSuccessModal';
import { showPaymentSuccessModal, requestNotificationPermission } from '../utils/modalUtils';

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
    propertyType: '',
    serviceFrequency: 'one-time',
    estimatedDuration: '',
    additionalServices: []
  });
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBookingData, setSuccessBookingData] = useState(null);

  const steps = [
    { id: 1, title: 'Service', icon: '🛠️' },
    { id: 2, title: 'Schedule', icon: '📅' },
    { id: 3, title: 'Details', icon: '👤' },
    { id: 4, title: 'Review', icon: '💳' }
  ];

  const propertyTypes = ['Apartment', 'House', 'Villa', 'Office', 'Shop', 'Other'];

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
    
    // Request notification permission on component mount
    requestNotificationPermission();
  }, [serviceId, onClose]);

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 1:
        if (!bookingData.propertyType) newErrors.propertyType = 'Property type is required';
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
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
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

  const handleFetchLocation = async () => {
    setFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({ lat, lng });
        
        try {
          // Get full address using reverse geocoding
          const response = await api.get(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
          const fullAddress = response.data.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setBookingData(prev => ({ ...prev, location: fullAddress }));
          toast.success('Location fetched successfully!');
        } catch (error) {
          // Fallback to coordinates if reverse geocoding fails
          const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          setBookingData(prev => ({ ...prev, location: coordinates }));
          toast.success('Location coordinates added successfully!');
        }
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
            console.log('Payment successful, processing...', response);
            try {
              const verificationResponse = await api.post('/payments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              });

              console.log('Verification response:', verificationResponse);

              if (verificationResponse.status === 201) {
                const bookingResult = verificationResponse.data.booking;
                const successData = {
                  serviceName: service.name,
                  date: bookingData.date,
                  time: bookingData.time,
                  location: bookingData.location,
                  amount: service.price,
                  bookingId: bookingResult._id
                };
                
                setSuccessBookingData(successData);
                
                // Show success notification immediately
                toast.success('🎉 Payment successful! Booking confirmed!');
                
                // Use utility function to show modal properly
                showPaymentSuccessModal(setShowSuccessModal, successData);
                
                const count = parseInt(localStorage.getItem('bookingCount') || '0') + 1;
                localStorage.setItem('bookingCount', count.toString());
                
                console.log('Payment success modal should be showing now');
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (err) {
              console.error('Payment verification error:', err);
              toast.error('Payment verification failed. Please contact support.');
            } finally {
              setLoading(false);
            }
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              console.log('Payment modal dismissed');
            }
          },
          prefill: {
            name: bookingData.fullName || user.name,
            email: bookingData.email || user.email,
            contact: bookingData.mobile
          },
          theme: {
            color: '#3B82F6',
          },
          retry: {
            enabled: true,
            max_count: 3
          },
        };

        const rzp = new window.Razorpay(options);
        
        // Add error handler
        rzp.on('payment.failed', function (response) {
          console.error('Payment failed:', response.error);
          toast.error(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        
        rzp.open();
        console.log('Razorpay modal opened');
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
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Property Type *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {propertyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => handleChange({ target: { name: 'propertyType', value: type } })}
                      className={`property-type-btn p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer text-center min-h-[60px] ${
                        bookingData.propertyType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-2xl mb-1">
                        {type === 'Apartment' ? '🏢' : type === 'House' ? '🏠' : 
                         type === 'Villa' ? '🏡' : type === 'Office' ? '🏢' : 
                         type === 'Shop' ? '🏪' : '🏗️'}
                      </div>
                      <div className="font-medium text-xs sm:text-sm">{type}</div>
                    </button>
                  ))}
                </div>
                {errors.propertyType && <p className="text-red-500 text-xs mt-1">{errors.propertyType}</p>}
              </div>
  
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Frequency *
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'one-time', label: 'One-time Service', desc: 'Single service booking' },
                    { value: 'weekly', label: 'Weekly', desc: 'Recurring every week' },
                    { value: 'monthly', label: 'Monthly', desc: 'Recurring every month' }
                  ].map(freq => (
                    <label key={freq.value} className="flex items-center p-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="serviceFrequency"
                        value={freq.value}
                        checked={bookingData.serviceFrequency === freq.value}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 flex-shrink-0"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-sm">{freq.label}</div>
                        <div className="text-xs text-gray-500">{freq.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
  
              <div>
                <label htmlFor="estimatedDuration" className="block text-sm font-semibold text-gray-700 mb-2">
                  Estimated Duration (optional)
                </label>
                <select
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={bookingData.estimatedDuration}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                >
                  <option value="">Select duration</option>
                  {[1, 2, 3, 4, 6, 8].map(h => 
                    <option key={h} value={h}>{h} hour{h > 1 ? 's' : ''}</option>
                  )}
                </select>
              </div>
            </div>
          );
  
        case 2:
          return (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors bg-white"
                    style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  />
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
  
                <div>
                  <label htmlFor="time" className="block text-sm font-semibold text-gray-700 mb-2">
                    Preferred Time *
                  </label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors bg-white"
                    style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  />
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>
  
              <div>
                <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
                  Service Location / Address *
                </label>
                <div className="space-y-3">
                  <textarea
                    id="location"
                    name="location"
                    value={bookingData.location}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Enter your full address..."
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors resize-none bg-white"
                    style={{ fontSize: '16px' }} // Prevents zoom on iOS
                  />
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={fetchingLocation}
                    className="w-full sm:w-auto px-6 py-3 text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 font-medium min-h-[44px]"
                  >
                    {fetchingLocation ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        📍 Use Current Location
                      </>
                    )}
                  </button>
                </div>
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
              </div>
            </div>
          );
  
        case 3:
          return (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
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
                    className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
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
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                />
                {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
              </div>
  
              <div>
                <label htmlFor="specialInstructions" className="block text-sm font-semibold text-gray-700 mb-2">
                  Access Instructions (e.g., gate code)
                </label>
                <textarea
                  id="specialInstructions"
                  name="specialInstructions"
                  value={bookingData.specialInstructions}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-3 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors resize-none"
                />
              </div>
            </div>
          );
  
        case 4:
          return (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="text-base font-semibold mb-3">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-right">{service?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium text-right">{bookingData.date} at {bookingData.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property:</span>
                    <span className="font-medium text-right">{bookingData.propertyType}</span>
                  </div>
                   <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium text-right break-all">{bookingData.location}</span>
                  </div>
                  <hr className="my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-800">Total:</span>
                    <span className="text-lg font-bold text-blue-600">₹{service?.price}</span>
                  </div>
                </div>
              </div>
  
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800">
                    Payment is processed securely by Razorpay. You will receive a confirmation via Email, SMS & WhatsApp after successful payment.
                  </p>
              </div>
            </div>
          );
  
        default:
          return null;
      }
  };

  if (!service) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <>
      <PaymentSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          // Restore body scroll
          document.body.style.overflow = 'auto';
          document.body.classList.remove('modal-open');
          onClose();
        }} 
        bookingData={successBookingData} 
      />
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Book {service.name}</h2>
            <p className="text-xs text-gray-500">Complete your booking in {steps.length} easy steps</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center text-xl text-gray-600">
             &times;
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-4 py-3 bg-gray-50">
          <div className="flex items-center">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? '✓' : step.icon}
                  </div>
                  <div className={`ml-2 text-xs font-medium hidden sm:block ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-grow h-1 mx-2 sm:mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          {renderStepContent()}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 mt-auto border-t bg-white gap-3">
          {/* Previous Button */}
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="step-nav-btn px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Previous
          </button>

          {/* Progress Bar and Step Indicator */}
          <div className="flex-grow flex flex-col items-center px-2">
            <span className="text-xs text-gray-500 mb-1">
              Step {currentStep} of {steps.length}
            </span>
            <div className="w-full h-1.5 bg-gray-200 rounded-full">
              <div
                className="h-1.5 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Next / Pay Button */}
          {currentStep < steps.length ? (
            <button
              onClick={handleNext}
              className="step-nav-btn px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="step-nav-btn px-4 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                  Processing...
                </>
              ) : (
                `Pay ₹${service.price}`
              )}
            </button>
          )}
        </div>
      </div>
      </div>
    </>
  );
};

export default BookingForm;