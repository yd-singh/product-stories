
const NewsLoadingState = () => {
  return (
    <div className="min-h-screen bg-cred-black flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-cred-teal border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-cred-gray-300 font-medium">Loading news...</p>
      </div>
    </div>
  );
};

export default NewsLoadingState;
