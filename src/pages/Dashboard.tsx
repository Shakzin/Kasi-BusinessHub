import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Building2,
  Calendar,
  Eye,
  CreditCard,
  Plus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const ownerId = user?.unionId || String(user?.id);

  const { data: businessStats, isLoading: bizLoading } =
    trpc.business.stats.useQuery(undefined, { enabled: !!user });

  const { data: eventStats, isLoading: evtLoading } =
    trpc.event.stats.useQuery(undefined, { enabled: !!user });

  const { data: subscription } = trpc.subscription.mySubscription.useQuery(
    undefined,
    { enabled: !!user }
  );

  const { data: recentBusinesses } = trpc.business.list.useQuery(
    { ownerId, limit: 5 },
    { enabled: !!user && !!ownerId }
  );

  const { data: upcomingEvents } = trpc.event.list.useQuery(
    { ownerId, upcoming: true, limit: 5 },
    { enabled: !!user && !!ownerId }
  );



  // Log activity
  useEffect(() => {
    if (user) {
      trpc.activityLog.create.useMutation().mutate({
        userId: ownerId,
        userName: user.name,
        action: "page_view",
        entityType: "dashboard",
        entityName: "Dashboard",
      });
    }
  }, [user]);

  const stats = [
    {
      title: "Businesses",
      value: businessStats?.total ?? 0,
      icon: Building2,
      color: "bg-[#EEF2FF] text-[#4F46E5]",
      link: "/businesses",
    },
    {
      title: "Events",
      value: eventStats?.total ?? 0,
      sub: `${eventStats?.upcoming ?? 0} upcoming`,
      icon: Calendar,
      color: "bg-[#ECFDF5] text-[#059669]",
      link: "/events",
    },
    {
      title: "Total Views",
      value: businessStats?.totalViews ?? 0,
      icon: Eye,
      color: "bg-[#EFF6FF] text-[#2563EB]",
      link: "/businesses",
    },
    {
      title: "Plan",
      value: subscription?.planName || "Free",
      icon: CreditCard,
      color: "bg-[#FFFBEB] text-[#D97706]",
      link: "/subscription",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1917]">Dashboard</h1>
        <p className="text-[#78716C] mt-1">
          Welcome back, {user?.name?.split(" ")[0] || "there"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card
            key={stat.title}
            className="border-[#E7E5E4] hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(stat.link)}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[#78716C]">{stat.title}</p>
                  {bizLoading || evtLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-[#1C1917] font-mono">
                      {stat.value}
                    </p>
                  )}
                  {stat.sub && (
                    <p className="text-xs text-[#059669]">{stat.sub}</p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}
                >
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Businesses */}
        <Card className="border-[#E7E5E4] lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold text-[#1C1917]">
              Recent Businesses
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#4F46E5] hover:text-[#4338CA] hover:bg-[#EEF2FF]"
              onClick={() => navigate("/businesses")}
            >
              View All
              <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {!recentBusinesses?.items?.length ? (
              <div className="text-center py-10">
                <Building2 className="h-10 w-10 text-[#E7E5E4] mx-auto mb-3" />
                <p className="text-[#78716C] text-sm mb-3">
                  No businesses yet
                </p>
                <Button
                  size="sm"
                  className="bg-[#4F46E5] hover:bg-[#4338CA]"
                  onClick={() => navigate("/businesses")}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Your First Business
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentBusinesses.items.map((biz) => (
                  <div
                    key={biz.id}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                    onClick={() => navigate("/businesses")}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EDE9FE] to-[#F5F3FF] flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-[#4F46E5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1917] truncate">
                        {biz.name}
                      </p>
                      <p className="text-xs text-[#A8A29E]">
                        {biz.category}
                      </p>
                    </div>
                    <span className="text-xs text-[#A8A29E]">
                      {new Date(biz.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="border-[#E7E5E4]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg font-semibold text-[#1C1917]">
              Upcoming Events
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#4F46E5] hover:text-[#4338CA] hover:bg-[#EEF2FF]"
              onClick={() => navigate("/events")}
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {!upcomingEvents?.items?.length ? (
              <div className="text-center py-10">
                <Calendar className="h-10 w-10 text-[#E7E5E4] mx-auto mb-3" />
                <p className="text-[#78716C] text-sm mb-3">
                  No upcoming events
                </p>
                <Button
                  size="sm"
                  className="bg-[#4F46E5] hover:bg-[#4338CA]"
                  onClick={() => navigate("/events")}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Create Event
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.items.map((evt) => (
                  <div
                    key={evt.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#F5F5F3] transition-colors cursor-pointer"
                    onClick={() => navigate("/events")}
                  >
                    <div className="w-11 h-11 rounded-lg bg-[#ECFDF5] flex flex-col items-center justify-center shrink-0">
                      <span className="text-xs font-semibold text-[#059669]">
                        {new Date(evt.startDate).toLocaleDateString("en", {
                          day: "numeric",
                        })}
                      </span>
                      <span className="text-[10px] text-[#059669] uppercase">
                        {new Date(evt.startDate).toLocaleDateString("en", {
                          month: "short",
                        })}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#1C1917] truncate">
                        {evt.title}
                      </p>
                      <p className="text-xs text-[#4F46E5]">
                        {evt.businessName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-[#E7E5E4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-[#1C1917]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              className="bg-[#4F46E5] hover:bg-[#4338CA]"
              onClick={() => navigate("/businesses")}
            >
              <Plus className="mr-1 h-4 w-4" />
              Add Business
            </Button>
            <Button
              variant="outline"
              className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F3]"
              onClick={() => navigate("/events")}
            >
              <Calendar className="mr-1 h-4 w-4" />
              Create Event
            </Button>
            <Button
              variant="outline"
              className="border-[#E7E5E4] text-[#57534E] hover:bg-[#F5F5F3]"
              onClick={() => navigate("/subscription")}
            >
              <TrendingUp className="mr-1 h-4 w-4" />
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
