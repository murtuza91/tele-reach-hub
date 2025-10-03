import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TelegramAccount, AccountStatus } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { addAccount, updateAccount } from '@/store/slices/accountsSlice';
import { toast } from '@/hooks/use-toast';

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  account?: TelegramAccount;
}

export function AccountDialog({ open, onOpenChange, account }: AccountDialogProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    handle: '',
    displayName: '',
    phoneNumber: '',
  });

  useEffect(() => {
    if (account) {
      setFormData({
        handle: account.handle,
        displayName: account.displayName,
        phoneNumber: account.phoneNumber || '',
      });
    } else {
      setFormData({
        handle: '',
        displayName: '',
        phoneNumber: '',
      });
    }
  }, [account, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.handle.trim() || !formData.displayName.trim()) {
      toast({
        title: "Validation Error",
        description: "Handle and display name are required",
        variant: "destructive",
      });
      return;
    }

    if (account) {
      dispatch(updateAccount({
        id: account.id,
        updates: {
          handle: formData.handle,
          displayName: formData.displayName,
          phoneNumber: formData.phoneNumber || undefined,
        },
      }));
      toast({
        title: "Account updated",
        description: `@${formData.handle} has been updated successfully`,
      });
    } else {
      dispatch(addAccount({
        handle: formData.handle,
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber || undefined,
        status: 'connected' as AccountStatus,
        dailyLimit: 100,
        sentToday: 0,
        settings: {
          delaySeconds: 60,
          activeTemplateId: null,
          activePromptId: null,
          respectQuietHours: true,
        },
      }));
      toast({
        title: "Account connected",
        description: `@${formData.handle} has been connected successfully`,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{account ? 'Edit' : 'Connect'} Telegram Account</DialogTitle>
          <DialogDescription>
            {account ? 'Update account information' : 'Add a new Telegram account to manage outreach'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="handle">Username/Handle</Label>
              <div className="flex gap-2">
                <span className="flex items-center text-muted-foreground">@</span>
                <Input
                  id="handle"
                  value={formData.handle}
                  onChange={(e) => setFormData(prev => ({ ...prev, handle: e.target.value }))}
                  placeholder="username"
                  className="flex-1"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                placeholder="+1234567890"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{account ? 'Update' : 'Connect'} Account</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
