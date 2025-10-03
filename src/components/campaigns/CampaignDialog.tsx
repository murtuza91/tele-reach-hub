import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';
import { CampaignStatus } from '@/types';

interface CampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CampaignDialog({ open, onOpenChange }: CampaignDialogProps) {
  const { addCampaign, accounts, templates, prompts } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    templateId: '',
    promptId: '',
    selectedAccountIds: [] as string[],
    targetCount: 100,
    dailyCap: 50,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.templateId || formData.selectedAccountIds.length === 0) {
      toast({
        title: "Validation Error",
        description: "Campaign name, template, and at least one account are required",
        variant: "destructive",
      });
      return;
    }

    addCampaign({
      name: formData.name,
      status: 'draft' as CampaignStatus,
      templateId: formData.templateId,
      promptId: formData.promptId || undefined,
      accountIds: formData.selectedAccountIds,
      targetCount: formData.targetCount,
      sentCount: 0,
      queuedCount: formData.targetCount,
      failedCount: 0,
      startedAt: undefined,
      endedAt: undefined,
    });

    toast({
      title: "Campaign created",
      description: `"${formData.name}" is ready to launch`,
    });

    setFormData({
      name: '',
      templateId: '',
      promptId: '',
      selectedAccountIds: [],
      targetCount: 100,
      dailyCap: 50,
    });
    
    onOpenChange(false);
  };

  const activeTemplates = templates.filter(t => t.isActive);
  const activePrompts = prompts.filter(p => p.isActive);
  const connectedAccounts = accounts.filter(a => a.status === 'connected');

  const toggleAccount = (accountId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedAccountIds: prev.selectedAccountIds.includes(accountId)
        ? prev.selectedAccountIds.filter(id => id !== accountId)
        : [...prev.selectedAccountIds, accountId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Campaign</DialogTitle>
          <DialogDescription>
            Set up a new outreach campaign with templates and target accounts.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Q1 Founder Outreach"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Copy Template</Label>
              <Select
                value={formData.templateId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, templateId: value }))}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  {activeTemplates.map(template => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">AI Enhancement Prompt (Optional)</Label>
              <Select
                value={formData.promptId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, promptId: value }))}
              >
                <SelectTrigger id="prompt">
                  <SelectValue placeholder="Select prompt (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {activePrompts.map(prompt => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Select Accounts</Label>
              <div className="border rounded-md p-4 space-y-3">
                {connectedAccounts.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No connected accounts available</p>
                ) : (
                  connectedAccounts.map(account => (
                    <div key={account.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={account.id}
                        checked={formData.selectedAccountIds.includes(account.id)}
                        onCheckedChange={() => toggleAccount(account.id)}
                      />
                      <label
                        htmlFor={account.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        @{account.handle} ({account.displayName})
                      </label>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetCount">Target Contacts</Label>
                <Input
                  id="targetCount"
                  type="number"
                  min="1"
                  value={formData.targetCount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 100 }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dailyCap">Daily Cap</Label>
                <Input
                  id="dailyCap"
                  type="number"
                  min="1"
                  value={formData.dailyCap}
                  onChange={(e) => setFormData(prev => ({ ...prev, dailyCap: parseInt(e.target.value) || 50 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Campaign</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
