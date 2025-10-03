import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { deleteTemplate, updateTemplate } from '@/store/slices/templatesSlice';
import { deletePrompt, updatePrompt } from '@/store/slices/promptsSlice';
import { TemplateDialog } from '@/components/templates/TemplateDialog';
import { PromptDialog } from '@/components/templates/PromptDialog';
import { CopyTemplate, AIPrompt } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';

export default function Templates() {
  const dispatch = useAppDispatch();
  const templates = useAppSelector((state) => state.templates.items);
  const prompts = useAppSelector((state) => state.prompts.items);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<CopyTemplate | undefined>();
  const [editingPrompt, setEditingPrompt] = useState<AIPrompt | undefined>();
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; type: 'template' | 'prompt'; id: string; title: string }>({
    open: false,
    type: 'template',
    id: '',
    title: '',
  });

  const handleEditTemplate = (template: CopyTemplate) => {
    setEditingTemplate(template);
    setTemplateDialogOpen(true);
  };

  const handleEditPrompt = (prompt: AIPrompt) => {
    setEditingPrompt(prompt);
    setPromptDialogOpen(true);
  };

  const handleNewTemplate = () => {
    setEditingTemplate(undefined);
    setTemplateDialogOpen(true);
  };

  const handleNewPrompt = () => {
    setEditingPrompt(undefined);
    setPromptDialogOpen(true);
  };

  const handleDelete = () => {
    if (deleteDialog.type === 'template') {
      dispatch(deleteTemplate(deleteDialog.id));
      toast({
        title: "Template deleted",
        description: `"${deleteDialog.title}" has been removed`,
      });
    } else {
      dispatch(deletePrompt(deleteDialog.id));
      toast({
        title: "Prompt deleted",
        description: `"${deleteDialog.title}" has been removed`,
      });
    }
    setDeleteDialog({ open: false, type: 'template', id: '', title: '' });
  };

  const handleSetDefault = (type: 'template' | 'prompt', id: string) => {
    if (type === 'template') {
      templates.forEach(t => {
        if (t.id === id) {
          dispatch(updateTemplate({ id: t.id, updates: { isDefault: true } }));
        } else if (t.isDefault) {
          dispatch(updateTemplate({ id: t.id, updates: { isDefault: false } }));
        }
      });
      toast({ title: "Default template updated" });
    } else {
      prompts.forEach(p => {
        if (p.id === id) {
          dispatch(updatePrompt({ id: p.id, updates: { isDefault: true } }));
        } else if (p.isDefault) {
          dispatch(updatePrompt({ id: p.id, updates: { isDefault: false } }));
        }
      });
      toast({ title: "Default prompt updated" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates & Prompts</h1>
          <p className="text-muted-foreground">
            Manage your message templates and AI enhancement prompts
          </p>
        </div>
      </div>

      <Tabs defaultValue="templates" className="space-y-4">
        <TabsList>
          <TabsTrigger value="templates">Copy Templates</TabsTrigger>
          <TabsTrigger value="prompts">AI Prompts</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleNewTemplate}>
              <Plus className="h-4 w-4" />
              New Template
            </Button>
          </div>

          {templates.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No templates created yet</p>
                <Button onClick={handleNewTemplate}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Template
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {templates.map((template) => (
                <Card key={template.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{template.title}</CardTitle>
                          {template.isDefault && <Star className="h-4 w-4 fill-warning text-warning" />}
                        </div>
                        <CardDescription>
                          Created {new Date(template.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Badge variant={template.isActive ? 'default' : 'secondary'}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSetDefault('template', template.id)}
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, type: 'template', id: template.id, title: template.title })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto font-mono whitespace-pre-wrap">
                      {template.body}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="prompts" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2" onClick={handleNewPrompt}>
              <Plus className="h-4 w-4" />
              New Prompt
            </Button>
          </div>

          {prompts.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground mb-4">No AI prompts created yet</p>
                <Button onClick={handleNewPrompt}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Prompt
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {prompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{prompt.title}</CardTitle>
                          {prompt.isDefault && <Star className="h-4 w-4 fill-warning text-warning" />}
                        </div>
                        <CardDescription>
                          Created {new Date(prompt.createdAt).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Badge variant={prompt.isActive ? 'default' : 'secondary'}>
                          {prompt.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleSetDefault('prompt', prompt.id)}
                          title="Set as default"
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPrompt(prompt)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteDialog({ open: true, type: 'prompt', id: prompt.id, title: prompt.title })}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto font-mono whitespace-pre-wrap max-h-48">
                      {prompt.systemPrompt}
                    </pre>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TemplateDialog
        open={templateDialogOpen}
        onOpenChange={setTemplateDialogOpen}
        template={editingTemplate}
      />

      <PromptDialog
        open={promptDialogOpen}
        onOpenChange={setPromptDialogOpen}
        prompt={editingPrompt}
      />

      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDialog.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
