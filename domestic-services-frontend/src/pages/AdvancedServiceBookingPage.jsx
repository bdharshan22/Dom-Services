import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../api';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';

const AdvancedServiceBookingPage = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
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
    additionalServices: [],
    preferredWorkerGender: '',
    accessInstructions: '',
    hasParking: false,
    hasPets: false,
    petDetails: ''
  });
  const [latLng, setLatLng] = useState({ lat: null, lng: null });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);

  const steps = [
    { id: 1, title: 'Service Configuration', icon: '⚙️', desc: 'Configure your service requirements' },
    { id: 2, title: 'Schedule & Location', icon: '📍', desc: 'Choose date, time and location' },
    { id: 3, title: 'Personal Details', icon: '👤', desc: 'Provide your contact information' },
    { id: 4, title: 'Additional Preferences', icon: '🎯', desc: 'Special requirements and preferences' },
    { id: 5, title: 'Review & Payment', icon: '💳', desc: 'Review details and make payment' }
  ];

  const propertyTypes = [
    { value: 'apartment', label: 'Apartment', icon: '🏢', multiplier: 1 },
    { value: 'house', label: 'House', icon: '🏠', multiplier: 1.2 },
    { value: 'villa', label: 'Villa', icon: '🏡', multiplier: 1.5 },
    { value: 'office', label: 'Office', icon: '🏢', multiplier: 1.3 },
    { value: 'shop', label: 'Shop', icon: '🏪', multiplier: 1.1 }
  ];

  const timeSlots = [
    { time: '08:00', label: '8:00 AM', available: true },
    { time: '09:00', label: '9:00 AM', available: true },
    { time: '10:00', label: '10:00 AM', available: true },
    { time: '11:00', label: '11:00 AM', available: false },
    { time: '12:00', label: '12:00 PM', available: true },
    { time: '13:00', label: '1:00 PM', available: true },
    { time: '14:00', label: '2:00 PM', available: true },
    { time: '15:00', label: '3:00 PM', available: false },
    { time: '16:00', label: '4:00 PM', available: true },
    { time: '17:00', label: '5:00 PM', available: true },
    { time: '18:00', label: '6:00 PM', available: true }
  ];

  const additionalServiceOptions = [
    { id: 'deep-clean', label: 'Deep Cleaning', price: 500, icon: '🧽' },
    { id: 'eco-friendly', label: 'Eco-Friendly Products', price: 200, icon: '🌱' },
    { id: 'same-day', label: 'Same Day Service', price: 300, icon: '⚡' },
    { id: 'weekend', label: 'Weekend Service', price: 250, icon: '📅' }
  ];

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await api.get(`/services/${serviceId}`);
        setService(res.data);
      } catch (err) {
        toast.error('Service not found.');
        navigate('/services');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId, navigate]);

  const calculateTotalPrice = () => {
    if (!service) return 0;
    
    let basePrice = service.price;
    
    // Property type multiplier
    const propertyMultiplier = propertyTypes.find(p => p.value === bookingData.propertyType)?.multiplier || 1;
    basePrice *= propertyMultiplier;
    
    // Additional services
    const additionalPrice = bookingData.additionalServices.reduce((total, serviceId) => {
      const addon = additionalServiceOptions.find(s => s.id === serviceId);
      return total + (addon?.price || 0);
    }, 0);
    
    // Frequency discount
    let frequencyMultiplier = 1;
    if (bookingData.serviceFrequency === 'weekly') frequencyMultiplier = 0.9;
    if (bookingData.serviceFrequency === 'monthly') frequencyMultiplier = 0.85;
    
    return Math.round((basePrice + additionalPrice) * frequencyMultiplier);
  };

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
      case 4:
        if (bookingData.hasPets && !bookingData.petDetails) {
          newErrors.petDetails = 'Pet details are required when pets are present';
        }
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'additionalServices') {
        setBookingData(prev => ({
          ...prev,
          additionalServices: checked 
            ? [...prev.additionalServices, value]
            : prev.additionalServices.filter(service => service !== value)
        }));
      } else {
        setBookingData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setBookingData(prev => ({ ...prev, [name]: value }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const fetchLocationName = async (lat, lng) => {
    try {
      const response = await api.get(`/location/reverse-geocode?lat=${lat}&lng=${lng}`);
      return response.data.address || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    } catch {
      return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    }
  };

  const handleFetchLocation = async () => {
    setFetchingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatLng({ lat, lng });
        
        const addressName = await fetchLocationName(lat, lng);
        const coordinates = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        const fullLocation = `${addressName} (${coordinates})`;
        
        setBookingData(prev => ({ ...prev, location: fullLocation }));
        setFetchingLocation(false);
        toast.success('Location fetched successfully!');
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
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = async () => {
      try {
        const orderData = {
          amount: calculateTotalPrice(),
          serviceId: service._id,
          ...bookingData
        };

        const orderResponse = await api.post('/payments/create-order', orderData);
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

              if (verificationResponse.status >= 200 && verificationResponse.status < 300) {
                toast.success('Payment successful! WhatsApp & SMS confirmation sent.');
                navigate('/bookings');
              }
            } catch (err) {
              toast.error('Payment verification failed.');
            } finally {
              setBookingLoading(false);
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
        setBookingLoading(false);
      }
    };
    document.body.appendChild(script);
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      displayRazorpay();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">🏠</span>
                Property Type *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {propertyTypes.map(type => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setBookingData(prev => ({ ...prev, propertyType: type.value }))}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-lg cursor-pointer ${
                      bookingData.propertyType === type.value
                        ? 'border-blue-500 bg-blue-50 shadow-lg transform scale-105'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-4xl mb-3">{type.icon}</div>
                    <div className="font-semibold text-lg">{type.label}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {type.multiplier > 1 ? `+${Math.round((type.multiplier - 1) * 100)}% price` : 'Base price'}
                    </div>
                  </button>
                ))}
              </div>
              {errors.propertyType && <p className="text-red-500 text-sm mt-2">{errors.propertyType}</p>}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">🔄</span>
                Service Frequency *
              </h3>
              <div className="space-y-4">
                {[
                  { value: 'one-time', label: 'One-time Service', desc: 'Single service booking', discount: 0 },
                  { value: 'weekly', label: 'Weekly Service', desc: 'Recurring every week', discount: 10 },
                  { value: 'monthly', label: 'Monthly Service', desc: 'Recurring every month', discount: 15 }
                ].map(freq => (
                  <label key={freq.value} className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-md ${
                    bookingData.serviceFrequency === freq.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}>
                    <input
                      type="radio"
                      name="serviceFrequency"
                      value={freq.value}
                      checked={bookingData.serviceFrequency === freq.value}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-lg">{freq.label}</div>
                        {freq.discount > 0 && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {freq.discount}% OFF
                          </span>
                        )}
                      </div>
                      <div className="text-gray-600 mt-1">{freq.desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">⏱️</span>
                Estimated Duration
              </h3>
              <select
                name="estimatedDuration"
                value={bookingData.estimatedDuration}
                onChange={handleChange}
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
              >
                <option value="">Select estimated duration</option>
                <option value="1">1 hour - Quick service</option>
                <option value="2">2 hours - Standard service</option>
                <option value="3">3 hours - Detailed service</option>
                <option value="4">4 hours - Comprehensive service</option>
                <option value="6">6 hours - Deep service</option>
                <option value="8">Full day (8 hours)</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-3">➕</span>
                Additional Services
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {additionalServiceOptions.map(addon => (
                  <label key={addon.id} className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      name="additionalServices"
                      value={addon.id}
                      checked={bookingData.additionalServices.includes(addon.id)}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <span className="text-2xl mr-2">{addon.icon}</span>
                          <span className="font-medium">{addon.label}</span>
                        </div>
                        <span className="text-blue-600 font-semibold">+₹{addon.price}</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">📅</span>
                  Select Date *
                </h3>
                <div className="flex gap-3">
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg mobile-date-input"
                  />
                  <input
                    type="text"
                    name="date"
                    value={bookingData.date}
                    onChange={handleChange}
                    placeholder="YYYY-MM-DD"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
                  />
                </div>
                {errors.date && <p className="text-red-500 text-sm mt-2">{errors.date}</p>}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">⏰</span>
                  Select Time *
                </h3>
                <div className="flex gap-3">
                  <input
                    type="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
                  />
                  <input
                    type="text"
                    name="time"
                    value={bookingData.time}
                    onChange={handleChange}
                    placeholder="HH:MM"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
                  />
                </div>
                {errors.time && <p className="text-red-500 text-sm mt-2">{errors.time}</p>}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">📍</span>
                Service Location *
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    name="location"
                    value={bookingData.location}
                    onChange={handleChange}
                    placeholder="Enter your complete address with landmarks"
                    className="flex-1 px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
                  />
                  <button
                    type="button"
                    onClick={handleFetchLocation}
                    disabled={fetchingLocation}
                    className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    {fetchingLocation ? '📍 Getting...' : '🎯 Use GPS'}
                  </button>
                </div>
                {errors.location && <p className="text-red-500 text-sm mt-2">{errors.location}</p>}
                
                <div>
                  <label htmlFor="accessInstructions" className="block text-sm font-medium text-gray-700 mb-2">
                    Access Instructions (Optional)
                  </label>
                  <textarea
                    id="accessInstructions"
                    name="accessInstructions"
                    value={bookingData.accessInstructions}
                    onChange={handleChange}
                    placeholder="e.g., Ring doorbell, Gate code: 1234, Building entrance on left side..."
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      name="hasParking"
                      checked={bookingData.hasParking}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 font-medium">🚗 Parking Available</span>
                  </label>

                  <label className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                    <input
                      type="checkbox"
                      name="hasPets"
                      checked={bookingData.hasPets}
                      onChange={handleChange}
                      className="w-5 h-5 text-blue-600"
                    />
                    <span className="ml-3 font-medium">🐕 Pets at Home</span>
                  </label>
                </div>

                {bookingData.hasPets && (
                  <div>
                    <label htmlFor="petDetails" className="block text-sm font-medium text-gray-700 mb-2">
                      Pet Details *
                    </label>
                    <input
                      type="text"
                      id="petDetails"
                      name="petDetails"
                      value={bookingData.petDetails}
                      onChange={handleChange}
                      placeholder="e.g., 1 friendly dog, 2 cats - please keep them in separate room"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                    />
                    {errors.petDetails && <p className="text-red-500 text-sm mt-1">{errors.petDetails}</p>}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Enter your full name"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
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
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
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
                placeholder="10-digit mobile number"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors text-lg"
              />
              {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="emergencyContactName" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergencyContactName"
                    value={bookingData.emergencyContactName}
                    onChange={handleChange}
                    placeholder="Emergency contact name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactMobile" className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Mobile
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactMobile"
                    name="emergencyContactMobile"
                    value={bookingData.emergencyContactMobile}
                    onChange={handleChange}
                    placeholder="Emergency contact mobile"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                  />
                </div>

                <div>
                  <label htmlFor="emergencyContactRelationship" className="block text-sm font-medium text-gray-700 mb-2">
                    Relationship
                  </label>
                  <select
                    id="emergencyContactRelationship"
                    name="emergencyContactRelationship"
                    value={bookingData.emergencyContactRelationship}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors"
                  >
                    <option value="">Select relationship</option>
                    <option value="spouse">Spouse</option>
                    <option value="parent">Parent</option>
                    <option value="child">Child</option>
                    <option value="sibling">Sibling</option>
                    <option value="friend">Friend</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Worker Preferences</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Worker Gender (Optional)
                </label>
                <div className="flex gap-4">
                  {['male', 'female', 'no-preference'].map(gender => (
                    <label key={gender} className="flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 transition-colors">
                      <input
                        type="radio"
                        name="preferredWorkerGender"
                        value={gender}
                        checked={bookingData.preferredWorkerGender === gender}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600"
                      />
                      <span className="ml-3 capitalize">{gender.replace('-', ' ')}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="specialInstructions" className="block text-sm font-semibold text-gray-700 mb-2">
                Special Instructions & Requirements
              </label>
              <textarea
                id="specialInstructions"
                name="specialInstructions"
                value={bookingData.specialInstructions}
                onChange={handleChange}
                rows="6"
                placeholder="Please provide any specific requirements, areas to focus on, items to avoid, allergies, or other important instructions for the service provider..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 transition-colors resize-none text-lg"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
              <h3 className="text-2xl font-bold mb-6 text-center">Booking Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">Service Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{service?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Property Type:</span>
                      <span className="font-medium capitalize">{bookingData.propertyType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Frequency:</span>
                      <span className="font-medium capitalize">{bookingData.serviceFrequency.replace('-', ' ')}</span>
                    </div>
                    {bookingData.estimatedDuration && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{bookingData.estimatedDuration} hours</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold text-lg border-b pb-2">Schedule & Location</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">{new Date(bookingData.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium">{bookingData.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium text-right max-w-xs truncate">{bookingData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {bookingData.additionalServices.length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-lg mb-3">Additional Services</h4>
                  <div className="space-y-2">
                    {bookingData.additionalServices.map(serviceId => {
                      const addon = additionalServiceOptions.find(s => s.id === serviceId);
                      return addon ? (
                        <div key={serviceId} className="flex justify-between">
                          <span className="text-gray-600">{addon.label}:</span>
                          <span className="font-medium">+₹{addon.price}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-gray-300">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total Amount:</span>
                  <span className="text-blue-600">₹{calculateTotalPrice()}</span>
                </div>
                {bookingData.serviceFrequency !== 'one-time' && (
                  <p className="text-sm text-green-600 text-right mt-1">
                    Discount applied for {bookingData.serviceFrequency} service!
                  </p>
                )}
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
              <div className="flex items-start">
                <span className="text-yellow-600 text-2xl mr-3">⚠️</span>
                <div className="text-sm text-yellow-800">
                  <p className="font-semibold mb-2">Important Information:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Payment will be processed securely through Razorpay</li>
                    <li>You will receive a confirmation email and SMS after successful payment</li>
                    <li>Service provider will contact you 30 minutes before arrival</li>
                    <li>You can reschedule or cancel up to 2 hours before the service time</li>
                    <li>Please ensure someone is available at the location during service time</li>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading booking form...</p>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">Service not found.</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <button
            onClick={() => navigate(`/services/${serviceId}`)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Service Details</span>
          </button>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={service.image}
                alt={service.name}
                className="w-24 h-24 object-cover rounded-2xl shadow-lg"
              />
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Book {service.name}</h1>
                <p className="text-gray-600 text-lg">Complete your booking in {steps.length} simple steps</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600">₹{calculateTotalPrice()}</div>
              <div className="text-gray-500">Total Amount</div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex flex-col items-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full text-lg font-bold transition-all duration-300 ${
                    currentStep >= step.id 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? '✓' : step.icon}
                  </div>
                  <div className="mt-2 text-center">
                    <div className="font-semibold text-sm">{step.title}</div>
                    <div className="text-xs text-gray-500 max-w-24">{step.desc}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 transition-all duration-300 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{steps[currentStep - 1].title}</h2>
              <p className="text-gray-600 text-lg">{steps[currentStep - 1].desc}</p>
            </div>
            
            {renderStepContent()}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center p-8 bg-gray-50 border-t">
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
            >
              ← Previous
            </button>
            
            <div className="text-center">
              <div className="text-sm text-gray-500 mb-1">Step {currentStep} of {steps.length}</div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors font-semibold shadow-lg"
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={bookingLoading}
                className="px-12 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 disabled:opacity-50 transition-colors font-bold text-lg shadow-lg"
              >
                {bookingLoading ? 'Processing...' : `Pay ₹${calculateTotalPrice()}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedServiceBookingPage;