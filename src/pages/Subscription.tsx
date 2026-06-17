import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {

  Check,

  Shield,

  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PLANS = [
  {
    key: "starter" as const,
    name: "Starter",
    monthly: 149,
    yearly: 1425,
    desc: "Perfect for individuals just getting started",
    features: [
      "1 Business Profile",
      "5 Active Events",
      "Basic Analytics",
      "Email Support",
    ],
    highlighted: false,
  },
  {
    key: "professional" as const,
    name: "Professional",
    monthly: 499,
    yearly: 4788,
    desc: "Best for growing businesses",
    features: [
      "5 Business Profiles",
      "Unlimited Events",
      "Advanced Analytics",
      "Priority Support",
      "Custom Domain",
    ],
    highlighted: true,
  },
  {
    key: "enterprise" as const,
    name: "Enterprise",
    monthly: 1699,
    yearly: 16311,
    desc: "For businesses with advanced needs",
    features: [
      "Unlimited Business Profiles",
      "Unlimited Events",
      "Full Analytics Suite",
      "Dedicated Support",
      "API Access",
      "White-label Option",
    ],
    highlighted: false,
  },
];

export default function Subscription() {
  const { toast } = useToast();
  const { user } = useAuth();
  const utils = trpc.useUtils();
  const [yearly, setYearly] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  const { data: subscription } =
    trpc.subscription.mySubscription.useQuery(undefined, {
      enabled: !!user,
    });

  const subscribeMutation = trpc.subscription.subscribe.useMutation({
    onSuccess: (data) => {
      utils.subscription.mySubscription.invalidate();
      toast({ title: `Subscribed to ${data.planName} plan!` });
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const cancelMutation = trpc.subscription.cancel.useMutation({
    onSuccess: () => {
      utils.subscription.mySubscription.invalidate();
      toast({ title: "Subscription cancelled" });
      setIsCancelOpen(false);
    },
    onError: (err) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const isSubscribed = subscription?.status === "active";
  const currentPlan = subscription?.planName || "Free";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1917]">Subscription</h1>
        <p className="text-[#78716C] text-sm mt-0.5">
          Manage your plan and billing
        </p>
      </div>

      {/* Current Plan Card */}
      {isSubscribed && (
        <Card className="border-[#4F46E5] bg-[#EEF2FF]/50">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#4F46E5] flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-[#78716C]">Current Plan</p>
                <p className="text-xl font-semibold text-[#1C1917]">
                  {currentPlan}
                </p>
                <p className="text-xs text-[#4F46E5]">
                  Renews on{" "}
                  {subscription?.currentPeriodEnd
                    ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-[#DC2626] text-[#DC2626] hover:bg-[#FFF1F2]"
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4 py-2">
        <span
          className={`text-sm ${!yearly ? "text-[#1C1917] font-medium" : "text-[#78716C]"}`}
        >
          Monthly
        </span>
        <Switch checked={yearly} onCheckedChange={setYearly} />
        <span
          className={`text-sm ${yearly ? "text-[#1C1917] font-medium" : "text-[#78716C]"}`}
        >
          Yearly
          <Badge
            variant="secondary"
            className="ml-2 bg-[#ECFDF5] text-[#059669] hover:bg-[#ECFDF5] text-[10px]"
          >
            Save 20%
          </Badge>
        </span>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrent = currentPlan === plan.name;
          const price = yearly ? plan.yearly : plan.monthly;
          const period = yearly ? "/year" : "/month";

          return (
            <Card
              key={plan.key}
              className={`border-2 transition-all hover:shadow-lg ${
                plan.highlighted
                  ? "border-[#4F46E5] shadow-md relative"
                  : "border-[#E7E5E4]"
              } ${isCurrent ? "ring-2 ring-[#4F46E5] ring-offset-2" : ""}`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#4F46E5] text-white hover:bg-[#4F46E5] px-3">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-[#1C1917]">
                  {plan.name}
                </CardTitle>
                <p className="text-[#78716C] text-xs">{plan.desc}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[#1C1917]">
                    R{price}
                  </span>
                  <span className="text-[#78716C]">{period}</span>
                </div>

                <ul className="space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-[#059669] shrink-0 mt-0.5" />
                      <span className="text-[#57534E]">{f}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isCurrent
                      ? "bg-[#ECFDF5] text-[#059669] hover:bg-[#D1FAE5]"
                      : plan.highlighted
                      ? "bg-[#4F46E5] hover:bg-[#4338CA]"
                      : "bg-white text-[#57534E] border border-[#E7E5E4] hover:bg-[#F5F5F3]"
                  }`}
                  variant={isCurrent ? "default" : plan.highlighted ? "default" : "outline"}
                  disabled={isCurrent || subscribeMutation.isPending}
                  onClick={() =>
                    subscribeMutation.mutate({
                      plan: plan.key,
                      billing: yearly ? "yearly" : "monthly",
                    })
                  }
                >
                  {isCurrent ? (
                    <>
                      <Check className="mr-1 h-4 w-4" />
                      Current Plan
                    </>
                  ) : subscribeMutation.isPending ? (
                    "Processing..."
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#DC2626]">
              <AlertTriangle className="h-5 w-5" />
              Cancel Subscription?
            </DialogTitle>
            <DialogDescription>
              Your subscription will remain active until the end of the current
              billing period ({subscription?.currentPeriodEnd
                ? new Date(subscription.currentPeriodEnd).toLocaleDateString()
                : "N/A"}). After that, you will be downgraded to the free plan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCancelOpen(false)}
              className="border-[#E7E5E4]"
            >
              Keep Plan
            </Button>
            <Button
              variant="destructive"
              onClick={() => cancelMutation.mutate()}
              disabled={cancelMutation.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {cancelMutation.isPending ? "Cancelling..." : "Cancel Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
