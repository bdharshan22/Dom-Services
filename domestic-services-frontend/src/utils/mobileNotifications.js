// Mobile-optimized notification utilities
export const showMobileToast = (message, type = 'success') => {
  // Create toast element
  const toast = document.createElement('div');
  toast.className = `fixed top-4 left-4 right-4 z-[10001] p-4 rounded-xl shadow-2xl transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500 text-white' : 
    type === 'error' ? 'bg-red-500 text-white' : 
    'bg-blue-500 text-white'
  }`;
  toast.style.zIndex = '10001';
  toast.innerHTML = `
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <div class="mr-3">
          ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
        </div>
        <div class="font-semibold">${message}</div>
      </div>
      <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
        ✕
      </button>
    </div>
  `;

  // Add to body
  document.body.appendChild(toast);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.transform = 'translateY(-100%)';
      toast.style.opacity = '0';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }, 5000);
};

export const vibrate = (pattern = [200]) => {
  if ('vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
};