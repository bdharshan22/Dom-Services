import React from 'react';

const LoadingSpinner = ({ message = "Loading...", size = "default" }) => {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24"
  };

  const textSizes = {
    small: "text-sm",
    default: "text-xl",
    large: "text-2xl"
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative z-10 text-center">
        {/* Advanced Spinner */}
        <div className="relative mb-8">
          {/* Outer Ring */}
          <div className={`${sizeClasses[size]} mx-auto relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-400 border-r-purple-400 animate-spin"></div>
            
            {/* Inner Ring */}
            <div className="absolute inset-2 rounded-full border-2 border-white/10"></div>
            <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-pink-400 border-l-cyan-400 animate-spin animation-reverse animation-delay-500"></div>
            
            {/* Center Dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Floating Particles */}
          <div className="absolute -inset-8">
            <div className="absolute top-0 left-1/2 w-2 h-2 bg-blue-400 rounded-full animate-bounce animation-delay-200"></div>
            <div className="absolute bottom-0 right-1/4 w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce animation-delay-700"></div>
            <div className="absolute top-1/2 left-0 w-1 h-1 bg-pink-400 rounded-full animate-bounce animation-delay-1000"></div>
            <div className="absolute top-1/4 right-0 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce animation-delay-300"></div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <p className={`${textSizes[size]} text-white font-semibold animate-pulse`}>
            {message}
          </p>
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-400"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;