
import { Link } from "react-router-dom";
import { User, Newspaper, Crown, ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AuthButton } from "@/components/AuthButton";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  
  const apps = [
    {
      id: "about",
      title: "About Me",
      description: "Learn more about my background, skills, and experience",
      icon: User,
      path: "/about",
      gradient: "from-blue-500 to-purple-600",
      color: "text-blue-500",
      disabled: true,
      comingSoon: true,
    },
    {
      id: "news",
      title: "News",
      description: "Latest updates, articles, and announcements",
      icon: Newspaper,
      path: "/news",
      gradient: "from-green-500 to-teal-600",
      color: "text-green-500",
      disabled: false,
      comingSoon: false,
    },
    {
      id: "alfred-singh",
      title: "Alfred Singh",
      description: "My personal assistant",
      icon: Crown,
      path: "/alfred-singh",
      gradient: "from-orange-500 to-red-600",
      color: "text-orange-500",
      disabled: true,
      comingSoon: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />
        <div className="relative container mx-auto px-6 py-16">
          <div className="flex justify-between items-start mb-8">
            <div className="text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/80 text-sm mb-4">
                <Sparkles className="w-4 h-4" />
                Personal Dashboard
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
                Welcome Back,
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {user?.email?.split('@')[0] || 'User'}
                </span>
              </h1>
              <p className="text-xl text-white/70 max-w-2xl">
                Explore my collection of tools, projects, and content. Each app is designed to showcase different aspects of my work and interests.
              </p>
            </div>
            <AuthButton />
          </div>
        </div>
      </div>

      {/* Apps Grid */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {apps.map((app) => {
            const IconComponent = app.icon;
            const isDisabled = app.disabled || app.comingSoon;
            
            return (
              <Card key={app.id} className={`group relative overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 ${!isDisabled ? 'hover:border-white/20 hover:scale-105' : 'opacity-60'}`}>
                <div className={`absolute inset-0 opacity-0 transition-opacity duration-300 bg-gradient-to-br ${app.gradient} ${!isDisabled ? 'group-hover:opacity-20' : ''}`} />
                <CardHeader className="relative">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${app.gradient} flex items-center justify-center mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl flex items-center gap-2">
                    {app.title}
                    {app.comingSoon && (
                      <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    {app.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  {isDisabled ? (
                    <Button 
                      disabled 
                      className="w-full bg-white/5 text-white/50 border-white/10 cursor-not-allowed"
                    >
                      Coming Soon
                    </Button>
                  ) : (
                    <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white border-white/20 group">
                      <Link to={app.path} className="flex items-center justify-center gap-2">
                        Open App
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-white/40">
            <p>&copy; 2024 Personal Dashboard. Built with passion and purpose.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
