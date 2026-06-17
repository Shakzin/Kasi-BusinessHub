import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { trpc } from "@/providers/trpc";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);
  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);
  return url.toString();
}

export default function Register() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const registerMutation = trpc.localAuth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("local_auth_token", data.token);
      window.location.href = "/dashboard";
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }
    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    registerMutation.mutate({
      username,
      password,
      displayName: displayName || undefined,
      email: email || undefined,
    });
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#ECFDF5] via-[#F0FDF4] to-[#EDE9FE] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 right-10 w-64 h-64 bg-[#ECFDF5]/80 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#EDE9FE]/60 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md">
          <Store className="h-12 w-12 text-[#4F46E5] mb-6" />
          <h2 className="text-3xl font-bold text-[#1C1917] mb-4">
            Start Your Journey
          </h2>
          <p className="text-[#57534E] leading-relaxed">
            Join thousands of South African business owners on Kasi BusinessHub. Create your
            account today and start managing your business presence professionally.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-sm border-[#E7E5E4] shadow-none bg-transparent">
          <CardHeader className="text-center pb-4">
            <div className="lg:hidden flex justify-center mb-4">
              <Store className="h-10 w-10 text-[#4F46E5]" />
            </div>
            <CardTitle className="text-2xl font-semibold text-[#1C1917]">
              Create Account
            </CardTitle>
            <CardDescription className="text-[#78716C]">
              Start your Kasi BusinessHub journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-white text-[#1C1917] border border-[#E7E5E4] hover:bg-[#F5F5F3] h-11"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Sign up with Kimi
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E7E5E4]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FAFAF8] px-3 text-[#A8A29E]">
                  or create with username
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#57534E] text-sm">
                  Username <span className="text-[#DC2626]">*</span>
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 border-[#E7E5E4] bg-white focus-visible:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-[#57534E] text-sm">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="How should we call you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="h-10 border-[#E7E5E4] bg-white focus-visible:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[#57534E] text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 border-[#E7E5E4] bg-white focus-visible:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#57534E] text-sm">
                  Password <span className="text-[#DC2626]">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 border-[#E7E5E4] bg-white pr-10 focus-visible:ring-[#4F46E5]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8A29E] hover:text-[#57534E]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#57534E] text-sm">
                  Confirm Password <span className="text-[#DC2626]">*</span>
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 border-[#E7E5E4] bg-white focus-visible:ring-[#4F46E5]"
                />
              </div>

              {error && <p className="text-[#DC2626] text-sm">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-11"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#78716C]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-[#4F46E5] hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
