import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { CopyTemplate } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { addTemplate, updateTemplate } from '@/store/slices/templatesSlice';
import { toast } from '@/hooks/use-toast';

interface TemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template?: CopyTemplate;
}

export function TemplateDialog({ open, onOpenChange, template }: TemplateDialogProps) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    isActive: true,
    isDefault: false,
  });

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title,
        body: template.body,
        isActive: template.isActive,
        isDefault: template.isDefault,
      });
    } else {
      setFormData({
        title: '',
        body: '',
        isActive: true,
        isDefault: false,
      });
    }
  }, [template, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.body.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and body are required",
        variant: "destructive",
      });
      return;
    }

    if (template) {
      dispatch(updateTemplate({ id: template.id, updates: formData }));
      toast({
        title: "Template updated",
        description: `"${formData.title}" has been updated successfully`,
      });
    } else {
      dispatch(addTemplate(formData));
      toast({
        title: "Template created",
        description: `"${formData.title}" has been created successfully`,
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{template ? 'Edit' : 'Create'} Copy Template</DialogTitle>
          <DialogDescription>
            Use placeholders like {`{{firstName}}`}, {`{{lastName}}`}, and {`{{company}}`} in your message.
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
                placeholder="e.g., Founder Outreach V1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message Body</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Hi {{firstName}},&#10;&#10;I noticed {{company}} is..."
                rows={8}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Available: {`{{firstName}}`}, {`{{lastName}}`}, {`{{company}}`}, {`{{position}}`}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="active">Active</Label>
                <p className="text-xs text-muted-foreground">Template is available for campaigns</p>
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
                <p className="text-xs text-muted-foreground">Use this template by default</p>
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
            <Button type="submit">{template ? 'Update' : 'Create'} Template</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
