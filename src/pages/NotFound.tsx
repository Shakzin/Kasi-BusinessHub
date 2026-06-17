import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAF8]">
      <div className="text-center max-w-md px-6">
        <div className="w-20 h-20 rounded-2xl bg-[#EEF2FF] flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-[#4F46E5]">404</span>
        </div>
        <h1 className="text-2xl font-semibold text-[#1C1917] mb-2">
          Page Not Found
        </h1>
        <p className="text-[#78716C] mb-8">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/dashboard">
            <Button className="bg-[#4F46E5] hover:bg-[#4338CA]">
              <Home className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Button
            variant="outline"
            className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F3]"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
