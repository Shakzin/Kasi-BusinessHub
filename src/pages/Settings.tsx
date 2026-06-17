import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Lock,
  Bell,
  Palette,
  Camera,
  Trash2,
  Save,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  const [profile, setProfile] = useState({
    name: user?.name || "",
    bio: "",
  });

  const [notifications, setNotifications] = useState({
    emailEvents: true,
    marketing: false,
    weeklyDigest: true,
  });

  const handleSaveProfile = () => {
    toast({ title: "Profile updated successfully" });
  };

  const handleDeleteAccount = () => {
    if (deleteConfirm !== "DELETE") {
      toast({ title: "Please type DELETE to confirm", variant: "destructive" });
      return;
    }
    logout();
    toast({ title: "Account deleted" });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1917]">Settings</h1>
        <p className="text-[#78716C] text-sm mt-0.5">
          Manage your account preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border border-[#E7E5E4]">
          <TabsTrigger value="profile" className="gap-1.5">
            <User className="h-3.5 w-3.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5">
            <Bell className="h-3.5 w-3.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-1.5">
            <Palette className="h-3.5 w-3.5" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="account" className="gap-1.5">
            <Lock className="h-3.5 w-3.5" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-lg">Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and public profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 border-2 border-[#E7E5E4]">
                  <AvatarFallback className="text-2xl bg-[#EEF2FF] text-[#4F46E5]">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="outline"
                  className="border-[#E7E5E4] text-[#57534E]"
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Change Avatar
                </Button>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    value={profile.name}
                    onChange={(e) =>
                      setProfile({ ...profile, name: e.target.value })
                    }
                    className="border-[#E7E5E4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={user?.email || ""}
                    disabled
                    className="border-[#E7E5E4] bg-[#F5F5F3]"
                  />
                  <p className="text-xs text-[#A8A29E]">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={profile.bio}
                    onChange={(e) =>
                      setProfile({ ...profile, bio: e.target.value })
                    }
                    placeholder="Tell us about yourself..."
                    className="border-[#E7E5E4] min-h-[80px]"
                  />
                </div>

                <Button
                  className="bg-[#4F46E5] hover:bg-[#4338CA]"
                  onClick={handleSaveProfile}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications">
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-lg">Notification Preferences</CardTitle>
              <CardDescription>
                Choose what notifications you want to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                {
                  key: "emailEvents",
                  label: "Event Reminders",
                  desc: "Get notified about upcoming events",
                },
                {
                  key: "marketing",
                  label: "Marketing Emails",
                  desc: "Receive updates about new features and offers",
                },
                {
                  key: "weeklyDigest",
                  label: "Weekly Digest",
                  desc: "Get a weekly summary of your activity",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="text-sm font-medium text-[#1C1917]">
                      {item.label}
                    </p>
                    <p className="text-xs text-[#78716C]">{item.desc}</p>
                  </div>
                  <Switch
                    checked={
                      notifications[item.key as keyof typeof notifications]
                    }
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        [item.key]: checked,
                      })
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Tab */}
        <TabsContent value="appearance">
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-lg">Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of your dashboard.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger className="border-[#E7E5E4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select defaultValue="en">
                  <SelectTrigger className="border-[#E7E5E4]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account">
          <Card className="border-[#E7E5E4]">
            <CardHeader>
              <CardTitle className="text-lg">Account Security</CardTitle>
              <CardDescription>
                Manage your account security and data.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Account Type</Label>
                  <Input
                    value={
                      user?.authType === "oauth"
                        ? "OAuth (Kimi)"
                        : "Username/Password"
                    }
                    disabled
                    className="border-[#E7E5E4] bg-[#F5F5F3]"
                  />
                </div>

                {user?.authType === "local" && (
                  <>
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter current password"
                        className="border-[#E7E5E4]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        className="border-[#E7E5E4]"
                      />
                    </div>
                    <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
                      Update Password
                    </Button>
                  </>
                )}
              </div>

              <div className="pt-6 border-t border-[#E7E5E4]">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-[#DC2626]">
                    Danger Zone
                  </h4>
                  <p className="text-xs text-[#78716C]">
                    Once you delete your account, there is no going back. This
                    will permanently delete all your data.
                  </p>
                  <Button
                    variant="outline"
                    className="border-[#DC2626] text-[#DC2626] hover:bg-[#FFF1F2] mt-2"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Account Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-[#DC2626]">Delete Account?</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all associated data
              including businesses and events. Type DELETE to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="border-[#E7E5E4]"
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDeleteOpen(false);
                setDeleteConfirm("");
              }}
              className="border-[#E7E5E4]"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
