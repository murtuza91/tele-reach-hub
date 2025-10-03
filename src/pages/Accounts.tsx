import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Settings } from "lucide-react";
import { mockAccounts } from "@/lib/mockData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

const Accounts = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAccounts = mockAccounts.filter(
    (acc) =>
      acc.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      acc.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success text-success-foreground">Connected</Badge>;
      case "rate-limited":
        return <Badge className="bg-warning text-warning-foreground">Rate Limited</Badge>;
      case "disconnected":
        return <Badge variant="destructive">Disconnected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Accounts</h1>
          <p className="text-muted-foreground">
            Manage your Telegram accounts and settings
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Account
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Connected Accounts</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Daily Usage</TableHead>
                <TableHead>Settings</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{account.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {account.handle}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(account.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-2 min-w-[200px]">
                      <div className="flex justify-between text-sm">
                        <span>
                          {account.sentToday} / {account.dailyLimit}
                        </span>
                        <span className="text-muted-foreground">
                          {Math.round((account.sentToday / account.dailyLimit) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(account.sentToday / account.dailyLimit) * 100}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm space-y-1">
                      <p>Delay: {account.settings.delaySeconds}s</p>
                      <p>
                        Quiet hours:{" "}
                        {account.settings.respectQuietHours ? "Yes" : "No"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {filteredAccounts.map((account) => (
          <Card key={account.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{account.displayName}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {account.handle}
                  </p>
                </div>
                {getStatusBadge(account.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Daily Progress</p>
                <Progress
                  value={(account.sentToday / account.dailyLimit) * 100}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {account.sentToday} of {account.dailyLimit} messages sent
                </p>
              </div>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delay:</span>
                  <span className="font-medium">
                    {account.settings.delaySeconds}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quiet hours:</span>
                  <span className="font-medium">
                    {account.settings.respectQuietHours ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last sent:</span>
                  <span className="font-medium">
                    {account.settings.lastSentAt
                      ? new Date(account.settings.lastSentAt).toLocaleTimeString()
                      : "Never"}
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Configure
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
