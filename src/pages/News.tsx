
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, User, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const News = () => {
  const articles = [
    {
      id: 1,
      title: "Building Scalable React Applications with Modern Tooling",
      excerpt: "Exploring the latest trends in React development and how to build applications that scale with your team and business needs.",
      date: "2024-06-01",
      readTime: "5 min read",
      category: "Development",
      featured: true
    },
    {
      id: 2,
      title: "The Future of Web Development: Trends to Watch",
      excerpt: "A comprehensive look at emerging technologies and practices that are shaping the future of web development.",
      date: "2024-05-28",
      readTime: "8 min read",
      category: "Technology",
      featured: false
    },
    {
      id: 3,
      title: "Personal Project Update: Dashboard v2.0",
      excerpt: "Announcing the release of version 2.0 of my personal dashboard with new features and improved performance.",
      date: "2024-05-25",
      readTime: "3 min read",
      category: "Updates",
      featured: false
    },
    {
      id: 4,
      title: "Lessons Learned from Building a SaaS Product",
      excerpt: "Sharing insights and challenges faced while developing a software-as-a-service application from scratch.",
      date: "2024-05-20",
      readTime: "12 min read",
      category: "Business",
      featured: false
    }
  ];

  const featuredArticle = articles.find(article => article.featured);
  const regularArticles = articles.filter(article => !article.featured);

  const getCategoryColor = (category: string) => {
    const colors = {
      Development: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Technology: "bg-green-500/20 text-green-400 border-green-500/30",
      Updates: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Business: "bg-orange-500/20 text-orange-400 border-orange-500/30"
    };
    return colors[category as keyof typeof colors] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            News & 
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Updates</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Stay updated with my latest articles, project updates, and thoughts on technology and development.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Featured Article */}
          {featuredArticle && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                Featured Article
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">Latest</Badge>
              </h2>
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gradient-to-br from-blue-600/20 to-purple-600/20 p-8 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <ExternalLink className="w-8 h-8 text-white" />
                      </div>
                      <Badge className={getCategoryColor(featuredArticle.category)}>
                        {featuredArticle.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle className="text-white text-xl group-hover:text-blue-400 transition-colors">
                        {featuredArticle.title}
                      </CardTitle>
                      <CardDescription className="text-white/60">
                        {featuredArticle.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-white/60">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(featuredArticle.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {featuredArticle.readTime}
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          Your Name
                        </div>
                      </div>
                      <Button className="mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Read Article
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Recent Articles */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article) => (
                <Card key={article.id} className="bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                      <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                    <CardTitle className="text-white group-hover:text-blue-400 transition-colors">
                      {article.title}
                    </CardTitle>
                    <CardDescription className="text-white/60">
                      {article.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(article.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {article.readTime}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <Card className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm border-white/10">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Stay Updated</h3>
              <p className="text-white/70 mb-6 max-w-md mx-auto">
                Subscribe to get notified about new articles and project updates directly in your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                />
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default News;
