import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  TrendingUp,



  Clock,
} from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export default function Admin() {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isLoading, isAdmin, navigate]);

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(
    undefined,
    { enabled: isAdmin }
  );

  const { data: usersData } = trpc.admin.users.useQuery(
    { page: 1, limit: 10 },
    { enabled: isAdmin }
  );

  const { data: activityData } = trpc.admin.recentActivity.useQuery(
    { limit: 10 },
    { enabled: isAdmin }
  );

  const { data: feedbackData } = trpc.admin.feedbackList.useQuery(
    { page: 1, limit: 10 },
    { enabled: isAdmin }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#78716C]">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) return null;

  const metrics = [
    {
      title: "Total Users",
      value: stats?.totalUsers ?? 0,
      icon: Users,
      color: "bg-[#EEF2FF] text-[#4F46E5]",
      trend: stats?.recentSignups ?? 0,
      trendLabel: "new this week",
    },
    {
      title: "Businesses",
      value: stats?.totalBusinesses ?? 0,
      icon: Building2,
      color: "bg-[#ECFDF5] text-[#059669]",
      trend: null,
    },
    {
      title: "Events",
      value: stats?.totalEvents ?? 0,
      icon: Calendar,
      color: "bg-[#EFF6FF] text-[#2563EB]",
      trend: null,
    },
    {
      title: "Monthly Revenue",
      value: `$${stats?.totalRevenue ?? 0}`,
      icon: DollarSign,
      color: "bg-[#FFFBEB] text-[#D97706]",
      trend: stats?.activeSubscriptions ?? 0,
      trendLabel: "active subs",
    },
  ];

  const categoryColors: Record<string, string> = {
    Restaurant: "bg-[#EEF2FF] text-[#4F46E5]",
    Retail: "bg-[#ECFDF5] text-[#059669]",
    Services: "bg-[#EFF6FF] text-[#2563EB]",
    Technology: "bg-[#FFFBEB] text-[#D97706]",
    Health: "bg-[#FFF1F2] text-[#DC2626]",
    Education: "bg-[#F5F3FF] text-[#7C3AED]",
    Entertainment: "bg-[#FDF2F8] text-[#DB2777]",
    Other: "bg-[#F5F5F4] text-[#78716C]",
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1C1917]">Admin Dashboard</h1>
        <p className="text-[#78716C] text-sm mt-0.5">
          Platform analytics and management
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.title} className="border-[#E7E5E4]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-[#78716C]">{metric.title}</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16" />
                  ) : (
                    <p className="text-2xl font-semibold text-[#1C1917] font-mono">
                      {metric.value}
                    </p>
                  )}
                  {metric.trend !== null && (
                    <p className="text-xs text-[#059669] flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {metric.trend} {metric.trendLabel}
                    </p>
                  )}
                </div>
                <div
                  className={`w-10 h-10 rounded-lg ${metric.color} flex items-center justify-center`}
                >
                  <metric.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Categories Breakdown */}
        <Card className="border-[#E7E5E4]">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#1C1917]">
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!stats?.categories?.length ? (
              <p className="text-[#78716C] text-sm text-center py-4">
                No data yet
              </p>
            ) : (
              <div className="space-y-3">
                {stats.categories.map((cat) => (
                  <div
                    key={cat.category}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full ${
                          categoryColors[cat.category] ||
                          "bg-[#F5F5F4] text-[#78716C]"
                        }`}
                      >
                        {cat.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-[#F5F5F4] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#4F46E5] rounded-full transition-all"
                          style={{
                            width: `${Math.min(
                              (cat.count /
                                Math.max(
                                  ...stats.categories.map((c) => c.count)
                                )) *
                                100,
                              100
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#1C1917] w-6 text-right">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card className="border-[#E7E5E4] lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-[#1C1917]">
              Recent Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!usersData?.items?.length ? (
              <p className="text-[#78716C] text-sm text-center py-4">
                No users yet
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-[#E7E5E4]">
                    <TableHead className="text-[#78716C] text-xs uppercase">
                      User
                    </TableHead>
                    <TableHead className="text-[#78716C] text-xs uppercase">
                      Role
                    </TableHead>
                    <TableHead className="text-[#78716C] text-xs uppercase">
                      Joined
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usersData.items.map((u) => (
                    <TableRow
                      key={u.id}
                      className="border-[#E7E5E4] hover:bg-[#F5F5F3]"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center text-xs font-medium text-[#4F46E5]">
                            {u.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#1C1917]">
                              {u.name}
                            </p>
                            <p className="text-xs text-[#A8A29E]">{u.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] ${
                            u.role === "admin"
                              ? "bg-[#EEF2FF] text-[#4F46E5]"
                              : "bg-[#F5F5F4] text-[#78716C]"
                          }`}
                        >
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-[#A8A29E]">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="border-[#E7E5E4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1C1917]">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!activityData?.length ? (
            <p className="text-[#78716C] text-sm text-center py-4">
              No activity yet
            </p>
          ) : (
            <div className="space-y-3">
              {activityData.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F5F5F3] transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#EEF2FF] flex items-center justify-center shrink-0">
                    <Clock className="h-4 w-4 text-[#4F46E5]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1C1917]">
                      <span className="font-medium">
                        {log.userName || "Anonymous"}
                      </span>{" "}
                      {log.action}{" "}
                      {log.entityName && (
                        <span className="text-[#4F46E5]">{log.entityName}</span>
                      )}
                    </p>
                    <p className="text-xs text-[#A8A29E]">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Feedback */}
      <Card className="border-[#E7E5E4]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-[#1C1917]">
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!feedbackData?.items?.length ? (
            <p className="text-[#78716C] text-sm text-center py-4">
              No feedback yet
            </p>
          ) : (
            <div className="space-y-3">
              {feedbackData.items.map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-lg border border-[#E7E5E4] hover:bg-[#F5F5F3] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm text-[#1C1917]">
                        {fb.name}
                      </span>
                      <span className="text-xs text-[#A8A29E]">{fb.email}</span>
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[10px] bg-[#F5F5F4] text-[#78716C]"
                    >
                      {fb.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#57534E]">{fb.message}</p>
                  <p className="text-xs text-[#A8A29E] mt-2">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
