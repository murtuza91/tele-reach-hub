import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { AIPrompt } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { addPrompt, updatePrompt } from '@/store/slices/promptsSlice';
import { toast } from '@/hooks/use-toast';

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt?: AIPrompt;
}

export function PromptDialog({ open, onOpenChange, prompt }: PromptDialogProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    systemPrompt: '',
    isActive: true,
    isDefault: false,
  });

  useEffect(() => {
    if (prompt) {
      setFormData({
        title: prompt.title,
        systemPrompt: prompt.systemPrompt,
        isActive: prompt.isActive,
        isDefault: prompt.isDefault,
      });
    } else {
      setFormData({
        title: '',
        systemPrompt: '',
        isActive: true,
        isDefault: false,
      });
    }
  }, [prompt, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.systemPrompt.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and system prompt are required",
        variant: "destructive",
      });
      return;
    }

    if (prompt) {
      dispatch(updatePrompt({ id: prompt.id, updates: formData }));
      toast({
        title: "Prompt updated",
        description: `"${formData.title}" has been updated successfully`,
      });
    } else {
      dispatch(addPrompt(formData));
      toast({
        title: "Prompt created",
        description: `"${formData.title}" has been created successfully`,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{prompt ? 'Edit' : 'Create'} AI Prompt</DialogTitle>
          <DialogDescription>
            This prompt will be used to enhance your outreach messages before sending.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Professional & Friendly"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                value={formData.systemPrompt}
                onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                placeholder="You are a professional outreach specialist. Enhance the following message to be..."
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                This prompt will be used to process the template before sending.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">Prompt is available for campaigns</p>
              </div>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="default">Set as Default</Label>
                <p className="text-xs text-muted-foreground">Use this prompt by default</p>
              </div>
              <Switch
                id="default"
                checked={formData.isDefault}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isDefault: checked }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{prompt ? 'Update' : 'Create'} Prompt</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
