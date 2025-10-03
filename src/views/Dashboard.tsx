import { StatsCard } from "@/components/dashboard/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Users,
  Target,
  Clock,
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "@/store/hooks";

const sendsTrendData = [
  { date: "Mon", sends: 45 },
  { date: "Tue", sends: 67 },
  { date: "Wed", sends: 89 },
  { date: "Thu", sends: 123 },
  { date: "Fri", sends: 156 },
  { date: "Sat", sends: 78 },
  { date: "Sun", sends: 45 },
];

const Dashboard = () => {
  const accounts = useAppSelector((state) => state.accounts.items);
  const campaigns = useAppSelector((state) => state.campaigns.items);
  const messages = useAppSelector((state) => state.messages.items);

  const stats = {
    today: 156,
    thisWeek: 603,
    thisMonth: 2547,
    activeAccounts: accounts.filter((a) => a.status === "connected").length,
    activeCampaigns: campaigns.filter((c) => c.status === "running").length,
    queuedMessages: campaigns.reduce((sum, c) => sum + c.queuedCount, 0),
  };

  const accountPerformanceData = accounts.map((acc) => ({
    name: acc.handle,
    sends: acc.sentToday,
    limit: acc.dailyLimit,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your outreach performance
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Messages Today"
          value={stats.today}
          icon={MessageSquare}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Active Accounts"
          value={stats.activeAccounts}
          icon={Users}
          description={`${accounts.length} total accounts`}
        />
        <StatsCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Target}
          description={`${campaigns.length} total campaigns`}
        />
        <StatsCard
          title="Messages This Week"
          value={stats.thisWeek}
          icon={TrendingUp}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Messages This Month"
          value={stats.thisMonth}
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
        <StatsCard
          title="Queued Messages"
          value={stats.queuedMessages}
          icon={Clock}
          description="Across all campaigns"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Send Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sendsTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="sends"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={accountPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar dataKey="sends" fill="hsl(var(--primary))" />
                <Bar dataKey="limit" fill="hsl(var(--muted))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{campaign.name}</p>
                    <Badge
                      variant={
                        campaign.status === "running"
                          ? "default"
                          : campaign.status === "paused"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {campaign.sentCount} sent • {campaign.queuedCount} queued •{" "}
                    {campaign.failedCount} failed
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {Math.round((campaign.sentCount / campaign.targetCount) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">complete</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
