
import { Link } from "react-router-dom";
import { ArrowLeft, Crown, Star, Award, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AlfredSingh = () => {
  const achievements = [
    {
      title: "Leadership Excellence Award",
      year: "2023",
      description: "Recognized for outstanding leadership and team management skills"
    },
    {
      title: "Innovation Champion",
      year: "2022",
      description: "Led groundbreaking initiatives that transformed business processes"
    },
    {
      title: "Community Impact Award",
      year: "2021",
      description: "Acknowledged for significant contributions to local community development"
    }
  ];

  const timeline = [
    {
      year: "2020",
      title: "Started Professional Journey",
      description: "Began career with focus on strategic development and leadership"
    },
    {
      year: "2021",
      title: "First Major Project",
      description: "Successfully led a cross-functional team on a critical business initiative"
    },
    {
      year: "2022",
      title: "Expansion Phase",
      description: "Took on broader responsibilities and mentored junior team members"
    },
    {
      year: "2023",
      title: "Current Focus",
      description: "Leading strategic initiatives and driving organizational growth"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Header */}
      <div className="container mx-auto px-6 py-8">
        <Button asChild variant="ghost" className="text-white hover:bg-white/10">
          <Link to="/" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-4 py-2 text-orange-300 text-sm">
            <Crown className="w-4 h-4" />
            Featured Profile
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white">
            Alfred
            <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent"> Singh</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Strategic Leader • Innovation Driver • Community Builder
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-red-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <Crown className="w-16 h-16 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Alfred Singh</h2>
                  <p className="text-white/60 mb-4">Strategic Leader</p>
                  
                  <div className="space-y-3 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      alfred@example.com
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      +1 (555) 123-4567
                    </div>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    Contact Alfred
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Experience</span>
                    <Badge className="bg-orange-500/20 text-orange-400">4+ Years</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Projects Led</span>
                    <Badge className="bg-orange-500/20 text-orange-400">25+</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Team Size</span>
                    <Badge className="bg-orange-500/20 text-orange-400">15+ Members</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Success Rate</span>
                    <Badge className="bg-green-500/20 text-green-400">98%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* About */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">About Alfred Singh</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed mb-4">
                    Alfred Singh is a visionary leader with over 4 years of experience in strategic development and team management. 
                    His passion for innovation and commitment to excellence have made him a respected figure in his field.
                  </p>
                  <p className="text-white/70 leading-relaxed">
                    Known for his ability to bring together diverse teams and drive complex projects to successful completion, 
                    Alfred has consistently delivered results that exceed expectations while maintaining the highest standards of quality and integrity.
                  </p>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                          <Star className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-white font-semibold">{achievement.title}</h3>
                          <Badge className="bg-orange-500/20 text-orange-400">{achievement.year}</Badge>
                        </div>
                        <p className="text-white/70">{achievement.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Professional Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {timeline.map((item, index) => (
                    <div key={index} className="relative">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 relative">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{item.year}</span>
                          </div>
                          {index < timeline.length - 1 && (
                            <div className="absolute top-10 left-5 w-0.5 h-6 bg-white/20"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="text-white font-semibold mb-1">{item.title}</h3>
                          <p className="text-white/70">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card className="bg-gradient-to-r from-orange-600/20 to-red-600/20 backdrop-blur-sm border-orange-500/20">
                <CardContent className="p-8 text-center">
                  <h3 className="text-2xl font-bold text-white mb-4">Work with Alfred</h3>
                  <p className="text-white/70 mb-6 max-w-md mx-auto">
                    Interested in collaborating or learning more about Alfred's work? Get in touch to explore opportunities.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                      Schedule a Meeting
                    </Button>
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      View Portfolio
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlfredSingh;
