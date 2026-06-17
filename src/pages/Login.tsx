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

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const loginMutation = trpc.localAuth.login.useMutation({
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
      setError("Please fill in all fields");
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex bg-[#FAFAF8]">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#EDE9FE] via-[#F5F3FF] to-[#ECFDF5] items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-[#EDE9FE]/80 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#ECFDF5]/60 rounded-full blur-3xl" />
        <div className="relative z-10 max-w-md">
          <Store className="h-12 w-12 text-[#4F46E5] mb-6" />
          <h2 className="text-3xl font-bold text-[#1C1917] mb-4">
            Welcome to Kasi BusinessHub
          </h2>
          <p className="text-[#57534E] leading-relaxed">
            South Africa's leading platform for business owners. Manage your business
            profiles, organise events, and reach your customers — all from one
            beautiful dashboard.
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-[#78716C]">
              Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              className="w-full bg-white text-[#1C1917] border border-[#E7E5E4] hover:bg-[#F5F5F3] h-11"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Sign in with Kimi
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#E7E5E4]" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FAFAF8] px-3 text-[#A8A29E]">
                  or continue with username
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-[#57534E] text-sm">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-11 border-[#E7E5E4] bg-white focus-visible:ring-[#4F46E5]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#57534E] text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 border-[#E7E5E4] bg-white pr-10 focus-visible:ring-[#4F46E5]"
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

              {error && (
                <p className="text-[#DC2626] text-sm">{error}</p>
              )}

              <Button
                type="submit"
                className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-11"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-sm text-[#78716C]">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="text-[#4F46E5] hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
