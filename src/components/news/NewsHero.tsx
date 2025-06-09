
const NewsHero = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="max-w-3xl">
        <h1 className="text-5xl lg:text-6xl font-bold text-cred-gray-100 mb-6 leading-tight">
          News Reimagined{' '}
          <span className="text-cred-teal relative animate-pulse">
            By Yash
            <span className="absolute inset-0 text-cred-teal opacity-50 animate-ping">By Yash</span>
          </span>
        </h1>
        <div className="space-y-3">
          <p className="text-xl text-cred-gray-300 leading-relaxed font-medium animate-fade-in">
            Intuitive, Interactive, Intelligent.
          </p>
          <p className="text-lg text-cred-gray-400 leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            AI-powered news with intelligent summaries and insights.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewsHero;
