
import { Link } from "react-router-dom";
import { ArrowLeft, MapPin, Mail, Github, Linkedin, Download, Code, Briefcase, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const AboutMe = () => {
  const skills = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", 
    "AWS", "Docker", "Git", "Tailwind CSS", "Next.js", "Supabase"
  ];

  const experiences = [
    {
      title: "Senior Developer",
      company: "Tech Company",
      period: "2022 - Present",
      description: "Leading development of scalable web applications and mentoring junior developers."
    },
    {
      title: "Full Stack Developer",
      company: "Startup Inc",
      period: "2020 - 2022",
      description: "Built and maintained multiple client projects using modern web technologies."
    }
  ];

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

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 items-start">
            {/* Profile */}
            <div className="md:col-span-1">
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">YN</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Your Name</h2>
                  <p className="text-white/60 mb-4">Full Stack Developer</p>
                  
                  <div className="space-y-3 text-sm text-white/60">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="w-4 h-4" />
                      San Francisco, CA
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <Mail className="w-4 h-4" />
                      your@email.com
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 mt-6">
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Github className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                      <Linkedin className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="md:col-span-2 space-y-8">
              {/* About */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="w-5 h-5" />
                    About Me
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/70 leading-relaxed">
                    Passionate full-stack developer with 5+ years of experience building scalable web applications. 
                    I love creating elegant solutions to complex problems and am always eager to learn new technologies. 
                    My expertise spans frontend and backend development, with a focus on user experience and performance optimization.
                  </p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Technical Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <Badge key={skill} variant="secondary" className="bg-white/10 text-white hover:bg-white/20">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={index} className="border-l-2 border-white/20 pl-4">
                      <h3 className="text-white font-semibold">{exp.title}</h3>
                      <p className="text-blue-400">{exp.company}</p>
                      <p className="text-white/60 text-sm">{exp.period}</p>
                      <p className="text-white/70 mt-2">{exp.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="bg-white/5 backdrop-blur-sm border-white/10">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border-l-2 border-white/20 pl-4">
                    <h3 className="text-white font-semibold">Bachelor of Science in Computer Science</h3>
                    <p className="text-blue-400">University Name</p>
                    <p className="text-white/60 text-sm">2016 - 2020</p>
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

export default AboutMe;
