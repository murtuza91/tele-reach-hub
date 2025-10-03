import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Play, Pause, X } from "lucide-react";
import { mockCampaigns, mockMessages } from "@/lib/mockData";

const Campaigns = () => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "running":
        return <Badge className="bg-success text-success-foreground">Running</Badge>;
      case "paused":
        return <Badge className="bg-warning text-warning-foreground">Paused</Badge>;
      case "completed":
        return <Badge variant="secondary">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      case "draft":
        return <Badge variant="outline">Draft</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground">
            Create and manage your outreach campaigns
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>

      <div className="grid gap-4">
        {mockCampaigns.map((campaign) => {
          const progress = (campaign.sentCount / campaign.targetCount) * 100;
          const campaignMessages = mockMessages.filter(
            (msg) => msg.campaignId === campaign.id
          );

          return (
            <Card key={campaign.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>{campaign.name}</CardTitle>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created {campaign.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {campaign.status === "running" && (
                      <Button variant="outline" size="sm">
                        <Pause className="h-4 w-4" />
                      </Button>
                    )}
                    {campaign.status === "paused" && (
                      <Button variant="outline" size="sm">
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Sent</p>
                    <p className="text-2xl font-bold text-success">
                      {campaign.sentCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Queued</p>
                    <p className="text-2xl font-bold">{campaign.queuedCount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold text-destructive">
                      {campaign.failedCount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Target</p>
                    <p className="text-2xl font-bold">{campaign.targetCount}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Campaign Progress</span>
                    <span className="font-medium">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} />
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm font-medium mb-3">Message Queue</p>
                  <div className="space-y-2">
                    {campaignMessages.slice(0, 5).map((message) => (
                      <div
                        key={message.id}
                        className="flex items-center justify-between text-sm border border-border rounded-md p-2"
                      >
                        <div className="flex items-center gap-3">
                          <Badge
                            variant={
                              message.status === "sent"
                                ? "default"
                                : message.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {message.status}
                          </Badge>
                          <span>{message.recipientName}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">
                            {message.recipientCompany}
                          </span>
                        </div>
                        <span className="text-muted-foreground text-xs">
                          {message.status === "sent" && message.sentAt
                            ? new Date(message.sentAt).toLocaleTimeString()
                            : new Date(message.scheduledFor).toLocaleTimeString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  {campaignMessages.length > 5 && (
                    <Button variant="outline" className="w-full mt-3" size="sm">
                      View all {campaignMessages.length} messages
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Campaigns;
