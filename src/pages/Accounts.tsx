import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Plus, Settings, Search } from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { AccountStatus, TelegramAccount } from '@/types';
import { AccountDialog } from '@/components/accounts/AccountDialog';
import { AccountSettingsDrawer } from '@/components/accounts/AccountSettingsDrawer';

export default function Accounts() {
  const { accounts } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [accountDialogOpen, setAccountDialogOpen] = useState(false);
  const [settingsDrawerOpen, setSettingsDrawerOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<TelegramAccount | null>(null);

  const handleOpenSettings = (account: TelegramAccount) => {
    setSelectedAccount(account);
    setSettingsDrawerOpen(true);
  };

  const filteredAccounts = accounts.filter(account =>
    account.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: AccountStatus) => {
    switch (status) {
      case 'connected':
        return 'default';
      case 'rate-limited':
        return 'secondary';
      case 'disconnected':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Telegram Accounts</h1>
          <p className="text-muted-foreground">
            Manage your connected accounts and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="gap-2" onClick={() => setAccountDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Connect Account
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search accounts..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAccounts.map((account) => {
            const usagePercentage = (account.sentToday / account.dailyLimit) * 100;
            return (
              <Card key={account.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{account.displayName}</CardTitle>
                      <CardDescription>@{account.handle}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(account.status)}>
                      {account.status === 'connected' ? 'Connected' : 
                       account.status === 'rate-limited' ? 'Rate Limited' : 
                       'Disconnected'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Daily Usage</span>
                      <span className="font-medium">
                        {account.sentToday} / {account.dailyLimit}
                      </span>
                    </div>
                    <Progress value={usagePercentage} />
                  </div>
                  <div className="text-sm space-y-2 pt-2 border-t">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Delay</span>
                      <span className="font-medium">{account.settings.delaySeconds}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quiet Hours</span>
                      <span className="font-medium">
                        {account.settings.respectQuietHours ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenSettings(account)}>
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <AccountDialog
        open={accountDialogOpen}
        onOpenChange={setAccountDialogOpen}
      />

      <AccountSettingsDrawer
        open={settingsDrawerOpen}
        onOpenChange={setSettingsDrawerOpen}
        account={selectedAccount}
      />
    </div>
  );
}
