import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TelegramAccount, CopyTemplate, AIPrompt } from '@/types';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateAccount } from '@/store/slices/accountsSlice';
import { toast } from '@/hooks/use-toast';

interface AccountSettingsDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account: TelegramAccount | null;
}

export function AccountSettingsDrawer({ open, onOpenChange, account }: AccountSettingsDrawerProps) {
  const dispatch = useAppDispatch();
  const templates = useAppSelector((state) => state.templates.items);
  const prompts = useAppSelector((state) => state.prompts.items);
  const [formData, setFormData] = useState({
    dailyLimit: 100,
    delaySeconds: 60,
    activeTemplateId: null as string | null,
    activePromptId: null as string | null,
    respectQuietHours: true,
  });

  useEffect(() => {
    if (account) {
      setFormData({
        dailyLimit: account.dailyLimit,
        delaySeconds: account.settings.delaySeconds,
        activeTemplateId: account.settings.activeTemplateId,
        activePromptId: account.settings.activePromptId,
        respectQuietHours: account.settings.respectQuietHours,
      });
    }
  }, [account]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) return;

    dispatch(updateAccount({
      id: account.id,
      updates: {
        dailyLimit: formData.dailyLimit,
        settings: {
          ...account.settings,
          delaySeconds: formData.delaySeconds,
          activeTemplateId: formData.activeTemplateId,
          activePromptId: formData.activePromptId,
          respectQuietHours: formData.respectQuietHours,
        },
      },
    }));

    toast({
      title: "Settings updated",
      description: `Settings for @${account.handle} have been saved`,
    });
    
    onOpenChange(false);
  };

  if (!account) return null;

  const activeTemplates = templates.filter((t: CopyTemplate) => t.isActive);
  const activePrompts = prompts.filter((p: AIPrompt) => p.isActive);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[500px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Account Settings</SheetTitle>
          <SheetDescription>
            Configure outreach settings for @{account.handle}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Message Limit</Label>
              <Input
                id="dailyLimit"
                type="number"
                min="1"
                max="500"
                value={formData.dailyLimit}
                onChange={(e) => setFormData(prev => ({ ...prev, dailyLimit: parseInt(e.target.value) || 100 }))}
              />
              <p className="text-xs text-muted-foreground">
                Maximum messages per day (recommended: 100-150)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delaySeconds">Delay Between Messages</Label>
              <div className="flex gap-2">
                <Input
                  id="delaySeconds"
                  type="number"
                  min="30"
                  max="3600"
                  value={formData.delaySeconds}
                  onChange={(e) => setFormData(prev => ({ ...prev, delaySeconds: parseInt(e.target.value) || 60 }))}
                  className="flex-1"
                />
                <span className="flex items-center text-sm text-muted-foreground">seconds</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {formData.delaySeconds >= 60 
                  ? `${Math.floor(formData.delaySeconds / 60)} minute${Math.floor(formData.delaySeconds / 60) > 1 ? 's' : ''}`
                  : `${formData.delaySeconds} seconds`}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="template">Active Copy Template</Label>
              <Select
                value={formData.activeTemplateId || 'none'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  activeTemplateId: value === 'none' ? null : value 
                }))}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (use campaign default)</SelectItem>
                  {activeTemplates.map((template: CopyTemplate) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Active AI Prompt</Label>
              <Select
                value={formData.activePromptId || 'none'}
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  activePromptId: value === 'none' ? null : value 
                }))}
              >
                <SelectTrigger id="prompt">
                  <SelectValue placeholder="Select prompt" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (use campaign default)</SelectItem>
                  {activePrompts.map((prompt: AIPrompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <Label htmlFor="quietHours">Respect Quiet Hours</Label>
                <p className="text-xs text-muted-foreground">
                  No sends between 10 PM and 8 AM
                </p>
              </div>
              <Switch
                id="quietHours"
                checked={formData.respectQuietHours}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, respectQuietHours: checked }))}
              />
            </div>
          </div>
          <SheetFooter className="gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Settings</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
