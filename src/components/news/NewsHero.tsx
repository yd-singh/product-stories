
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
            Intuitive, Interactive, Intelligent.
          </p>
          <p className="text-lg text-cred-gray-400 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI-powered news with intelligent summaries and insights.
          </p>
          <p className="text-lg leading-relaxed animate-fade-in bg-gradient-to-r from-black via-cred-gray-300 via-white via-cred-gray-400 to-red-900 bg-[length:300%_100%] bg-clip-text text-transparent animate-shine font-medium" style={{ animationDelay: '0.4s' }}>
            By Yash
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsHero;
