import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Settings, Package, Key, Shield, AlertTriangle, ArrowLeft } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { AuthManagement } from './AuthManagement';

type AdminView = 'dashboard' | 'products' | 'auth';

interface AdminPageProps {
  onBack?: () => void;
}

export function AdminPage({ onBack }: AdminPageProps = {}) {
  const { isAdmin, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-8 relative z-[60]">
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access this page.</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-6 pt-24 pb-8 relative z-[60]">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case 'products':
        return <ProductManagement onBack={() => setCurrentView('dashboard')} />;
      case 'auth':
        return <AuthManagement onBack={() => setCurrentView('dashboard')} />;
      default:
        return (
          <div className="container mx-auto px-6 pt-20 pb-8 relative z-[60]">
            <br /><br /><br /><br />
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Button variant="outline" onClick={onBack}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Store
                </Button>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
                <p className="text-muted-foreground">Manage your application settings and content.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('products')}>
                  <br />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Package className="h-6 w-6 text-primary" />
                      <CardTitle>Product Management</CardTitle>
                    </div>
                    <CardDescription>
                      Create, read, update, and delete products in your catalog
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Products
                    </Button>
                    <br /><br />
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentView('auth')}>
                  <br />
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Key className="h-6 w-6 text-primary" />
                      <CardTitle>Auth Management</CardTitle>
                    </div>
                    <CardDescription>
                      Manage authentication codes and user access
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full">
                      <Settings className="mr-2 h-4 w-4" />
                      Manage Auth Codes
                    </Button>
                    <br /><br />
                  </CardContent>
                </Card>
              </div>
          </div>
        );
    }
  };

  return renderContent();
}
