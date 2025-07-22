// components/LoadingScreen.jsx
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
  </div>
);

export default LoadingScreen;
