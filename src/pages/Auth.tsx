
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Linkedin, ExternalLink, Mail } from 'lucide-react';

const Auth = () => {
  const { user, signIn } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistName, setWaitlistName] = useState('');

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully!",
      });
    }
    setLoading(false);
  };

  const handleWaitlistRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!waitlistEmail) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // For now, just show a success message
    // In a real implementation, you'd send this to a backend service
    toast({
      title: "Request Submitted!",
      description: "Your access request has been submitted. You'll hear back from Yash soon.",
    });
    
    setWaitlistEmail('');
    setWaitlistName('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Animated Logo Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-white animate-fade-in">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent animate-pulse">
                Product Stories
              </span>
            </h1>
            <p className="text-white/60 text-sm animate-fade-in" style={{ animationDelay: '0.3s' }}>
              by <span className="text-white/80 font-medium">Yash</span>
            </p>
          </div>
          
          {/* LinkedIn Connect Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="outline"
              className="bg-white/5 border-white/20 text-white hover:bg-white/10 transition-all duration-300 group"
              onClick={() => window.open('https://www.linkedin.com/in/yashdeepsingh/', '_blank')}
            >
              <Linkedin className="w-4 h-4 mr-2 text-blue-400" />
              Connect on LinkedIn
              <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Button>
          </div>

          {/* Access Message */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <p className="text-white/70 text-sm leading-relaxed">
              Product Stories is an invite-only platform for product enthusiasts and storytellers.
              <span className="block mt-1 text-white/50 text-xs">
                Request access below or connect with Yash on LinkedIn.
              </span>
            </p>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">Access Portal</CardTitle>
            <CardDescription className="text-white/70">
              Sign in with your invitation or request access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/5">
                <TabsTrigger value="login" className="text-white data-[state=active]:bg-white/20">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="request" className="text-white data-[state=active]:bg-white/20">
                  Request Access
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login" className="space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-white">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your invited email"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-white/50" />
                        ) : (
                          <Eye className="h-4 w-4 text-white/50" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    disabled={loading}
                  >
                    {loading ? "Signing in..." : "Sign In"}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="request" className="space-y-4">
                <form onSubmit={handleWaitlistRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-name" className="text-white">Full Name (Optional)</Label>
                    <Input
                      id="waitlist-name"
                      type="text"
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waitlist-email" className="text-white">Email</Label>
                    <Input
                      id="waitlist-email"
                      type="email"
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-3">
                    <p className="text-white/60 text-sm">
                      By requesting access, you'll be added to our waitlist. Yash will review your request and send you an invitation if accepted.
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
                    disabled={loading}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    {loading ? "Submitting..." : "Request Access"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
