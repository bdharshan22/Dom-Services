import React, { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [mobile, setMobile] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [latLng, setLatLng] = useState({ lat: '', lng: '' });
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [mobileError, setMobileError] = useState('');
  const [countryCode, setCountryCode] = useState('in');
  const [mobileOnly, setMobileOnly] = useState('');

  // Worker-specific fields
  const [skills, setSkills] = useState('');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');

  const totalSteps = role === 'worker' ? 3 : 2;

  // Helper to reverse geocode lat/lng to address using OpenStreetMap Nominatim
  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      return data.display_name || '';
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
        setLocation(name ? `${name}` : `${lat},${lng}`);
        setFetchingLocation(false);
      }, (err) => {
        alert('Unable to fetch location. Please allow location access.');
        setFetchingLocation(false);
      });
    } else {
      alert('Geolocation is not supported by this browser.');
      setFetchingLocation(false);
    }
  };

  // Validation functions for each step
  const validateStep1 = () => {
    const isNameValid = name.trim().length >= 2;
    const isEmailValid = email.includes('@') && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    const isPasswordValid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);

    return isNameValid && isEmailValid && isPasswordValid;
  };

  const validateStep2 = () => {
    const isMobileValid = mobileOnly.length === 10 && /^\d{10}$/.test(mobileOnly);
    const isLocationValid = location.trim().length >= 3;

    return isMobileValid && isLocationValid;
  };

  const validateStep3 = () => {
    const isSkillsValid = skills.trim().length >= 3;
    const isExperienceValid = experience >= 0 && experience <= 50;

    return isSkillsValid && isExperienceValid;
  };

  const getCurrentStepValidation = () => {
    switch (currentStep) {
      case 1:
        return validateStep1();
      case 2:
        return validateStep2();
      case 3:
        return validateStep3();
      default:
        return false;
    }
  };

  const isAllFieldsValid = () => {
    if (role !== 'worker') return true; // For non-workers, no additional validation needed
    return (
      name.trim().length >= 2 &&
      email.includes('@') && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) &&
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password) &&
      mobileOnly.length === 10 && /^\d{10}$/.test(mobileOnly) &&
      location.trim().length >= 3 &&
      skills.trim().length >= 3 &&
      experience >= 0 && experience <= 50
    );
  };

  const nextStep = () => {
    if (currentStep < totalSteps && getCurrentStepValidation()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMobileError('');

    // Debug logging
    console.log('Form submission - Debug info:', {
      mobileOnly,
      mobileOnlyLength: mobileOnly ? mobileOnly.length : 0,
      mobileOnlyRegex: mobileOnly ? /^\d{10}$/.test(mobileOnly) : false,
      countryCode,
      countryCodeType: typeof countryCode,
      countryCodeTruthy: !!countryCode
    });

    // More robust validation for mobile number
    if (!mobileOnly || mobileOnly.length !== 10 || !/^\d{10}$/.test(mobileOnly) || !countryCode) {
      console.log('Validation failed:', {
        mobileOnly: !mobileOnly,
        lengthCheck: mobileOnly.length !== 10,
        regexCheck: !/^\d{10}$/.test(mobileOnly),
        countryCodeCheck: !countryCode
      });
      setLoading(false);
      setMobileError('Please select a country code and enter a valid 10-digit mobile number.');
      return;
    }

    try {
      const locationValue = latLng.lat && latLng.lng ? `${location}|${latLng.lat},${latLng.lng}` : location;

      // Prepare registration data
      const registrationData = {
        name,
        email,
        password,
        mobile: `+${countryCode}${mobileOnly}`,
        location: locationValue,
        role
      };

      // Add worker-specific fields if registering as worker
      if (role === 'worker') {
        registrationData.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
        registrationData.experience = parseInt(experience) || 0;
        registrationData.description = description;
      }

      await register(registrationData.name, registrationData.email, registrationData.password, registrationData.mobile, registrationData.location, registrationData.role, registrationData);
      toast.success('Registration successful!');
      navigate('/services');
    } catch (err) {
      console.error('Registration error:', err.response || err.message || err);
      const errorMessage = err.response?.data?.msg || err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 shadow-lg ${
            step === currentStep
              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white scale-110'
              : step < currentStep
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 text-gray-500'
          }`}>
            {step < currentStep ? (
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              step
            )}
          </div>
          {step < totalSteps && (
            <div className={`w-16 h-1 mx-3 rounded-full transition-all duration-300 ${
              step < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Information</h3>
              <p className="text-gray-600">Let's start with your basic information</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Register as</label>
              <div className="relative">
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 bg-white appearance-none transition-all duration-200"
                >
                  <option value="user">Customer</option>
                  <option value="worker">Service Provider</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setEmailTouched(true)}
                  placeholder="Enter your email address"
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    emailTouched && (!email.includes('@') || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              {emailTouched && (!email.includes('@') || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Please enter a valid email address
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setPasswordTouched(true)}
                  placeholder="Create a strong password"
                  className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all duration-200 ${
                    passwordTouched && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password)
                      ? 'border-red-300 bg-red-50 focus:border-red-500'
                      : 'border-gray-200 focus:border-blue-500 focus:bg-blue-50'
                  }`}
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <button
                  type="button"
                  tabIndex={-1}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors duration-200"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575m2.1 2.1A7.963 7.963 0 004 9c0 4.418 3.582 8 8 8 1.657 0 3.22-.403 4.575-1.125m2.1-2.1A7.963 7.963 0 0020 15c0-4.418-3.582-8-8-8-1.657 0-3.22.403-4.575 1.125" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordTouched && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password) && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Password must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-100 to-blue-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Contact Information</h3>
              <p className="text-gray-600">How can we reach you?</p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <div className="flex items-center border border-neutral-300 rounded-xl bg-neutral-50 px-2 py-1 focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-200 transition-all duration-200" style={{minWidth:'120px',maxWidth:'130px', height: '52px'}}>
                  <PhoneInput
                    country={countryCode}
                    value={countryCode}
                    onChange={(value, country, e, formattedValue) => {
                      console.log('PhoneInput onChange:', { value, country, formattedValue });
                      if (country && country.dialCode) {
                        setCountryCode(country.dialCode);
                      }
                    }}
                    onlyCountries={['in','us','gb','au','ae','fr','de','cn','jp','ru','za','br','ca']}
                    disableCountryCode={false}
                    disableDropdown={false}
                    inputProps={{
                      name: 'countryCode',
                      required: true,
                      autoFocus: false,
                      id: 'countryCode',
                      className: 'bg-neutral-50 border-none w-16 text-center focus:ring-0 focus:outline-none pl-7 h-11',
                    }}
                    containerStyle={{ width: '100%', minWidth: '100px', maxWidth: '120px', background: 'transparent', border: 'none', boxShadow: 'none', display: 'flex', alignItems: 'center', height: '52px' }}
                    inputStyle={{ width: '100%', minWidth: '60px', maxWidth: '90px', background: 'transparent', border: 'none', boxShadow: 'none', padding: '0 0 0 38px', textAlign: 'left', height: '52px', lineHeight: '52px' }}
                    buttonStyle={{ minWidth: '28px', maxWidth: '28px', padding: 0, left: 0, position: 'absolute', background: 'transparent', border: 'none', height: '52px' }}
                    buttonClass="left-0 absolute"
                    enableSearch
                  />
                </div>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={mobileOnly}
                  onChange={e => setMobileOnly(e.target.value)}
                  placeholder="1234567890"
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                  required
                  pattern="[0-9]{6,15}"
                />
              </div>
              {mobileError && (
                <p className="text-red-500 text-xs mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {mobileError}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="Enter your city, state, or full address"
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                    required
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3">
                    <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-semibold shadow-lg hover:from-primary-600 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all duration-300 transform hover:scale-105"
                  onClick={handleFetchLocation}
                  disabled={fetchingLocation}
                  title="Get your current location"
                >
                  {fetchingLocation ? (
                    <div className="relative w-5 h-5">
                      <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
                      <div className="absolute inset-0.5 rounded-full border border-transparent border-b-blue-200 animate-spin animation-reverse animation-delay-300"></div>
                    </div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                  {fetchingLocation ? 'Getting Location...' : 'Use My Location'}
                </button>
              </div>
              {latLng.lat && latLng.lng && (
                <p className="text-xs text-neutral-500 mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Coordinates: {latLng.lat}, {latLng.lng}
                </p>
              )}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Professional Information</h3>
              <p className="text-gray-600">Tell us about your expertise</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="skills" className="block text-sm font-semibold text-gray-700">
                Skills <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., Plumbing, Electrical, Cleaning, Carpentry (comma-separated)"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500">Separate multiple skills with commas</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-semibold text-gray-700">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="experience"
                  name="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 5"
                  min="0"
                  max="50"
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center px-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
                Professional Description
              </label>
              <div className="relative">
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell customers about your experience, specialties, and what makes you unique..."
                  rows={4}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-blue-50 transition-all duration-200 resize-none"
                />
                <div className="absolute top-3 left-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
                <div className="absolute top-3 right-3">
                  <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </div>
              </div>
              <p className="text-xs text-neutral-500">Optional: Help customers understand your expertise</p>
            </div>
          </div>
        );

      default:
        return null;
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

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 border border-white/20">
            {/* Header */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl mb-2 shadow-lg">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-800 mb-1">Create Account</h1>
              <p className="text-gray-600 text-xs">Join our platform</p>
            </div>

            {renderStepIndicator()}

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              {renderStepContent()}



              <div className="flex justify-between pt-3 border-t border-gray-200">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    currentStep === 1
                      ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300 transform hover:scale-105'
                  }`}
                >
                  <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!getCurrentStepValidation()}
                    className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 transform ${
                      getCurrentStepValidation()
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <svg className="w-5 h-5 ml-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 rounded-xl font-semibold shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={!isAllFieldsValid() || loading}
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="relative w-5 h-5 mr-3">
                          <div className="absolute inset-0 rounded-full border-2 border-white/30"></div>
                          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin"></div>
                          <div className="absolute inset-0.5 rounded-full border border-transparent border-b-blue-200 animate-spin animation-reverse animation-delay-300"></div>
                        </div>
                        Creating Account...
                      </div>
                    ) : (
                      <span className="flex items-center">
                        Create Account
                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                )}
              </div>
          </form>

            <div className="mt-4 text-center">
              <p className="text-gray-600 text-xs">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;