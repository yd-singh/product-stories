
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Coins, Settings, Zap } from "lucide-react";
import { useUserProfile, useUpdateProfile } from "@/hooks/useUserProfile";

const UserProfileSettings = () => {
  const { data: profile, isLoading } = useUserProfile();
  const updateProfile = useUpdateProfile();
  
  if (isLoading) {
    return (
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-cred-gray-800 rounded w-1/4"></div>
            <div className="h-4 bg-cred-gray-800 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!profile) return null;

  const handleToggle = (field: string, value: boolean) => {
    updateProfile.mutate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Credits Display */}
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardHeader>
          <CardTitle className="text-cred-gray-100 flex items-center gap-3">
            <Coins className="w-5 h-5 text-cred-gold" />
            Credits Balance
          </CardTitle>
          <CardDescription className="text-cred-gray-400">
            Credits are used for AI features like transcription, research, and content generation.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge className="bg-cred-gold/10 text-cred-gold border-cred-gold/20 text-lg px-4 py-2">
              {profile.credits} Credits
            </Badge>
            {profile.credits < 10 && (
              <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                Low Balance
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Global Settings */}
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardHeader>
          <CardTitle className="text-cred-gray-100 flex items-center gap-3">
            <Settings className="w-5 h-5 text-cred-teal" />
            Global Preferences
          </CardTitle>
          <CardDescription className="text-cred-gray-400">
            These settings apply to all your topics by default.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-transcribe" className="text-cred-gray-200 font-medium">
                Auto Transcribe Audio
              </Label>
              <p className="text-sm text-cred-gray-400">
                Automatically generate audio for new articles
              </p>
            </div>
            <Switch
              id="auto-transcribe"
              checked={profile.auto_transcribe}
              onCheckedChange={(checked) => handleToggle('auto_transcribe', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-broadcast" className="text-cred-gray-200 font-medium">
                Auto Broadcast
              </Label>
              <p className="text-sm text-cred-gray-400">
                Include articles in broadcast automatically
              </p>
            </div>
            <Switch
              id="auto-broadcast"
              checked={profile.auto_broadcast}
              onCheckedChange={(checked) => handleToggle('auto_broadcast', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Indicator */}
      <Card className="cred-surface-elevated border-cred-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-cred-gray-400">
            <Zap className="w-4 h-4 text-cred-teal" />
            <span className="text-sm">
              Profile settings are synced and active
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfileSettings;
