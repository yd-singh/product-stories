
const NewsHero = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-5xl lg:text-6xl font-bold text-cred-gray-100 mb-6 leading-tight">
          News{' '}
          <span className="relative bg-gradient-to-r from-cred-teal via-cred-purple to-cred-teal bg-[length:200%_100%] bg-clip-text text-transparent animate-shine">
            Reimagined
          </span>
        </h1>
        <div className="space-y-3">
          <p className="text-xl text-cred-gray-300 leading-relaxed font-medium animate-fade-in">
            <span className="text-white font-bold text-2xl drop-shadow-lg">I</span>ntuitive, <span className="text-white font-bold text-2xl drop-shadow-lg">I</span>nteractive, <span className="text-white font-bold text-2xl drop-shadow-lg">I</span>ntelligent.
          </p>
          <p className="text-lg text-cred-gray-400 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI-powered news with intelligent summaries and insights.
          </p>
          <p className="text-lg leading-relaxed animate-fade-in font-medium relative" style={{ animationDelay: '0.4s' }}>
            <span className="bg-gradient-to-r from-cred-gray-600 via-cred-gray-100 via-cred-gray-300 via-red-400 to-cred-gray-600 bg-[length:400%_100%] bg-clip-text text-transparent animate-[shine_4s_ease-in-out_infinite]">
              By Yash
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsHero;
