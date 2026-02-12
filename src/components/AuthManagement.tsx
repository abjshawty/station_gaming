import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Save, X, Copy, RefreshCw } from 'lucide-react';
import { authenticatedFetch, API_BASE_URL } from '../utils/api';
import { toast } from 'sonner';

interface AuthCode {
  _id: string;
  code: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  usedAt?: string;
}

interface AuthManagementProps {
  onBack: () => void;
}

export function AuthManagement({ onBack }: AuthManagementProps) {
  const [authCodes, setAuthCodes] = useState<AuthCode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<AuthCode | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    role: 'User'
  });

  const roles = [
    { value: 'User', label: 'User' },
    { value: 'Admin', label: 'Admin' }
  ];

  useEffect(() => {
    loadAuthCodes();
  }, []);

  const loadAuthCodes = async () => {
    try {
      setIsLoading(true);
      const response = await authenticatedFetch(`${API_BASE_URL}/code`);
      const data = await response.json();
      setAuthCodes(data.data || []);
    } catch (error) {
      console.error('Failed to load auth codes:', error);
      toast.error('Failed to load authentication codes');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomCode = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setFormData({ ...formData, code });
  };

  const resetForm = () => {
    setFormData({
      code: '',
      role: 'User'
    });
    setEditingCode(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const codeData = {
        code: formData.code,
        role: formData.role
      };

      if (editingCode) {
        // Update existing code
        const response = await authenticatedFetch(`${API_BASE_URL}/code/${editingCode._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(codeData)
        });

        if (response.ok) {
          toast.success('Auth code updated successfully');
          loadAuthCodes();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error('Failed to update auth code');
        }
      } else {
        // Create new code
        const response = await authenticatedFetch(`${API_BASE_URL}/code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(codeData)
        });

        if (response.ok) {
          toast.success('Auth code created successfully');
          loadAuthCodes();
          setIsDialogOpen(false);
          resetForm();
        } else {
          toast.error('Failed to create auth code');
        }
      }
    } catch (error) {
      console.error('Error saving auth code:', error);
      toast.error('Error saving auth code');
    }
  };

  const handleEdit = (authCode: AuthCode) => {
    setEditingCode(authCode);
    setFormData({
      code: authCode.code,
      role: authCode.role
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (codeId: string) => {
    if (!confirm('Are you sure you want to delete this authentication code?')) return;

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/code/${codeId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Auth code deleted successfully');
        loadAuthCodes();
      } else {
        toast.error('Failed to delete auth code');
      }
    } catch (error) {
      console.error('Error deleting auth code:', error);
      toast.error('Error deleting auth code');
    }
  };

  const handleToggleActive = async (codeId: string, currentStatus: boolean) => {
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/code/${codeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (response.ok) {
        toast.success(`Auth code ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
        loadAuthCodes();
      } else {
        toast.error('Failed to update auth code status');
      }
    } catch (error) {
      console.error('Error updating auth code:', error);
      toast.error('Error updating auth code');
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copied to clipboard');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-6 pt-40 pb-8 relative z-[60]">
      <br /><br /><br /><br />
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Auth Management</h1>
            <p className="text-muted-foreground">Manage authentication codes and user access</p>
          </div>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="mr-2 h-4 w-4" />
              Add Auth Code
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCode ? 'Edit Auth Code' : 'Add New Auth Code'}
              </DialogTitle>
              <DialogDescription>
                {editingCode ? 'Update the authentication code details below.' : 'Create a new authentication code for user access.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="code">6-Digit Code</Label>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                  <Button type="button" variant="outline" onClick={generateRandomCode}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div>
                <Label htmlFor="role">Role</Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  {editingCode ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading authentication codes...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {authCodes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-20">
                <p className="text-muted-foreground">No authentication codes found. Create your first code to get started.</p>
              </CardContent>
            </Card>
          ) : (
            authCodes.map((authCode) => (
              <Card key={authCode._id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-semibold font-mono">{authCode.code}</h3>
                        <Badge variant={authCode.role === 'Admin' ? 'destructive' : 'secondary'}>
                          {authCode.role}
                        </Badge>
                        <Badge variant={authCode.isActive ? 'default' : 'outline'}>
                          {authCode.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span>Created: {formatDate(authCode.createdAt)}</span>
                        {authCode.usedAt && <span>Used: {formatDate(authCode.usedAt)}</span>}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => copyToClipboard(authCode.code)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleToggleActive(authCode._id, authCode.isActive)}
                      >
                        {authCode.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleEdit(authCode)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(authCode._id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
