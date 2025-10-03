import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Play, Pause, StopCircle, Search, Send } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { startCampaign, pauseCampaign, resumeCampaign, cancelCampaign, updateCampaign } from '@/store/slices/campaignsSlice';
import { updateAccount } from '@/store/slices/accountsSlice';
import { addMessage, updateMessage } from '@/store/slices/messagesSlice';
import { CampaignStatus } from '@/types';
import { CampaignDialog } from '@/components/campaigns/CampaignDialog';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Campaigns() {
  const dispatch = useAppDispatch();
  const campaigns = useAppSelector((state) => state.campaigns.items);
  const accounts = useAppSelector((state) => state.accounts.items);
  const messages = useAppSelector((state) => state.messages.items);
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | CampaignStatus>('all');

  const handleStart = (id: string, name: string) => {
    dispatch(startCampaign(id));
    toast({
      title: "Campaign started",
      description: `"${name}" is now running`,
    });
  };

  const handlePause = (id: string, name: string) => {
    dispatch(pauseCampaign(id));
    toast({
      title: "Campaign paused",
      description: `"${name}" has been paused`,
    });
  };

  const handleResume = (id: string, name: string) => {
    dispatch(resumeCampaign(id));
    toast({
      title: "Campaign resumed",
      description: `"${name}" is now running`,
    });
  };

  const handleCancel = (id: string, name: string) => {
    dispatch(cancelCampaign(id));
    toast({
      title: "Campaign cancelled",
      description: `"${name}" has been stopped`,
    });
  };

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c: { name: string; status: CampaignStatus }) => {
      const matchText = c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' ? true : c.status === statusFilter;
      return matchText && matchStatus;
    });
  }, [campaigns, searchQuery, statusFilter]);

  const canSendFromAccount = (accountId: string) => {
    const acc = accounts.find((a: { id: string }) => a.id === accountId);
    if (!acc) return false;
    if (acc.status !== 'connected') return false;
    if (acc.sentToday >= acc.dailyLimit) return false;
    const hour = new Date().getHours();
    if (acc.settings.respectQuietHours && (hour >= 22 || hour < 8)) return false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const last = acc.settings.lastSentAt ? new Date(acc.settings.lastSentAt as any) : undefined;
    if (last) {
      const elapsed = Date.now() - last.getTime();
      if (elapsed < acc.settings.delaySeconds * 1000) return false;
    }
    return true;
  };

  const handleManualSend = (campaignId: string) => {
    const campaign = campaigns.find((c: { id: string }) => c.id === campaignId);
    if (!campaign) return;
    if (campaign.status !== 'running') {
      toast({ title: 'Cannot send', description: 'Campaign is not running', variant: 'destructive' });
      return;
    }
    if (campaign.sentCount >= campaign.targetCount) {
      toast({ title: 'Target reached', description: 'Campaign has already reached its target count', variant: 'destructive' });
      return;
    }

    // Find an eligible account that's not already sending for this campaign
    const eligibleAccountId = campaign.accountIds.find((id: string) => {
      if (!canSendFromAccount(id)) return false;

      // Check if this account already has a "sending" message for this campaign
      const alreadySending = messages.find(m =>
        m.campaignId === campaignId &&
        m.accountId === id &&
        m.status === 'sending'
      );
      return !alreadySending;
    });

    if (!eligibleAccountId) {
      toast({ title: 'No eligible account', description: 'All accounts are at daily limit or already sending', variant: 'destructive' });
      return;
    }

    // Create message with explicit ID
    const messageId = `msg_${Date.now()}_${Math.random()}`;
    const optimistic = {
      id: messageId,
      campaignId,
      accountId: eligibleAccountId,
      recipientName: 'Manual Recipient',
      recipientCompany: 'Manual Company',
      status: 'sending' as const,
      scheduledFor: new Date(),
      sentAt: null,
      errorMessage: null,
    };

    // capture rollback snapshots
    const prevSent = campaign.sentCount;
    const prevSentToday = accounts.find((a: { id: string }) => a.id === eligibleAccountId)!.sentToday;

    // optimistic updates: increment sent and account sentToday, add sending message
    dispatch(updateCampaign({ id: campaignId, updates: { sentCount: campaign.sentCount + 1 } }));
    const acc = accounts.find((a: { id: string }) => a.id === eligibleAccountId)!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dispatch(updateAccount({ id: acc.id, updates: { sentToday: Math.min(acc.dailyLimit, acc.sentToday + 1), settings: { ...acc.settings, lastSentAt: new Date() as any } } }));
    dispatch(addMessage(optimistic));

    setTimeout(() => {
      dispatch(updateMessage({ id: messageId, updates: { status: 'sent', sentAt: new Date().toISOString(), errorMessage: null } }));
      toast({ title: 'Message sent', description: `Sent via @${acc.handle}` });
    }, 2000);
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
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input className="pl-8" placeholder="Search campaigns..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
          <div className="w-full sm:w-48">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="running">Running</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">No campaigns match your filters</p>
              <Button onClick={() => setCampaignDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredCampaigns.map((campaign) => {
            const progress = campaign.targetCount > 0
              ? (campaign.sentCount / campaign.targetCount) * 100
              : 0;
            const campaignMessages = messages.filter((m: { campaignId: string }) => m.campaignId === campaign.id);

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
                      {campaign.status === 'running' && (
                        <Button variant="default" size="sm" onClick={() => handleManualSend(campaign.id)}>
                          <Send className="h-4 w-4 mr-2" />
                          Send Now
                        </Button>
                      )}
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
                        {campaignMessages.slice(0, 5).map((message) => {
                          const account = accounts.find((a) => a.id === message.accountId);
                          return (
                            <div
                              key={message.id}
                              className="flex items-center justify-between text-sm border rounded-md p-3"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <Badge variant={message.status === 'sent' ? 'default' : message.status === 'failed' ? 'destructive' : 'secondary'}>
                                  {message.status}
                                </Badge>
                                <div className="flex flex-col flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">To: {message.recipientName}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <span className="text-sm text-muted-foreground">@{account?.handle || 'Unknown'}</span>
                                  </div>
                                  <span className="text-xs text-muted-foreground">
                                    {message.recipientCompany}
                                  </span>
                                </div>
                              </div>
                              <span className="text-muted-foreground text-xs whitespace-nowrap ml-2">
                                {message.sentAt ? new Date(message.sentAt).toLocaleTimeString() : 'Queued'}
                              </span>
                            </div>
                          );
                        })}
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
