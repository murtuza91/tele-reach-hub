import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Play, Pause, StopCircle } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { CampaignStatus } from '@/types';
import { CampaignDialog } from '@/components/campaigns/CampaignDialog';
import { toast } from '@/hooks/use-toast';

export default function Campaigns() {
  const { campaigns, startCampaign, pauseCampaign, resumeCampaign, cancelCampaign, messages } = useApp();
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);

  const handleStart = (id: string, name: string) => {
    startCampaign(id);
    toast({
      title: "Campaign started",
      description: `"${name}" is now running`,
    });
  };

  const handlePause = (id: string, name: string) => {
    pauseCampaign(id);
    toast({
      title: "Campaign paused",
      description: `"${name}" has been paused`,
    });
  };

  const handleResume = (id: string, name: string) => {
    resumeCampaign(id);
    toast({
      title: "Campaign resumed",
      description: `"${name}" is now running`,
    });
  };

  const handleCancel = (id: string, name: string) => {
    cancelCampaign(id);
    toast({
      title: "Campaign cancelled",
      description: `"${name}" has been stopped`,
    });
  };

  const getStatusColor = (status: CampaignStatus) => {
    switch (status) {
      case 'running':
        return 'default';
      case 'paused':
        return 'secondary';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'draft':
        return 'outline';
      default:
        return 'secondary';
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
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setCampaignDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {campaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No campaigns created yet</p>
              <Button onClick={() => setCampaignDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => {
            const progress = campaign.targetCount > 0 
              ? (campaign.sentCount / campaign.targetCount) * 100 
              : 0;
            const campaignMessages = messages.filter(m => m.campaignId === campaign.id);

            return (
              <Card key={campaign.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle>{campaign.name}</CardTitle>
                        <Badge variant={getStatusColor(campaign.status)}>
                          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                        </Badge>
                      </div>
                      <CardDescription>
                        Created {new Date(campaign.createdAt).toLocaleDateString()}
                        {campaign.startedAt && ` • Started ${new Date(campaign.startedAt).toLocaleDateString()}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {campaign.status === 'running' ? (
                        <Button variant="outline" size="sm" onClick={() => handlePause(campaign.id, campaign.name)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                      ) : campaign.status === 'paused' ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleResume(campaign.id, campaign.name)}>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleCancel(campaign.id, campaign.name)}>
                            <StopCircle className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        </>
                      ) : campaign.status === 'draft' ? (
                        <Button variant="outline" size="sm" onClick={() => handleStart(campaign.id, campaign.name)}>
                          <Play className="h-4 w-4 mr-2" />
                          Start
                        </Button>
                      ) : null}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 grid-cols-2 sm:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Sent</p>
                      <p className="text-2xl font-bold text-success">{campaign.sentCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Queued</p>
                      <p className="text-2xl font-bold">{campaign.queuedCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Failed</p>
                      <p className="text-2xl font-bold text-destructive">{campaign.failedCount}</p>
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

                  {campaignMessages.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium mb-3">Recent Messages</p>
                      <div className="space-y-2">
                        {campaignMessages.slice(0, 3).map((message) => (
                          <div
                            key={message.id}
                            className="flex items-center justify-between text-sm border rounded-md p-2"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant={message.status === 'sent' ? 'default' : message.status === 'failed' ? 'destructive' : 'secondary'}>
                                {message.status}
                              </Badge>
                              <span>{message.recipientName}</span>
                              <span className="text-muted-foreground hidden sm:inline">•</span>
                              <span className="text-muted-foreground hidden sm:inline">{message.recipientCompany}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {message.sentAt ? new Date(message.sentAt).toLocaleTimeString() : 'Scheduled'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <CampaignDialog
        open={campaignDialogOpen}
        onOpenChange={setCampaignDialogOpen}
      />
    </div>
  );
}
