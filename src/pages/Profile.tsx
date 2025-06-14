
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, Rss, CreditCard } from "lucide-react";
import UserProfileSettings from "@/components/profile/UserProfileSettings";
import TopicManager from "@/components/profile/TopicManager";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const Profile = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cred-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cred-teal"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-cred-black">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-cred-gray-100">
              Profile Settings
            </h1>
            <p className="text-lg text-cred-gray-400">
              Manage your personalized news experience and preferences.
            </p>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="topics" className="space-y-6">
            <TabsList className="bg-cred-surface border-cred-gray-700">
              <TabsTrigger 
                value="topics" 
                className="flex items-center gap-2 data-[state=active]:bg-cred-gray-800 data-[state=active]:text-cred-gray-100"
              >
                <Rss className="w-4 h-4" />
                Topics & RSS
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex items-center gap-2 data-[state=active]:bg-cred-gray-800 data-[state=active]:text-cred-gray-100"
              >
                <Settings className="w-4 h-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger 
                value="credits" 
                className="flex items-center gap-2 data-[state=active]:bg-cred-gray-800 data-[state=active]:text-cred-gray-100"
              >
                <CreditCard className="w-4 h-4" />
                Credits
              </TabsTrigger>
            </TabsList>

            <TabsContent value="topics" className="space-y-6">
              <TopicManager />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <UserProfileSettings />
            </TabsContent>

            <TabsContent value="credits" className="space-y-6">
              <Card className="cred-surface-elevated border-cred-gray-700">
                <CardHeader>
                  <CardTitle className="text-cred-gray-100 flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-cred-gold" />
                    Credit Management
                  </CardTitle>
                  <CardDescription className="text-cred-gray-400">
                    View your credit usage and transaction history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <p className="text-cred-gray-500">
                      Credit management features coming soon...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
